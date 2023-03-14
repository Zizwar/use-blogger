import UseBlogger from "../main.js";
//import UseBlogger from "use-blogger";

const variables = [
  { key: "price", type: "number", regex: "price*[:=]*(.*?)[;<]" },
  { key: "discount", type: "number" },
  { key: "quantityAvailable", type: "number", as: "qnt" },
  { key: "currentPrice", type: "number" },
  { key: "sizes", type: "array", asArray: "options" },
  {
    key: "colors", type: "array", asArray: "options"
  },
];


async function myJsonBlogger() {
  const blogId = "8277077996046083588";
  //or
  const blogUrl = ""

  const wb = new UseBlogger({ blogUrl, blogId });
  wb.unselect(["html","text","price","options"])
  const res = await wb.load(variables);
  console.info(res.data);
  //console.log("name =", res?.data[0].options);
  console.log("lngth=" + res?.data.length)
}

myJsonBlogger();