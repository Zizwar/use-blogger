export const regexs = {
  https: 'https(.*?)"',
  dictionary: "{(.*?)}",
  tuple: "((.*?))",
  array: "[(.*?)]",
  src: ' src="(.*?)" ',
  video: "<iframe*(.*?) src='*(.*?)' ",
  custom: (_r) => _r,
};
function regexIno(content, pattern = new RegExp(regexs.dictionary, "g")) {
  let match;
  const matchArr = [];
  while ((match = pattern.exec(content))) {
    match = match[1]?.trim();
    if (match) matchArr.push(match);
  }
  return matchArr;
}
//

//get all post each categories
export const urlJsonSearchPostsCategories = ({
  category = "",
  postId = "",
  query = "",
  blogUrl = process?.env?.URL_GOOGLE_BLOG,
  blogId = process?.env?.ID_GOOGLE_BLOG,
}) =>
  `${
    blogUrl || "https://www.blogger.com/" + blogId
  }/feeds/posts/default/${postId}${
    category ? `-/${category}` : ""
  }?alt=json&${query}`;

//fet lllop

///
export default class UseBlogger {
  blogUrl; // if blogUrl not req blogId
  blogId; //if blogId not req blogeUrl
  saveTmp;
  isBrowser;
  data;
  category = "";

  postId = "";
  query = "";
  variables = [];
  constructor(props = []) {
    const { blogId, isBrowser, saveTmp, blogUrl } = props;
    this.blogId = blogId;
    this.isBrowser = isBrowser;
    this.saveTmp = saveTmp;
    this.blogUrl = blogUrl;

    //console.log("start qgb");
  }

  categories(cats = []) {
    this.category = cats?.join("/") || "";
    return this;
  }
  labels(cats = []) {
    this.category = cats?.join("/") || "";
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
    //https://www.blogger.com/feeds/BlogId/posts/default?q=searchText&alt=rss
  }
  limit(n = 1) {
    this.query += `max-results=${n}&`;
    return this;
  }
  skip(n) {
    if (n) this.query += `start-index=${n}&`;
    return this;
  }
  orderby(value = "published") {
    //or updated
    this.query += `orderby=${value}&`;
    return this;
  }
  //
  callback(cb) {
    this.callback = cb;
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
      if (!this.data) {
        const response = await fetch(
          urlJsonSearchPostsCategories({
            category,
            postId,
            query,
            blogUrl,
            blogId,
          })
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        this.data = await response.json();
      }
      return this.postId
        ? getPost(this.data?.entry, variables)
        : getPosts(this.data, variables);
    } catch (error) {
      console.error("There was a problem with the fetch request:", error);
    }
  }
  //clone load
  async exec(variables) {
    return await this.load(variables);
  }
  /* 
  await fetch(urlJsonSearchPostsCategories(opt))
    .then((response) => response.json())
    .then((data) => {
      // console.log("opt=", urlJsonSearchPostsCategories(opt), "data===", data);
      //write file in tmp system
      if (opt.postId) cb(getPost(data.entry));
      else cb(getPosts(data));
    });
}
*/
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
  const _videos = new RegExp(regexs.video, "g").exec(_content) || [];

  const videos = _videos[2] || "";

  //get image
  const images =
    regexIno(_content, new RegExp(regexs.src, "g"))?.map((img = "") => img) ||
    [];

  const content = _content.replace(/(<([^>]+)>)/gi, "");

  function getVar(variable, value = "string") {
    let _res =
      regexIno(_content, new RegExp(`${variable}*[:=]*(.*?)[;<]`, "g")) || [];
    //console.log({ _res });

    if (value === "full") return _res;
    let res = _res[0];
    if (value === "number")
      return res?.match(/\d+(\.\d+)?/g)?.map((_r) => +_r)[0] || 0;
    if (value === "array") return res?.split(",")?.filter((_r) => _r !== "");

    return res;
  }
  //console.log({ variables });
  const vars = [];
  variables &&
    Object.entries(variables).forEach(([key, value]) => {
      vars[key] = getVar(key, value);
      //  console.log(`${key}: ${value}`);
    });

  ///
  const categories = category?.map((cat) => cat.term) || [];
  const thumbnail = media$thumbnail?.url;
  const id = _id.split("post-")[1];

  return {
    id,
    name,
    thumbnail,
    published,
    videos,
    link,
    images,
    content,
    contentHTML: _content,
    categories,
    category: categories[0],
    updated,
    ...vars,
  };
}

function getPosts(dataPosts = [], variables) {
  const posts = [];
  dataPosts.feed?.entry?.forEach((entry) => {
    const post = getPost(entry, variables);
    if (post) {
      posts.push(post);
    }
  });
  return posts;
}
/*
function getPosts(dataPosts = [], variables) {
 return dataPosts.feed?.entry?.map((entry) => getPost(entry, variables));
}*/
