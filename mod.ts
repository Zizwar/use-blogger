//console.log("2323");
//import type { NextApiRequest, NextApiResponse } from "next";
//import { existsSync, readFileSync, writeFileSync } from "fs";

const regexs: any = {
  https: 'https(.*?)"',
  dictionary: "{(.*?)}",
  tuple: "((.*?))",
  array: "[(.*?)]",
  src: ' src="(.*?)" ',
  video: "<iframe*(.*?) src='*(.*?)' ",
  custom: (_r: string) => _r,
};
const regexIno = (
  content: string,
  pattern = new RegExp(regexs.dictionary, "g")
) => {

  let match: any;
  const matchArr: any[] = [];
  while ((match = pattern.exec(content))) {
    match = match[1]?.trim();

    if (match) matchArr.push(match);
  }
  return matchArr;
};
//
//all categories
//const categories = data?.feed?.category?.map((cat) => cat.term);

//get all post each categories
const urlJsonSearchPostsCategories = ({
  category = "",
  postId = "",
  query = "",

  blogUrl,// = process.env?.URL_GOOGLE_BLOG,
  blogId, //= process.env?.ID_GOOGLE_BLOG,

}: any) =>
  `${
    blogUrl || "https://www.blogger.com/" + blogId
  }/feeds/posts/default/${postId}${
    category ? `-/${category}` : ""
  }?alt=json${query}`;

/*
      function urlJsonSearchPostsCategories({
  category = "",
  postId = "",
  query = "",
}: any): string {
  return (
    (URL_GOOGLE_BLOG || "https://www.blogger.com/" + ID_GOOGLE_BLOG) +
      "/feeds/posts/default/" +
      postId +
      category && `-/${category}` + "?alt=json&" + query
  );
}*/
//foreach categories urlJsonSearchPostsCategories

//get each id
//const id = dataPosts.feed.entry[0].id.$t;
//const content = dataPosts.feed.entry[0].content.$t;

//fet lllop

///

export default class WinoBlogger {

  blogId: string;
  saveTmp: string;
  isBrowser: boolean;
  data: any = [];
  category: string = "";
  blogUrl: string;
  postId: string = "";
  query: string = "";
  textSearch: string | undefined;
  variables: any;
  constructor(props: any = []) {
    const { blogId, isBrowser, saveTmp, blogUrl } = props;
    this.blogId = blogId;
    this.isBrowser = isBrowser;
    this.saveTmp = saveTmp;
    this.blogUrl = blogUrl;

    //console.log("start qgb");
  }
  get regexs() {
    return regexs;
  }
  categories(cats: string[]) {
    this.category = cats?.join("/") || "";
    return this;
  }
  post(postId: string) {
    this.postId = postId;
    return this;
  }
  search(q: string) {
    this.textSearch = q;
    return this;
  }

  async load(variables: any) {
    //console.log("=====+++B" + variables);
    /*
    if (this.saveTmp && existsSync(`/tmp/${this.saveTmp}.json`)) {
      console.log("===exist :)");
      const textData: any = readFileSync(`/tmp/${this.saveTmp}.json`);
      JSON.parse(textData);
      return (this.data = JSON.parse(textData));
    }
    */
    //

    try {
      const { category, postId, query, blogUrl, blogId, textSearch } = this;

      const response = await fetch(
        urlJsonSearchPostsCategories({
          category,
          postId,
          query,
          blogUrl,
          blogId,
          textSearch,
        })
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this.data = await response.json();
      /*
      if (this.saveTmp)
        writeFileSync(
          `/tmp/${this.saveTmp}.json`,
          JSON.stringify(getPosts(this.data))
        );
        */
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
  /* 
  await fetch(urlJsonSearchPostsCategories(opt))
    .then((response) => response.json())
    .then((data) => {
      // console.log("opt=", urlJsonSearchPostsCategories(opt), "data===", data);
      //write file in tmp system
      if (opt.postId) cb(getPost(data.entry));
      else cb(getPosts(data));
      if (saveTmp)
        writeFileSync(`/tmp/${saveTmp}.json`, JSON.stringify(getPosts(data)));
      res.status(200).json({
        file,
        data,
      });
/
    });
}
*/
  /*****************/
  //https://www.rodude.com/blogger-feed-rss-json/
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
  }: any,
  variables: any = []
): any {
  _content = _content.replace(/&nbsp;/gi, "");
  //get videos array
  //const _videos: any = new RegExp("<iframe*(.*?) src='*(.*?)' ", "g").exec(_content) || [];
  const _videos: any = new RegExp(regexs.video, "g").exec(_content) || [];
  //  const videos = regexIno(_content, new RegExp(regexs.video, "g")).map(
  //  (video: string = "") => video //.split('"')[1]
  //); //_regexImg(_content);
  const videos = _videos[2] || "";
  console.log("=====+++V" + variables);

  //get image
  const images = regexIno(_content, new RegExp(regexs.src, "g")).map(
    (img: string = "") => img //.split('"')[1]
  ); //_regexImg(_content);

  const content = _content.replace(/(<([^>]+)>)/gi, "");

  function getVar(variable: any, value: string = "string"): any {
    let _res: any =
      regexIno(_content, new RegExp(`${variable}*[:=]*(.*?)[;<]`, "g")) || [];
    console.log({ _res });

    if (value === "full") return _res;
    let res = _res[0];
    if (value === "number")
      return res?.match(/\d+(\.\d+)?/g)?.map((_r: any) => +_r)[0] || 0;
    if (value === "array")
      return res?.split(",")?.filter((_r: any) => _r !== "");

    return res;
  }
  //console.log({ variables });
  const vars: any = [];
  variables &&
    Object.entries(variables).forEach(([key, value]: any) => {
      vars[key] = getVar(key, value);
      console.log(`${key}: ${value}`);
    });

  ///
  const categories = category?.map((cat: any) => cat.term) || [];
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

function getPosts(dataPosts: any = [], variables: any) {
  //console.log("====dataPosts",dataPosts);
  //console.log({ variables });
  return dataPosts.feed?.entry?.map((entry: any) => getPost(entry, variables));
}
