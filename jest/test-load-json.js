import WinoBlogger from "wino-blogger";

const variables = [
  { key: "price", type: "number", regex: "price*[:=]*(.*?)[;<]" },
  { key: "discount", type: "number" },
  { key: "quantityAvailable", type: "number" },
  { key: "currentPrice", type: "number" },
  { key: "sizes", type: "array" },
  { key: "colors", type: "array" },
];

const blogId = "8277077996046083588";

async function myFunction() {
  const wb = new WinoBlogger({ blogId });
  const data = await wb.load(variables);
  console.log(data);
}

myFunction();