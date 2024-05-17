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
  console.log(req.method);
  const items = req.url.split('/');
  // /friends/2 => ['']
  req.method === 'POST' && items[1] === 'friends'
    ? () =>
        req.on('data', (data) => {
          const friend = data.toString();
          console.log('Request', data);
          friends.push(JSON.stringify(friend));
        })
    : req.method === 'GET' && items[1] === 'friends'
    ? () => {
        // res.writeHead(200, {
        //   'Content-Type': 'text/plain',
        // });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        items.length === 3 ? res.end(JSON.stringify(friends[items[2]])) : res.end(JSON.stringify(friends));
      }
    : req.method === 'GET' && items[1] === 'messages'
    ? () => {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<body>');
        res.write('<ul>');
        res.write('<li>Hello! Fellow coder!<?li>');
        res.write('<li>What are your thoughts on NodeJS so far?<?li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('</html>');
      }
    : () => {
        res.statusCode = 404;
        res.end();
      };
});

server.listen(PORT, () => {
  console.log(`Listening on port ${3005}`);
}); //127.0.0.1 => localhost
