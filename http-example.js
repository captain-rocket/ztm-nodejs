const { get: getHttps } = require('https');
const { get: getHttp } = require('http');

getHttp('http://www.google.com', (resp) => {
  resp.on('data', (chunk) => {
    console.log(`Data chunk ${chunk}`);
  });
  resp.on('end', () => {
    console.log('No more data');
  });
});
getHttps('https://duckduckgo.com/', (resp) => {
  resp.on('data', (chunk) => {
    console.log(`Data chunk ${chunk}`);
  });
  resp.on('end', () => {
    console.log('No more data');
  });
});
