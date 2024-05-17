const http = require('http');

const PORT = 3005;

const server = http.createServer();

const friends = [
  {
    id: 0,
    user: 'Phantom',
    message: `I'm in the shadows you never know where I may roam`,
  },
  {
    id: 1,
    user: 'Anonymous',
    message: 'Hello! From the depths of the interwebs!',
  },
];

server.on('request', (req, res) => {
  const items = req.url.split('/');
  console.log('items', items);

  // /friends/2 => ['']
  if (items[1] === 'friends') {
    // res.writeHead(200, {
    //   'Content-Type': 'text/plain',
    // });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 3) {
      res.end(JSON.stringify(friends[items[2]]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (items[1] === 'messages') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<body>');
    res.write('<ul>');
    res.write('<li>Hello! Fellow coder!<?li>');
    res.write('<li>What are your thoughts on NodeJS so far?<?li>');
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
  } else {
    res.statusCode = 404;
  }
  res.end();
});

server.listen(PORT, () => {
  console.log(`Listening on port ${3005}`);
}); //127.0.0.1 => localhost
