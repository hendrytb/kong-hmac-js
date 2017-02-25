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

    let md5HashBase64 = function(data)
    {
        return crypto.createHash("md5").update(data, "binary").digest("base64")
    }

    // Determine request method
    let requestMethod;
    let base64md5;
    let contentLength;

    let signatureHeaders = new Map();

    if (!url || !contentType) {
        requestMethod = "GET";
    } else {
        requestMethod = "POST";

        // MD5 digest of the content
        base64md5 = md5HashBase64(data);

        // Set the content-length header
        contentLength = data.length;

        // Add headers for the signature hash
        signatureHeaders.set("content-type", contentType);
        signatureHeaders.set("content-md5", base64md5);
        signatureHeaders.set("content-length", contentLength);
    }

    // Build the request-line header
    let parsedUrl = urllib.parse(url);
    let targetUrl = parsedUrl.path;
    let requestLine = requestMethod + " " + targetUrl + " HTTP/1.1";

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
    } else {
        requestHeaders = {
            "Host" : parsedUrl.hostname,
            "Authorization" : authHeader,
            "Date" : dateHeader,
            "Content-Type" : contentType,
            "Content-MD5" : base64md5,
            "Content-Length" : contentLength
        }
    }

    return requestHeaders;
};