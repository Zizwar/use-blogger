//console.log("2323");
//import type { NextApiRequest, NextApiResponse } from "next";
import { existsSync, readFileSync, writeFileSync } from "fs";


const regexs = {
  https: /https(.*?)"/g,
  dictionary: /{(.*?)}/g,
  tuple: /((.*?))/g,
  array: /[(.*?)]/g,
  src: / src(.*?)" /g,
};
const regexIno = (content: string, pattern = regexs.dictionary) => {
  let match;
  const matchArr = [];
  while ((match = pattern.exec(content))) {
    match = match[1].trim();
    matchArr.push(match);
    console.log(match);
  }
  return matchArr;
};
//
//all categories
//const categories = data?.feed?.category?.map((cat) => cat.term);

//get all post each categories
const linkJsonAllPostsCategorie = (categorie: any) =>
  `https://www.blogger.com/feeds/${process.env.ID_GOOGLE_BLOG}/posts/default${
    categorie ? "/-/" + categorie : ""
  }/?alt=json`;
// `${process.env.LINK_GOOGLE_BLOGGER}feeds/posts/default/-/${categorie}?alt=json`;

//foreach categories linkJsonAllPostsCategorie

//get each id
//const id = dataPosts.feed.entry[0].id.$t;
//const content = dataPosts.feed.entry[0].content.$t;

//fet lllop
const fetchProducts = (dataPosts: any = []) =>
  dataPosts.feed?.entry?.map(
    ({
      id: { $t: id },
      content: { $t: _content },
      media$thumbnail, //: thumbnail,//{ url: thumbnail },
      published: { $t: published },
      updated: { $t: updated },
      title: { $t: title },
      category,
      link,
    }: any) => {
      const image = regexIno(_content, regexs.src); //_regexImg(_content);
      const content = _content.replace(/(<([^>]+)>)/gi, "");
      const price = regexIno(_content, regexs.dictionary);
      const categories = category?.map((cat: any) => cat.term);
      const thumbnail = media$thumbnail?.url;
      return {
        id,
        title,
        thumbnail,
        published,
        link,
        image,
        content,
        categories,
        price,
        updated,
      };
    }
  );
///
const useBlogger = (cb: any) => {
  const file = "test";
  if (existsSync(`/tmp/${file}.json`)) {
   // console.log("===exist :)");
    const textData:any = readFileSync(`/tmp/${file}.json`);

    cb(JSON.parse(textData));
    return;
  }
  //
  //console.log("===no file exist :(");

  fetch(linkJsonAllPostsCategorie(null))
    .then((response) => response.json())
    .then((data) => {
      //write file in tmp system
      writeFileSync(`/tmp/${file}.json`, JSON.stringify(data));
      /*
      res.status(200).json({
        file,
        data,
      });
*/
      cb(fetchProducts(data));
    });
};
/*****************/
//https://www.rodude.com/blogger-feed-rss-json/

export default useBlogger;
