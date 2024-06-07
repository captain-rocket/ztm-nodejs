const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const keplerData = `${path.join(__dirname, '../../data/kepler_data.csv')}`;

const log = require('../routes/color.logs.controller');

const habitablePlanet = [];

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
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanet.push(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        console.log(`${log.bg.lime('habitable planets found!')} ${log.color.lime(`${habitablePlanet.length}`)}`);
        resolve();
      });
  });
}

function getAllplanets() {
  return habitablePlanet;
}
module.exports = {
  loadPlanetsData,
  getAllplanets,
};
