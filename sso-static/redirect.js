var querystring = require('querystring');

/**
 * @param  {String} targetUrl
 * @param  {String} localServerUrl
 * @param  {String} proxyUrl
 */
module.exports = function (targetUrl, localServerUrl, proxyUrl) {
  if (targetUrl[targetUrl.length - 1] !== '/') {
    targetUrl += '/';
  }

  /**
   * @param  {Object} res
   * @return {Boolean}
   */
  return function redirect(res) {
    if (!res) {
      return false;
    }

    if (typeof res === "string") {
      try {
        res = JSON.parse(res);
      } catch(e) {
        return false;
      }
    }

    if (
      !res.redirect ||
      typeof res.redirectUrl !== "string"
    ) {
      return false;
    }

    var indexOfQuery = res.redirectUrl.search('\\?');
    if (indexOfQuery === -1) {
      return false;
    }

    var strQuery = res.redirectUrl.slice(indexOfQuery + 1);
    if (!strQuery) {
      return false;
    }

    var obj = querystring.parse(strQuery);
    obj.redirectUrl = targetUrl
      + '?proxyUrl=' + encodeURIComponent(proxyUrl)
      + '&localServerUrl=' + encodeURIComponent(localServerUrl)
      + '&originUrl=' + encodeURIComponent(location.href);

    var curTarget = res.redirectUrl.slice(0, indexOfQuery) + '?' + querystring.stringify(obj);
    location.href = curTarget;

    return true;
  }
}
