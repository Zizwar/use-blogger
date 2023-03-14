const matcher = {
  https: 'https(.*?)"',
  dictionary: "{(.*?)}",
  tuple: "((.*?))",
  array: "[(.*?)]",
  src: ' src="(.*?)" ',
  video: "<iframe*(.*?) src='*(.*?)' ",
  custom: (_r) => _r,
};

function regexIno(content, pattern = new RegExp(matcher.dictionary, "g")) {
  let match;
  const matchArr = [];
  while ((match = pattern.exec(content))) {
    match = match[1]?.trim();
    if (match) matchArr.push(match);
  }
  return matchArr;
}
//get all post each categories
function urlJsonSearchPostsCategories({
  category = "",
  postId = "",
  query = "",
  blogUrl,
  blogId,
}) {
  return `${blogUrl ? `${blogUrl}/feeds` : `https://www.blogger.com/feeds/${blogId}`
    }/posts/default/${postId}${category ? `-/${category}` : ""
    }?alt=json&${query}`;
}
//fet llop
export default class UseBlogger {
  blogUrl = ""; // if blogUrl not req blogId
  blogId = ""; //if blogId not req blogeUrl
  save;
  isBrowser = false;
  data = [];
  category = "";
  postId = "";
  query = "";
  variables = [];
  unselected = [];
  selected = [];
  uncategory = [];
  _callback;

  constructor(props = {}) {
    const { blogId, isBrowser, save, blogUrl = "" } = props;
    this.blogId = blogId;
    this.isBrowser = isBrowser;
    this.save = save;
    this.blogUrl = blogUrl;
  }

  categories(_categories = []) {
    this.category = _categories?.join("/") || "";
    return this;
  }
  uncategories(_categories = []) {
    this.uncategory = _categories;
    return this;
  }
  labels(_categories = []) {
    this.categories(_categories);
    return this;
  }
  unlabels(_categories = []) {
    this.uncategories(_categories);
    return this;
  }
  post(postId = "") {
    this.postId = postId;
    return this;
  }
  //fn query
  search(text = "") {
    this.query += `q=${text}&`;
    return this;
  }
  limit(n = 3) {
    this.query += `max-results=${n}&`;
    return this;
  }
  select(_select = []) {
    this.selected = _select;
  }

  unselect(_select = []) {
    this.unselected = _select;
  }
  skip(n = 1) {
    this.query += `start-index=${n}&`;
    return this;
  }
  orderby(value = "published") {
    //or updated
    this.query += `orderby=${value}&`;
    return this;
  }
  //
  callback(cb) {
    this._callback = cb;
    return this;
  }
  setData(data) {
    this.data = data;
    return this;
  }
  getData() {
    return this.data;
  }

  published(dateMin, dateMax) {
    if (dateMin) this.query += `published-min=${dateMin}&`;
    if (dateMax) this.query += `published-max=${dateMax}&`;
    return this;
  }
  updated(dateMin, dateMax) {
    if (dateMin) this.query += `updated-min=${dateMin}&`;
    if (dateMax) this.query += `updated-max=${dateMax}&`;
    return this;
  }
  async load(variables) {
    try {
      const { category, postId, query, blogUrl, blogId } = this;
      if (!this.data?.length) {
        const url = urlJsonSearchPostsCategories({
          category,
          postId,
          query,
          blogUrl,
          blogId,
        });
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (this.save) this.save(data);
        this.data = await response.json();
      }

      const resault = this.postId
        ? getPost(this.data?.entry, variables)
        : getPosts(this.data, variables);
      if (typeof this._callback === "function") {
        this._callback(resault);
      }
      //selected variable
      if (this.selected.length) {
        resault.data = resault?.data
          .filter((obj) =>
            this.selected.every((prop) => obj.hasOwnProperty(prop))
          )
          .map(
            (obj) =>
              this.selected.reduce((acc, prop) => {
                acc[prop] = obj[prop];
                return acc;
              }, {}) || []
          );
      }

      //unselected variable
      //this.unselected.length && resault?.data?.forEach(key => this.unselected[key] && delete resault.data[key]);
      if (this.unselected.length) {
        resault.data = resault?.data.reduce((acc, obj) => {
          const filteredObj = {};
          for (const key in obj) {
            if (!this.unselected.includes(key)) {
              filteredObj[key] = obj[key];
            }
          }
          if (Object.keys(filteredObj).length > 0) {
            acc.push(filteredObj);
          }
          return acc;
        }, []);
      }
      return resault;
    } catch (error) {
      console.error("There was a problem with the fetch request:", error);
    }
  }
  //clone load
  async exec(variables) {
    return await this.load(variables);
  }
}
function getPost(
  {
    id: { $t: _id },
    content: { $t: _content },
    media$thumbnail, //: thumbnail,//{ url: thumbnail },
    published: { $t: published },
    updated: { $t: updated },
    title: { $t: name },
    category,
    link,
  },
  variables = []
) {
  _content = _content.replace(/&nbsp;/gi, "");
  //get videos array
  const _videos = new RegExp(matcher.video, "g").exec(_content) || [];
  const videos = _videos[2] || "";
  //get image
  const images =
    regexIno(_content, new RegExp(matcher.src, "g"))?.map((img = "") => img) ||
    [];
  const content = _content.replace(/(<([^>]+)>)/gi, "");

  function getVariable({ key, type = "string", regex }) {
    let _res =
      regexIno(_content, new RegExp(regex || `${key}*[:=]*(.*?)[;<]`, "g")) ||
      [];

    if (type === "full") return _res;
    let res = _res[0];
    if (type === "number")
      return res?.match(/\d+(\.\d+)?/g)?.map((_r) => +_r)[0] || 0;
    if (type === "array") return res?.split(",")?.filter((_r) => _r !== "");
    return res;
  }

  const vars = [];

  variables?.forEach(({ key, type, regex, asArray, as }) => {
    const _var = getVariable({ key, type, regex });
    const asOrKey = as || key;
    if (_var) {
      if (asArray) {
        vars[asArray] = {
          ...(vars[asArray] || {}),
          [asOrKey]: _var,
        };
      } else {
        vars[asOrKey] = _var;
      }
    }
  });

  //
  const categories = category?.map((cat) => cat.term) || [];
  const thumbnail = media$thumbnail?.url;
  const id = _id.split("post-")[1];
  const data = {
    id,
    name,
    thumbnail,
    published,
    videos,
    link,
    images,
    text: content,
    html: _content,
    categories,
    category: categories[0],
    updated,
    ...vars,
  };
  if (categories && categories.indexOf("$") !== -1) {
    return { $: data };
  }
  return { data };
}
function getPosts(dataPosts = [], variables) {
  const posts = [];
  const fnk = [];
  dataPosts.feed?.entry?.forEach((entry) => {
    const post = getPost(entry, variables);
    if (post.$) fnk.push(post.$);
    else posts.push(post.data);
  });
  return { data: posts, $: fnk };
}

/*
const smallStringToNum = (smallStr) => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = 0;
  let multiplier = 1;

  for (let i = smallStr.length - 1; i >= 0; i--) {
    const char = smallStr[i];
    const digit = alphabet.indexOf(char);
    result += digit * multiplier;
    multiplier *= 36;
  }

  return result;
};

const convertNum = (strOrNum) => {
  let num;
  if (typeof strOrNum === 'number') {
    num = strOrNum;
  } else if (typeof strOrNum === 'string') {
    // Try to convert the string to a number
    num = Number(strOrNum);
    if (isNaN(num)) {
      throw new Error('Input must be a number or a string that can be converted to a number');
    }
  } else {
    throw new Error('Input must be a number or a string');
  }

  return numToSmallString(num);
};

console.log(convertNum(8277077996046083588)); // Output: "4w5ue5ld5pmc"
console.log(convertNum("4w5ue5ld5pmc")); // Output: 8277077996046083588
console.log(convertNum("8277077996046083588")); // Output: "4w5ue5ld5pmc"

*/