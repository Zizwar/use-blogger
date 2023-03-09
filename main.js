export const matcher = {
  https: 'https(.*?)"',
  dictionary: "{(.*?)}",
  tuple: "((.*?))",
  array: "[(.*?)]",
  src: ' src="(.*?)" ',
  video: "<iframe*(.*?) src='*(.*?)' ",
  custom: (_r: string) => _r,
};

export default class WinoBlogger {
  blogUrl: string; // if blogUrl not req blogId
  blogId: string; //if blogId not req blogeUrl
  saveTmp: any;
  isBrowser: boolean;
  data: any;
  category: string = "";
  postId: string = "";
  query: string = "";
  variables: any[] = [];

  constructor(props: {
    blogId?: string;
    isBrowser: boolean;
    saveTmp: any;
    blogUrl?: string;
  }) {
    const { blogId = "", isBrowser, saveTmp, blogUrl = "" } = props || [];
    this.blogId = blogId;
    this.isBrowser = isBrowser;
    this.saveTmp = saveTmp;
    this.blogUrl = blogUrl;
  }

  categories(cats: string[] = []): WinoBlogger {
    this.category = cats?.join("/") || "";
    return this;
  }

  labels(cats: string[] = []): WinoBlogger {
    this.category = cats?.join("/") || "";
    return this;
  }

  post(postId: string = ""): WinoBlogger {
    this.postId = postId;
    return this;
  }

  //fn query
  search(text: string = ""): WinoBlogger {
    this.query += `q=${text}&`;
    return this;
  }

  limit(n: number = 3): WinoBlogger {
    this.query += `max-results=${n}&`;
    return this;
  }

  skip(n: number): WinoBlogger {
    if (n) this.query += `start-index=${n}&`;
    return this;
  }

  orderby(value: string = "published"): WinoBlogger {
    //or updated
    this.query += `orderby=${value}&`;
    return this;
  }

  //
  callback(cb: any): WinoBlogger {
    this.callback = cb;
    return this;
  }

  setData(data: any): WinoBlogger {
    this.data = data;
    return this;
  }

  getData(): any {
    return this.data;
  }

  published(dateMin: string, dateMax: string): WinoBlogger {
    if (dateMin) this.query += `published-min=${dateMin}&`;
    if (dateMax) this.query += `published-max=${dateMax}&`;
    return this;
  }

  updated(dateMin: string, dateMax: string): WinoBlogger {
    if (dateMin) this.query += `updated-min=${dateMin}&`;
    if (dateMax) this.query += `updated-max=${dateMax}&`;
    return this;
  }

  async load(variables: any[]): Promise<any> {
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
  async exec(variables: any) {
    return await this.load(variables);
  }
}
//

interface Variable {
  key: string;
  type?: "string" | "number" | "array" | "full";
  regex?: string;
}

//

interface Category {
  term: string;
}
interface Data {
  id: string;
  name: string;
  thumbnail: string | undefined;
  published: string;
  videos: string;
  link: {
    [key: string]: string;
  };
  images: string[];
  text: string;
  html: string;
  categories: string[];
  category: string;
  updated: string;
  [key: string]: any;
}
interface Entry {
  id: {
    $t: string;
  };
  content: {
    $t: string;
  };
  media$thumbnail?: {
    url: string;
  };
  published: {
    $t: string;
  };
  updated: {
    $t: string;
  };
  title: {
    $t: string;
  };
  category?: Category[];
  link: {
    [key: string]: string;
  };
}
//
function getPost(
  {
    id: { $t: _id },
    content: { $t: _content },
    media$thumbnail,
    published: { $t: published },
    updated: { $t: updated },
    title: { $t: name },
    category,
    link,
  }: Entry,
  variables: Variable[] = []
) {
  _content = _content.replace(/&nbsp;/gi, "");

  const _videos = new RegExp(matcher.video, "g").exec(_content) || [];
  const videos: string = _videos[2] || "";

  const images: string[] =
    regexIno(_content, new RegExp(matcher.src, "g"))?.map((img = "") => img) ||
    [];

  function getVar({ key, type = "string", regex }: Variable) {
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

  const vars: { [key: string]: any } = {};
  variables &&
    variables.forEach(({ key, type, regex }: Variable) => {
      vars[key] = getVar({ key, type, regex });
    });

  const categories: string[] = category?.map((cat) => cat.term) || [];
  const thumbnail: string | undefined = media$thumbnail?.url;
  const id: string = _id.split("post-")[1];

  const data: Data = {
    id,
    name,
    thumbnail,
    published,
    videos,
    link,
    images,
    text: _content.replace(/(<([^>]+)>)/gi, ""),
    html: _content,
    categories,
    category: categories[0],
    updated,
    ...vars,
    content: "",
    contentHTML: "",
  };
  if (categories?.includes("$")) return { $: data };
  return { data };
}

function getPosts(dataPosts: any, variables: any) {
  const posts: any[] = [];
  const fnk: any[] = [];
  dataPosts.feed?.entry?.forEach((entry: any) => {
    const post = getPost(entry, variables);
    if (post.$) fnk.push(post.$);
    else posts.push(post.data);
  });
  return { data: posts, $: fnk };
}

function regexIno(
  content: string,
  pattern: RegExp = new RegExp(matcher.dictionary, "g")
): string[] {
  let match;
  const matchArr = [];
  while ((match = pattern.exec(content))) {
    match = match[1]?.trim();
    if (match) matchArr.push(match);
  }
  return matchArr;
}

function urlJsonSearchPostsCategories({
  category = "",
  postId = "",
  query = "",
  blogUrl,
  blogId,
}: {
  category?: string;
  postId?: string;
  query?: string;
  blogUrl?: string;
  blogId?: string;
}): string {
  return `${
    blogUrl || "https://www.blogger.com/" + blogId
  }/feeds/posts/default/${postId}${
    category ? `-/${category}` : ""
  }?alt=json&${query}`;
}
