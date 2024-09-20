const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const keplerData = `${path.join(__dirname, '../../data/kepler_data.csv')}`;

const planets = require('./planets.mongo');

const log = require('../routes/color.logs.controller');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(keplerData)
      .pipe(
        parse({
          comment: '#',
          columns: true,
        }),
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          /*
           * loadPlanetsData() will be called when starting the server and in parallel if in a cluster. This so every time it is restarted would created the data again and if in cluster for each cluster.
           * mongoose provides a solution to this with upsert
           * meaning insert + update = upsert
           */
          savePlanet(data);
          // habitablePlanet.push(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllplanets()).length;
        console.log(`${log.bg.lime('habitable planets found!')} ${log.color.lime(`${countPlanetsFound}`)}`);
        resolve();
      });
  });
}

async function getAllplanets() {
  return await planets.find({}).select('keplerName -_id');
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      },
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}
module.exports = {
  loadPlanetsData,
  getAllplanets,
};
