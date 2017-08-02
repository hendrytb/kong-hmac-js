"use strict";

const util = require("util");
const urllib = require("url");
const crypto = require("crypto");

module.exports = function(params) {
    let createDateHeader = function() {
        return new Date().toGMTString();
    }

    let getHeadersString = function(signatureHeaders) {
        let headers = "";
        for (var [key, val] of signatureHeaders) {
            if (headers !== "") {
                headers += " ";
            }
            headers += key;
        }
        return headers;
    }

    let getSignatureString = function(signatureHeaders) {
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

    let sha1HashBase64 = function(signatureString, secret) {
        return crypto.createHmac("sha1", secret).update(signatureString).digest("base64");
    }

    let md5HashBase64 = function(data) {
        return crypto.createHash("md5").update(data, "binary").digest("base64");
    }

    let validateParams = function(params) {
        // UserName
        if (!params.userName || !params.userName.length) {
            throw new Error("userName is required");
        }
        // Secret
        if (!params.secret || !params.secret.length) {
            throw new Error("secret is required");
        }
        // URL
        if (!params.url || !params.url.length) {
            throw new Error("url is required");
        }
        // Method
        if (!params.method || !params.method.length) {
            throw new Error("method is required");
        }
        // token
        if (!params.token || !params.token.length) {
            throw new Error("token is required for JWT oAuth");
        }
        // host
        if (!params.host || !params.host.length) {
            throw new Error("host is required");
        }
        // Method
        let requestMethod = params.method.toUpperCase();
        if (requestMethod !== "GET" && requestMethod !== "POST" && requestMethod !== "UPDATE" && requestMethod !== "DELETE") {
            throw new Error("method is invalid");
        }
        if (requestMethod === "POST" || requestMethod === "UPDATE") {
            if (!params.data || !params.data.length) {
                throw new Error("data is required when method is POST or UPDATE");
            }

            if (!params.contentType || !params.contentType.length) {
                throw new Error("contentType is required when method is POST or UPDATE");
            }
        }
    }

    // Validation
    validateParams(params);

    // Default Value
    let httpVersion = (params.httpVersion) ? params.httpVersion : "HTTP/1.1";

    // Determine request method
    let base64md5;
    let contentLength;
    let signatureHeaders = new Map();
    let requestMethod = params.method.toUpperCase();

    if (requestMethod === "POST" || requestMethod === "UPDATE") {
        // MD5 digest of the content
        base64md5 = md5HashBase64(params.data);

        // Set the content-length header
        contentLength = params.data.length;

        // Add headers for the signature hash
        signatureHeaders.set("content-type", params.contentType);
        signatureHeaders.set("content-md5", base64md5);
        signatureHeaders.set("content-length", contentLength);
    }

    // Build the request-line header
    let parsedUrl = urllib.parse(params.url);
    let targetUrl = parsedUrl.path;
    let requestLine = requestMethod + " " + targetUrl + " " + httpVersion;

    // Set the date header
    let dateHeader = createDateHeader();
    signatureHeaders.set("date", dateHeader);

    // Add to headers for the signature hash
    // signatureHeaders.set("request-line", requestLine);

    // Get the list of headers
    let headers = getHeadersString(signatureHeaders);

    // Build the signature string
    let signatureString = getSignatureString(signatureHeaders);

    // Hash the signature string using the specified algorithm
    let signatureHash = sha1HashBase64(signatureString, params.secret);

    // Set the signature hash algorithm
    let algorithm = "hmac-sha1";

    // Format the authorization header
    let authHeaderFormat = 'hmac username="%s",algorithm="%s",headers="%s",signature="%s"';
    let authHeader = util.format(authHeaderFormat, params.userName, algorithm, headers, signatureHash);

    // Set the request headers
    let requestHeaders;
    if (requestMethod === "GET" || requestMethod === "DELETE") {
        requestHeaders = {
            "Host": params.host,
            "Proxy-Authorization": authHeader,
            "Authorization": params.token,
            "Date": dateHeader
        }
    } else {
        requestHeaders = {
            "Host": params.host,
            "Proxy-Authorization": authHeader,
            "Authorization": params.token,
            "Date": dateHeader,
            "Content-Type": params.contentType,
            "Content-MD5": base64md5,
            "Content-Length": contentLength
        }
    }

    return requestHeaders;
};