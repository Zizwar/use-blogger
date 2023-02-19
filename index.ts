//console.log("2323");
//import type { NextApiRequest, NextApiResponse } from "next";
import { existsSync, readFileSync, writeFileSync } from "fs";

const regexs: any = {
  https: 'https(.*?)"',
  dictionary: "{(.*?)}",
  tuple: "((.*?))",
  array: "[(.*?)]",
  src: ' src="(.*?)" ',
  video: "<iframe*(.*?) src='*(.*?) ",
  custom: (_r: any) => _r,
};
const regexIno = (
  content: string,
  pattern = new RegExp(regexs.dictionary, "g")
) => {
  let match;
  const matchArr = [];
  while ((match = pattern.exec(content))) {
    match = match[1].trim();
    matchArr.push(match);
  }
  return matchArr;
};
//
//all categories
//const categories = data?.feed?.category?.map((cat) => cat.term);

//get all post each categories
const linkJsonAllPostsCategorie = ({ category, postId = "" }: any) =>
  postId
    ? `https://www.blogger.com/feeds/${process.env.ID_GOOGLE_BLOG}/posts/default/${postId}?alt=json`
    : `https://www.blogger.com/feeds/${
        process.env.ID_GOOGLE_BLOG
      }/posts/default${category ? `/-/${category}` : ""}?alt=json`;
// `${process.env.LINK_GOOGLE_BLOGGER}feeds/posts/default/-/${categorie}?alt=json`;

//foreach categories linkJsonAllPostsCategorie

//get each id
//const id = dataPosts.feed.entry[0].id.$t;
//const content = dataPosts.feed.entry[0].content.$t;

//fet lllop
const product = ({
  id: { $t: _id },
  content: { $t: _content },
  media$thumbnail, //: thumbnail,//{ url: thumbnail },
  published: { $t: published },
  updated: { $t: updated },
  title: { $t: name },
  category,
  link,
}: any) => {
  const images = regexIno(_content, new RegExp(regexs.src, "g")).map(
    (img: string = "") => img //.split('"')[1]
  ); //_regexImg(_content);
  const videos = regexIno(_content, new RegExp(regexs.video, "g")).map(
    (viddeo: string = "") => viddeo[1] //img.split('"')[1]
  ); //_regexImg(_content);

  const content = _content.replace(/(<([^>]+)>)/gi, "");
  function getVar(variable: any, _type: string = "string"): any {
    let _res: any =
      regexIno(content, new RegExp(`${variable}*=(.*?);`, "g")) || [];

    if (_type === "full") return _res;
    let res = _res[0];
    if (_type === "number") return res?.match(/\d+/g).map(Number)[0] || 0;
    if (_type === "array") {
      res = res?.split(",");
    }

    return res;
  }

  const price = getVar("price", "number");
  const discount = getVar("discount", "number");
  const quantityAvailable = getVar("quantityAvailable", "number");
  const currentPrice = getVar("currentPrice ", "number");

  const sizes = getVar("sizes ", "array");
  const colors = getVar("colors ", "array");

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
    categories,
    category: categories[0],
    price,
    discount,
    quantityAvailable,
    currentPrice,
    sizes,
    colors,
    updated,
  };
};

function products(dataPosts: any = []) {
  return dataPosts.feed?.entry?.map(product);
}
///
async function useBlogger(opt: any = []): any {
  new Promise((resolve, _reject) => {
  // const saveTmp ="test";
  const { saveTmp } = opt;
  if (saveTmp && existsSync(`/tmp/${saveTmp}.json`)) {
    console.log("===exist :)");
    const textData: any = readFileSync(`/tmp/${saveTmp}.json`);
    resolve(JSON.parse(textData));
    return;
  }
  //
  //console.log("===no file exist :(");
  fetch(linkJsonAllPostsCategorie(opt))
    .then((response) => response.json())
    .then((data) => {
      // console.log("opt=", linkJsonAllPostsCategorie(opt), "data===", data);
      //write file in tmp system
      if (opt.postId) resolve(product(data.entry));
      else resolve(products(data));
      if (saveTmp)
        writeFileSync(`/tmp/${saveTmp}.json`, JSON.stringify(products(data)));
      /*
      res.status(200).json({
        file,
        data,
      });
*/
    });
  })
}
/*****************/
//https://www.rodude.com/blogger-feed-rss-json/

export default useBlogger;
