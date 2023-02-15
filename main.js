window["cbdata"] = (data) => {
  alert(2323);
  console.log("olalal=", data);
};
const URL_BLOGGER_BROWSER = ({ blogId, categorie, callback }) =>
  `https://www.blogger.com/feeds/${blogId}/posts/default${
    categorie ? "/-/" + categorie : ""
  }/?${callback ? "callback=" + callback : ""}&alt=json`;

export class QueryGBlogger {
  constructor({ blogId, isBrowser }) {
    this.blogId = blogId;
    this.isBrowser = isBrowser;
    console.log('start qgb')
  }
  get data() {
    // if (this.isBrowser) {
    const url = URL_BLOGGER_BROWSER({
      blogId: this.blogId,
      callback: this.callback ? "cbdata" : undefined,
    });
    return url;
    let script = document.createElement("script");
    script.src = url;
    document.body.append(script);
  }

  //  }
}
