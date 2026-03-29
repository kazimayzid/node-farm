const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate')


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const {query, pathname} = (url.parse(req.url, true));
console.log(query);


  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

   const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
   const output = tempOverview.replace('{%PRODUCT_CARD%}', cardHtml)
  
    res.end(output);
  } else if (pathname === "/product") {
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output);
  }
  else if (pathname === "/api") { 
      res.writeHead(200, { "content-type": "application/json" });
      res.end(data);
   
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(3000, () => {
  console.log("Listening to requests on port 3000");
});
