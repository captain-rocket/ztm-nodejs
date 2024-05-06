const REQUEST_TIMEOUT = 500;

function encrypt(data) {
  return 'enctypted data';
}

function send(url, data) {
  const enctyptedData = encrypt(data);
  console.log(`Sending ${enctyptedData} to ${url}`);
}

module.exports = {
  REQUEST_TIMEOUT,
  send,
};

console.log('hello for request.js');
