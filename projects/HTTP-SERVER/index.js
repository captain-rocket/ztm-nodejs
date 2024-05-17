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
  // console.log(req.method);
  const items = req.url.split('/');
  // /friends/2 => ['']
  if (req.method === 'POST' && items[1] === 'friends') {
    req.on('data', (data) => {
      const friend = data.toString();
      console.log('Request');
      console.dir(JSON.parse(data.toString()), { depth: null });
      friends.push(JSON.parse(friend));
    });
    req.pipe(res);
  } else if (req.method === 'GET' && items[1] === 'friends') {
    // res.writeHead(200, {
    //   'Content-Type': 'text/plain',
    // });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 3) {
      const friendIndex = Number(items[2]);
      res.end(JSON.stringify(friends[friendIndex]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (req.method === 'GET' && items[1] === 'messages') {
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
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${3005}`);
}); //127.0.0.1 => localhost
