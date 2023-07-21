# UseBlogger
The UseBlogger library is a JavaScript ES6 module that allows developers to easily retrieve data from a Blogger blog's JSON API without requiring a token. The library organizes all photos and videos in a post into separate groups, and collects all values defined in the variables, returning all threads in JSON format.

To use the library, simply import it into your project and create a new instance of the UseBlogger class, passing in the ID or URL of the blog you want to fetch data from. You can then call the load method on your UseBlogger instance and pass in an array of objects that define the data you want to fetch. These objects should include a key property to specify the name of the variable, a type property to specify the data type, and any additional information necessary to extract the value of the variable if needed.

The UseBlogger class has several methods that allow you to further customize your data request, such as setting categories or labels to fetch data from or excluding categories or labels from the fetched data, setting the ID of a specific post to fetch, adding a search query to the request, setting the maximum number of posts to fetch, selecting or excluding certain fields from the response, setting the number of posts to skip, and setting the field to order the response by.

The UseBlogger class also has methods for setting the range of published or updated dates to include in the response, as well as methods for setting a callback function to execute after the data is fetched, setting the data for the current instance, and getting the data for the current instance.
# Dependencies
There are no external dependencies needed for this module.


# Installation
You can download the main.js file and use it in your project, or install it using npm:
```sh
npm install use-blogger --save
```
in deno land
```js
import * as denoblogger from "https://deno.land/x/denoblogger@v0.9.3/mod.js";
```
# Usage
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
The variables array is an array of objects that defines the variables to be extracted from a Blogger API using the UseBlogger library. 

Each object in the array contains properties that specify the name of the variable (key), the data type of the variable (type), and additional information about the variable if necessary. 

For example, the first object in the array specifies that the variable name is price, the data type is number, and the regular expression to extract the value of the variable from the blog post is "price*[:=]*(.*?)[;<]". 

The second object specifies that the variable name is discount and the data type is number, but no additional information is needed to extract the value of the variable. 

The third object specifies that the variable name is quantityAvailable, the data type is number, and the as property is used to provide an alias for the variable (qnt). 

The fourth object specifies that the variable name is currentPrice and the data type is number, but no additional information is needed to extract the value of the variable. 

The fifth and sixth objects specify that the variable names are sizes and colors, respectively, and the data type is array. The asArray property is used to provide an alias for the variables (options). 

# API
The UseBlogger class is the main class of this module and is responsible for making requests to the Blogger API.

# Constructor
new UseBlogger(props): Creates a new instance of the UseBlogger class with the following properties:

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
# Demo in Deno
https://dash.deno.com/playground/denoblogger
