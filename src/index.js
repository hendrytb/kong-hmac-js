"use strict";

const util = require("util");
const urllib = require("url");
const crypto = require("crypto");

module.exports = function (userName, secret, url, data = null, contentType = null)
{
    let createDateHeader = function()
    {
        return new Date().toGMTString()
    }

    let getHeadersString = function(signatureHeaders)
    {
        let headers = "";
        for (var [key, val] of signatureHeaders) {
            if (headers !== "") {
                headers += " ";
            }
            headers += key;
        }
        return headers;
    }

    let getSignatureString = function(signatureHeaders)
    {
        let sigString = "";
        for (var [key, val] of signatureHeaders) {
            if (sigString !== "") {
                sigString += "\n";
            }
            if (key.toLowerCase() === "request-line") {
                sigString += val;
            } else {
                sigString += key.toLowerCase() + ": " + val;
            }
        }
        return sigString;
    }

    let sha1HashBase64 = function(signatureString, secret)
    {
        return crypto.createHmac("sha1", secret).update(signatureString).digest("base64")
    }

    // Determine request method
    let requestMethod;
    if (!url || !contentType) {
        requestMethod = "GET";
    } else {
        requestMethod = "POST";
    }

    // Build the request-line header
    let parsedUrl = urllib.parse(url);
    let targetUrl = parsedUrl.host;
    if (parsedUrl.path) {
        targetUrl += parsedUrl.path;
    }
    let requestLine = requestMethod + " " + targetUrl + " HTTP/1.1";

    let signatureHeaders = new Map();

    // Set the date header
    let dateHeader = createDateHeader();
    signatureHeaders.set("date", dateHeader);

    // Add to headers for the signature hash
    signatureHeaders.set("request-line", requestLine);

    // Get the list of headers
    let headers = getHeadersString(signatureHeaders);

    // Build the signature string
    let signatureString = getSignatureString(signatureHeaders);

    // Hash the signature string using the specified algorithm
    let signatureHash = sha1HashBase64(signatureString, secret);

    // Set the signature hash algorithm
    let algorithm = "hmac-sha1";

    // Format the authorization header
    let authHeaderFormat = 'hmac username="%s",algorithm="%s",headers="%s",signature="%s"';
    let authHeader = util.format(authHeaderFormat, userName, algorithm, headers, signatureHash);

    // Set the request headers
    let requestHeaders;
    if (requestMethod === "GET") {
        requestHeaders = {
            "Host" : parsedUrl.hostname,
            "Authorization" : authHeader,
            "Date" : dateHeader
        }
    }

    return requestHeaders;
};