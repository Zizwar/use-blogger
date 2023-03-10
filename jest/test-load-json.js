import useBlogger from "../main.js";

const variables = [
  { key: "price", type: "number", regex: "price*[:=]*(.*?)[;<]" },
  { key: "discount", type: "number" },
  { key: "quantityAvailable", type: "number" },
  { key: "currentPrice", type: "number" },
  { key: "sizes", type: "array" },
  { key: "colors", type: "array" },
];

const blogId = "8277077996046083588";
const blogUrl= "https://merymar-shop.blogspot.com"
async function myFunction() {
  const wb = new useBlogger({ blogUrl,blogId });
  const data = await wb.load(variables);
  console.log(data);
}

myFunction();