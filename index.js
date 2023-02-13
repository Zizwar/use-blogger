//console.log("2323");
const _regexImg = (content) => {
  var regex = /(https?:\/\/[^ ]*\.(?:gif|png|jpg|jpeg))/i;

  if (new RegExp(regex).test(content)) {
    const imgurl = regex.exec(content)[0];
    return imgurl;
  }
  return null;
};
const data = [];

//all categories
const categories = data?.feed?.category?.map((cat) => cat.term);

//get all post each categories
const linkJsonAllPostsCategorie = (categorie = "") =>
  `${process.env.LINK_GOOGLE_BLOGGER}feeds/posts/default/-/${categorie}?alt=json`;

//foreach categories linkJsonAllPostsCategorie

//get each id
//const id = dataPosts.feed.entry[0].id.$t;
//const content = dataPosts.feed.entry[0].content.$t;

//fet lllop
dataPosts.feed.entry.map(
  ({
    id: { $t: id },
    content: { $t: _content },
    media$thumbnail: { url: thumbnail },
    published: { $t: published },
    updated: { $t: updated },
    title: { $t: title },
    category,
    link,
  }) => {
    const image = _regexImg(_content);
    const content = _content.replace(/(<([^>]+)>)/gi, "");
    const categories = category.map((cat) => cat.term);
    return {
      id,
      title,
      thumbnail,
      published,
      title,
      link,
      image,
      content,
      categories,
    };
  }
);
///


/*****************/
