"use strict";

const apiVersion = "/api/v1";

function links(req) {
  return {
    root: `${req.protocol}://${req.headers.host}${apiVersion}`,
    self: `${req.protocol}://${req.headers.host}${req.originalUrl}`,

    users: {
      url: `${req.protocol}://${req.headers.host}${apiVersion}/users`,
      access: "Public",
    },
    catches: {
      url: `${req.protocol}://${req.headers.host}${apiVersion}/catches`,
      access: "Public",
    },
    webhook: {
      url: `${req.protocol}://${req.headers.host}${apiVersion}/webhook`,
      access: "Public",
    },
  };
}

function catchesLinks(req) {
  console.log(req.originalUrl);
  return {
    root: `${req.protocol}://${req.headers.host}${apiVersion}`,
    self: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
    logNewCatch: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}`,
      requestHeader: "Authorization Bearer <USER JSON WEB TOKEN>",
      requestContentType: "application/json",
      requestBody: [
        "fishType",
        "fishLength",
        "fishWeight",
        "longAndLatPos",
        "city",
        "lake",
      ],
      httpMethod: "POST",
      access: "Private",
    },
    updateCatch: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}`,
      requestHeader: "Authorization: Bearer <USER JSON WEB TOKEN>",
      requestContentType: "application/json",
      requestBody: [
        "fishType",
        "fishLength",
        "fishWeight",
        "longAndLatPos",
        "city",
        "lake",
      ],
      httpMethod: "PUT",
      access: "Private",
    },
    oneUsersCatches: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/:username`,
      httpMethod: "GET",
      access: "Public",
    },
    findOneCatch: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/:catch-id`,
      httpMethod: "GET",
      access: "Public",
    },
  };
}

function usersLinks(req) {
  return {
    root: `${req.protocol}://${req.headers.host}${apiVersion}`,
    self: `${req.protocol}://${req.headers.host}${req.baseUrl}`,
    loginUser: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/login`,
      requestContentType: "application/json",
      requestBody: ["username", "password"],
      httpMethods: "POST",
      access: "Public",
    },
    findUser: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/find/:username`,
      httpMethod: "GET",
      access: "Public",
    },
    newUser: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}`,
      requestContentType: "application/json",
      requestBody: ["username", "password"],
      httpMethods: "POST",
      access: "Public",
    },
    deleteUser: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}`,
      requestHeader: "Authorization: Bearer <USER JSON WEB TOKEN>",
      requestContentType: "application/json",
      requestBody: ["username"],
      httpMethod: "DELETE",
      access: "Private",
    },
  };
}

function webhookLinks(req) {
  return {
    root: `${req.protocol}://${req.headers.host}${apiVersion}`,
    self: `${req.protocol}://${req.headers.host}${req.baseUrl}`,
    listSubscribers: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/subscribers`,
      httpMethods: "GET",
      access: "Public",
    },
    registerSubscriber: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/subscribers`,
      requestContentType: "application/json",
      requestBody: ["url"],
      httpMethods: "POST",
      access: "Public",
    },
    deleteSubscriber: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/subscribers`,
      requestContentType: "application/json",
      requestBody: ["subscriber id"],
      httpMethod: "DELETE",
      access: "Public",
    },
  };
}

module.exports = { links, catchesLinks, usersLinks, webhookLinks };
