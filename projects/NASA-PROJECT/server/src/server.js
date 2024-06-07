const http = require('http');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const log = require('./routes/color.logs.controller');

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(log.hl.mission_control(log.decorate.bold(`Listening on ${PORT}...`)));
  });
}
startServer();
