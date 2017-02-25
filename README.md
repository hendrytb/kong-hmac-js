# kong-hmac-js

JS module for HMAC Authentication with Kong

# Installation

```
$ npm install --save kong-hmac
```

# Usage

GET request:

```
const request = require("request");
const generateRequestHeaders = require("kong-hmac");

// GET
const userName = "user";
const secret = "secret";
const url = "https://example.com/items";

let headers = generateRequestHeaders(userName, secret, url);

let options = {
    url: url,
    method: "GET",
    headers: headers
}

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body));
    } else {
        console.log("error:" + response.statusCode);
        console.log(body);
    }
});
```

POST request:

```
const request = require("request");
const generateRequestHeaders = require("kong-hmac");

// POST
const userName = "user";
const secret = "secret";
const url = "https://example.com/items";
const data = { "a" : "x" };
const contentType = "application/json";

let headers = generateRequestHeaders(userName, secret, url, JSON.stringify(data), contentType);

    let options = {
    url: url,
    method: "POST",
    headers: headers,
    json: data 
 }

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    } else {
        console.log("error:" + response.statusCode);
        console.log(body);
    }
});
```

Example:

```
$ mkdir /tmp/test-hmac; cd /tmp/test-hmac
$ npm install --save kong-hmac request
$ npm install --save-dev babel-cli babel-preset-es2015
$ babel-node --presets es2015 test-get.js
```

# Reference

[peter-evans/kong-hmac-python](https://github.com/peter-evans/kong-hmac-python)

# License

MIT License - see the [LICENSE](https://github.com/y-zono/kong-hmac-js/blob/master/LICENSE) file for details