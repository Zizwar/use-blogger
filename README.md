# UseBlogger

This is a JavaScript ES6 module that can be used to fetch data from a Blogger blog's json API without Token.

#Dependencies
There are no external dependencies needed for this module.

# Installation
You can download the main.js file and use it in your project, or install it using npm:
```sh
npm install use-blogger --save
```

```js
import UseBlogger from "use-blogger";

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
  //const blogUrl = "https://<name-your-blogger>.blogspot.com/"

  const wb = new UseBlogger({ blogUrl, blogId });
  const res = await wb.load(variables);
  console.log(res.data);
  console.log("lngth=" + res?.data.length)
}

myJsonBlogger();
```

# API
The UseBlogger class is the main class of this module and is responsible for making requests to the Blogger API.

# Constructor
new UseBlogger(props): Creates a new instance of the UseBlogger class with the following properties:
- 
- props.blogId (optional): The ID of the blog to fetch data from.
- props.blogUrl (optional): The URL of the blog to fetch data from.
- props.isBrowser (optional): If true, the request is made in the browser environment. Default is - false.
- props.save (optional): A callback function to save data from the response.
- Methods
- categories(_categories): Sets the categories to fetch data from. Takes an array of strings as input.
- uncategories(_categories): Sets the categories to exclude from the fetched data. Takes an array of - strings as input.
- labels(_categories): Alias for categories.
- unlabels(_categories): Alias for uncategories.
- post(postId): Sets the ID of the post to fetch.
- search(text): Adds a search query to the request.
- limit(n): Sets the maximum number of posts to fetch.
- select(_select): Selects certain fields to include in the response.
- unselect(_select): Excludes certain fields from the response.
- skip(n): Sets the number of posts to skip.
- orderby(value): Sets the field to order the response by.
- callback(cb): Sets a callback function to execute after the data is fetched.
- setData(data): Sets the data for the current instance.
- getData(): Returns the data for the current instance.
- published(dateMin, dateMax): Sets the range of published dates to include in the response.
- updated(dateMin, dateMax): Sets the range of updated dates to include in the response.
- load(variables): Makes a request to the Blogger API and returns the response. Takes an array of objects that define the data to be fetched.
regexIno
A helper function to extract data from a string using regular expressions.