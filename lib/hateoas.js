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
  };
}

function catchesLinks(req) {
  console.log(req.originalUrl);
  return {
    root: `${req.protocol}://${req.headers.host}${apiVersion}`,
    self: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
    logNewCatch: {
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
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
    oneUsersCatches: {
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}/:username`,
      httpMethod: "GET",
      access: "Public",
    },
    findOneCatch: {
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}:catchId`,
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
    logoutUser: {
      url: `${req.protocol}://${req.headers.host}${req.baseUrl}/logout/:username`,
      httpMethod: "GET",
      access: "Private",
    },
    findUser: `${req.protocol}://${req.headers.host}${req.baseUrl}/find/:username`,
    newUser: {
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
      requestContentType: "application/json",
      requestBody: ["username", "password"],
      httpMethods: "POST",
      access: "Public",
    },
    deleteUser: {
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
      requestContentType: "application/json",
      requestBody: ["username", "password"],
      httpMethod: "DELETE",
      access: "Private",
    },
  };
}

module.exports = { links, catchesLinks, usersLinks };
