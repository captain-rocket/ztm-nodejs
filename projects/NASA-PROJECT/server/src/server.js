const http = require('http');
require('dotenv').config();
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadSpaceXLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT;

const server = http.createServer(app);

const log = require('./routes/color.logs.controller');

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadSpaceXLaunchData();

  server.listen(PORT, () => {
    console.log(log.hl.mission_control(log.decorate.bold(`Listening on ${PORT}...`)));
  });
}
startServer();
