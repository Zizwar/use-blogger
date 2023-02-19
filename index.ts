//console.log("2323");
//import type { NextApiRequest, NextApiResponse } from "next";
import { existsSync, readFileSync, writeFileSync } from "fs";

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
const { ID_GOOGLE_BLOG, URL_GOOGLE_BLOG } = process.env;
//get all post each categories
const urlJsonAllPostsCategorie = ({ category, postId = "" }: any) =>
  postId
    ? `${
        URL_GOOGLE_BLOG || "https://www.blogger.com/" + ID_GOOGLE_BLOG
      }/feeds/posts/default/${postId}?alt=json`
    : `${
        URL_GOOGLE_BLOG || "https://www.blogger.com/" + ID_GOOGLE_BLOG
      }/feeds/posts/default${category ? `/-/${category}` : ""}?alt=json`;

//foreach categories urlJsonAllPostsCategorie

//get each id
//const id = dataPosts.feed.entry[0].id.$t;
//const content = dataPosts.feed.entry[0].content.$t;

//fet lllop
function Product({
  id: { $t: _id },
  content: { $t: _content },
  media$thumbnail, //: thumbnail,//{ url: thumbnail },
  published: { $t: published },
  updated: { $t: updated },
  title: { $t: name },
  category,
  link,
}: any) {
  //get videos array
  //const _videos: any = new RegExp("<iframe*(.*?) src='*(.*?)' ", "g").exec(_content) || [];
  const _videos: any = new RegExp(regexs.video, "g").exec(_content) || [];
//  const videos = regexIno(_content, new RegExp(regexs.video, "g")).map(
  //  (video: string = "") => video //.split('"')[1]
  //); //_regexImg(_content);
  const videos = _videos[2] || [];
  console.log("=====" + videos);


  //get image
  const images = regexIno(_content, new RegExp(regexs.src, "g")).map(
    (img: string = "") => img //.split('"')[1]
  ); //_regexImg(_content);

  const content = _content.replace(/(<([^>]+)>)/gi, "");
  function getVar(variable: any, _type: string = "string"): any {
    let _res: any =
      regexIno(content, new RegExp(`${variable}*=(.*?);`, "g")) || [];

    if (_type === "full") return _res;
    let res = _res[0];
    if (_type === "number") return res?.match(/\d+/g).map(Number)[0] || 0;
    if (_type === "array") return res?.split(",");

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
    contentHTML: _content,
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
}

function Products(dataPosts: any = []) {
  return dataPosts.feed?.entry?.map(Product);
}
///
function useBlogger(cb: any, opt: any = []) {
  // const saveTmp ="test";
  const { saveTmp } = opt;
  if (saveTmp && existsSync(`/tmp/${saveTmp}.json`)) {
    console.log("===exist :)");
    const textData: any = readFileSync(`/tmp/${saveTmp}.json`);
    cb(JSON.parse(textData));
    return;
  }
  //
  //console.log("===no file exist :(");
  fetch(urlJsonAllPostsCategorie(opt))
    .then((response) => response.json())
    .then((data) => {
      // console.log("opt=", urlJsonAllPostsCategorie(opt), "data===", data);
      //write file in tmp system
      if (opt.postId) cb(Product(data.entry));
      else cb(Products(data));
      if (saveTmp)
        writeFileSync(`/tmp/${saveTmp}.json`, JSON.stringify(Products(data)));
      /*
      res.status(200).json({
        file,
        data,
      });
*/
    });
}
/*****************/
//https://www.rodude.com/blogger-feed-rss-json/

export default useBlogger;
