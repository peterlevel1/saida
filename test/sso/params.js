var params = {
  // localServerUrl: 'http://localhost:8000/__webpack_dev_server__/sso_cookie',
  localServerUrl: 'http://localhost:3060/__webpack_dev_server__/sso_cookie',
  proxyUrl: '/sthIsHandsome/*',
  originUrl: 'http://localhost:5000/hello.html'
};

console.log(encodeURIComponent(params.localServerUrl));
// http%3A%2F%2Flocalhost%3A3060%2F__webpack_dev_server__%2Fsso_cookie

console.log(encodeURIComponent(params.proxyUrl));
// %2FsthIsHandsome%2F*

console.log(encodeURIComponent(params.originUrl));
// http%3A%2F%2Flocalhost%3A3060%2Fhello.html

// http://localhost:5000/redirect.html?localServerUrl=http%3A%2F%2Flocalhost%3A3060%2F__webpack_dev_server__%2Fsso_cookie&proxyUrl=%2FsthIsHandsome%2F*&originUrl=http%3A%2F%2Flocalhost%3A5000%2Fhello.html

var str = 'http://localhost:5000/redirect.html?localServerUrl=http%3A%2F%2Flocalhost%3A3060%2F__webpack_dev_server__%2Fsso_cookie&proxyUrl=%2FsthIsHandsome%2F*&originUrl=http%3A%2F%2Flocalhost%3A5000%2Fhello.html';
function matchPart(str, part) {
  return (str.match(new RegExp(part + '=([^&]*)')) || [])[1];
}

console.log(matchPart(str, 'localServerUrl'));
console.log(matchPart(str, 'proxyUrl'));
console.log(matchPart(str, 'originUrl'));
