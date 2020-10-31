const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//Server Node.js

//Create the server and save it to an object
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const productData = JSON.parse(data);
const slugs = productData.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%CARDS%}', cardsHtml);
    res.end(output);
  }

  //Product Page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const productP = productData[query.id];
    const output = replaceTemplate(tempProduct, productP);
    res.end(output);
  }

  //API page
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }

  //Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-header': 'I am awesome',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});
//Server needs to listen for requests
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});

/* Node Js Files
const textIn = fs.readFile('./txt/input.txt', 'utf-8' ,(err,data) => {
    console.log(data);
});
console.log('Reading File...');
const textOut = `This is what we know about avocado: ${textIn}. Created on ${Date.now()}`;

//More on reading data asynchronously
fs.readFile('./txt/start.txt', 'utf-8' , (err,data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8' , (err,data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8' , (err,data3) => {
            console.log(data3);
            fs.writeFile('./txt/final.txt', `${data1}\n${data2}`, err => {
                console.log('Your file is written.');
        })
    })
    })
});

fs.writeFile('./txt/output.txt', textOut , (err,data) => {

});
console.log('File written!');*/
