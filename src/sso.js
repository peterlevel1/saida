import fs from 'fs';
import express from 'express';

function isObject(obj) {
  return obj && {}.toString.call(obj) === '[object Object]';
}

function getRoadhogJson(roadhogPath) {
  var roadhogJson;
  try {
    roadhogJson = JSON.parse(fs.readFileSync(roadhogPath, 'utf-8'));
  } catch (e) {}

  if (
    !isObject(roadhogJson) ||
    !isObject(roadhogJson.proxy) ||
    Object.keys(roadhogJson.proxy).length === 0
  ) {
    return;
  }

  return roadhogJson;
}

export const SSO_ROUTE_PATH = '/__webpack_dev_server__/sso_cookie';

export function ssoCookieMiddleware(roadhogPath) {
  if (!roadhogPath) return;

  var roadhogJson = getRoadhogJson(roadhogPath);
  if (!roadhogJson) {
    throw new Error('no roadhogJson for: ' + roadhogPath);
  }

  var app = express();
  app.all('*', handle);

  console.log('sso cookie middleware is ready.');
  return app;

  function handle(req, res) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
    res.set("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, OPTIONS");
    res.set("Access-Control-Expose-Headers", "SSO Cookie");
    res.set("Content-Type", "application/json; charset=utf-8");
    res.status(200);

    if (req.method === "OPTIONS") {
      res.end();
      return;
    }

    var q = req.query;
    if (!q.url || !q.cookie) {
      return res.json({
        result: 'error',
        data: null,
        message: 'no url or cookie on the req.query'
      });
    }

    roadhogJson = getRoadhogJson(roadhogPath);
    if (!roadhogJson) {
      return res.json({
        result: 'error',
        data: null,
        message: 'roadhog json data does not exist at the provided path of the disk'
      });
    }

    var hasChanged = false;
    var proxy = roadhogJson.proxy;

    for (var url in proxy) {
      if (
        proxy.hasOwnProperty(url) &&
        q.url === url
      ) {
        proxy[url].headers = proxy[url].headers || {};
        proxy[url].headers.Cookie = q.cookie;
        hasChanged = true;
      }
    }

    if (!hasChanged) {
      return res.json({
        result: 'error',
        data: null,
        message: 'no matched url for the cookie provided'
      });
    }

    writeRoadhogJson(res);
  }

  function writeRoadhogJson(res) {
    fs.writeFile(
      roadhogPath,
      JSON.stringify(roadhogJson, null, 2),
      function (err) {
        if (err) {
          return res.json({
            result: 'error',
            data: null,
            message: 'write roadhog data error'
          });
        }

        res.json({
          result: 'success',
          data: null,
          message: ''
        });
      }
    );
  }
};
