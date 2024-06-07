const express = require('express');

const path = require('path');

const log = require('./controllers/color.logs.controller');

const friendsRouter = require('./routes/friends.router');

const messagesRouter = require('./routes/messages.router');
const e = require('express');
const { title } = require('process');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const PORT = 3005;

app.use((req, res, next) => {
  const start = Date.now();
  next();
  // actions go here...
  const delta = Date.now() - start;
  console.log(
    log.color.lime(`${req.method} ${req.baseUrl}${req.url}`),
    `\n${log.color.br_blue('Time to complete Request:')}`,
    log.color.cyan(`${delta}ms`),
  );
});

app.use('/site', express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'My Friends are Very Clever',
    caption: `Lets's go skiing!`,
  });
});
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);

app.listen(PORT, () => {
  console.log(log.bg.green(log.decorate.bold(`Listening on ${PORT}...`)));
});
