//console.log("2323");
const regexs = {
  https: /https(.*?)"/g,
  dictionary: /{(.*?)}/g,
  tuple: /((.*?))/g,
  array: /[(.*?)]/g,
  src: /src(.*?)" /g,
};
const regexIno = (content, pattern = regexs.dictionary) => {
  let match;
  const matchArr = [];
  while ((match = pattern.exec(text))) {
    match = match[1].trim();
    matchArr.push(match);
    console.log(match);
  }
};
//

//
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
    const image = urlify(_content); //_regexImg(_content);
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
const text = "The quick {brown} fox {jumps} over the lazy dog";
const pattern = /{(.*?)}/g;
let match;
while ((match = pattern.exec(text))) {
  console.log(match[1]); // Output: "brown", "jumps"
}
/*****************/
