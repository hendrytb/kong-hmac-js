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

const userName = "user";
const secret = "secret";
const url = "https://example.com/items";
const method = "GET";
const httpVersion = "HTTP/1.0"; // default "HTTP/1.1"

const params = {
    userName: userName,
    secret: secret,
    url: url,
    method: method,
    httpVersion: httpVersion
}

let headers = generateRequestHeaders(params);

let options = {
    url: url,
    method: method,
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

const userName = "user";
const secret = "secret";
const url = "https://example.com/items";
const method = "POST";
const httpVersion = "HTTP/1.0"; // default "HTTP/1.1"

const data = {
  "name" : "X"
};
const contentType = "application/json";

const params = {
    userName: userName,
    secret: secret,
    url: url,
    method: method,
    data: JSON.stringify(data),
    contentType: contentType,
    httpVersion: httpVersion
}

let headers = generateRequestHeaders(params);

let options = {
    url: url,
    method: method,
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

UPDATE request:

```
const request = require("request");
const generateRequestHeaders = require("kong-hmac");

const userName = "user";
const secret = "secret";
const url = "https://example.com/items";
const method = "UPDATE";
const httpVersion = "HTTP/1.0"; // default "HTTP/1.1"

const data = {
  "name" : "Y"
};
const contentType = "application/json";

const params = {
    userName: userName,
    secret: secret,
    url: url,
    method: method,
    data: JSON.stringify(data),
    contentType: contentType,
    httpVersion: httpVersion
}

let headers = generateRequestHeaders(params);

let options = {
    url: url,
    method: method,
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

DELETE request:

```
const request = require("request");
const generateRequestHeaders = require("kong-hmac");

const userName = "user";
const secret = "secret";
const url = "https://example.com/items/1";
const method = "DELETE";
const httpVersion = "HTTP/1.0"; // default "HTTP/1.1"

const params = {
    userName: userName,
    secret: secret,
    url: url,
    method: method,
    httpVersion: httpVersion
}

let headers = generateRequestHeaders(params);

let options = {
    url: url,
    method: method,
    headers: headers
}

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("statusCode:" + response.statusCode);
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