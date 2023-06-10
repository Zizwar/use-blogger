import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
import  denoblogger from "https://deno.land/x/denoblogger@v0.9.4/main.js";

/*
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



  const blogId = "8277077996046083588";
  //or
  const blogUrl = ""
const callback=(res)=>{
    console.info(res.data);
  const name =JSON.parse( res.data[0]?.text)?.name
  console.log('name=',name)
  //console.log("name =", res?.data[0].options);
  console.log("lngth=" + res?.data.length)

serve((req: Request) => new Response(JSON.stringify( res)));
}

  const wb = new  denoblogger({ blogUrl, blogId });
  wb.categories(["json"]).select(["text"])
  //wb.callback(callback).load(variables);
  const res = await wb.load(variables);
   

    console.info(res.data);
  const name =JSON.parse( res.data[0]?.text)?.name
  console.log('name=',name)
  //console.log("name =", res?.data[0].options);
  console.log("lngth=" + res?.data.length)
*/

/*
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
  wb.categories(["json"]).select(["text"])
  const res = await wb.load(variables);
  console.info(res.data);
  const name =JSON.parse( res.data[0]?.text)?.name
  console.log('name=',name)
  //console.log("name =", res?.data[0].options);
  console.log("lngth=" + res?.data.length)
}

myJsonBlogger();
*/
const variables = [
  { key: "price", type: "number", regex: "price*[:=]*(.*?)[;<]" },
  { key: "discount", type: "number" },
  { key: "quantityAvailable", type: "number" },
  { key: "currentPrice", type: "number" },
  { key: "sizes", type: "array" },
  { key: "colors", type: "array" },
];

const blogId = "8277077996046083588";
  const wb = new denoblogger({ blogId });
async function myFunction() {


 wb.select(["text","price","discount","quantityAvailable","currentPrice","colors","sizes"]);
 wb.unselect(["html"]);
  const {data,$} = await wb.load(variables);
  console.log(data);
  serve((req: Request) => new Response(JSON.stringify( data)));
}

myFunction();

