const request = require("request");
const generateRequestHeaders = require("kong-hmac");

const userName = "foo";
const secret = "bar";
const url = "http://localhost:8000/v2/init?platform=android&version=2.16.0&category_version=3.4"; //change localhost:8000 to kong url
const method = "GET";
const httpVersion = "HTTP/1.0"; // default "HTTP/1.1"

const params = {
    userName: userName,
    secret: secret,
    url: url,
    method: method,
    httpVersion: httpVersion,
    host: "apimm",
    token: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRhaGFyaW1hbGwuY29tIiwidWlkIjoiODcwNSIsIm1haWwiOiJheml6QG1hdGFoYXJpbWFsbC5jb20iLCJuYW1lIjoiQXppeiIsImV4cGlyZWRfdGltZSI6IjIwMTctMDktMDEgMTQ6Mzk6MzgiLCJyZWZyZXNoX3Rva2VuIjoiMjlkMTE2NWI2MWVmN2RjNjJjZWNmMDBlYTIyYjFkOTMiLCJjbGllbnRfaWQiOiJBbmRyb2lkX3YyIiwiY2xpZW50X3NlY3JldCI6ImZkMWNlNTM5MmQyYzYzMWI3ODkxZGUzN2MzZDJjNTJkIiwidXNlcl9sb2dpbl9kZXZpY2VfaWQiOiI4YWFjYWQ0MS03ZTRlLTQ3YmMtYmUyMy1hZDUzZmY1ZGNmN2EiLCJjbGllbnRfdmVyc2lvbiI6IjIuMTYuMCJ9.1daekw1qNQK5HUJRucVoIdYcglEssM7iMwJYQVIi4EU"
}

let headers = generateRequestHeaders(params);

let options = {
    url: url,
    method: method,
    headers: headers
}

request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(JSON.parse(body));
    } else {
        console.log("error:" + response.statusCode);
        console.log(body);
    }
});