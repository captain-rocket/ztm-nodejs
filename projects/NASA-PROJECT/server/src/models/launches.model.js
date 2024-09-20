const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');
const log = require('../routes/color.logs.controller');
const axios = require('axios');
const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber: 100, //* flight_number
//   mission: 'Kepler Exploration X', //* name
//   rocket: 'Explorer IS1', //* rocket.name
//   launchDate: new Date('December 27, 20230'), //* date_local
//   target: 'Kepler-442 b', //* not applicable
//   // target: 'test',
//   customers: ['ZTM', 'NASA'], //* payload.customers for each payload
//   upcoming: true, //* upcoming
//   success: true, //* success
// };

// # launches.set(launch.flightNumber, launch);
async function findLaunch(filter) {
  return launchesDataBase.findOne(filter);
}

async function validatedLaunchID(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDataBase.findOne().sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function getAllLaunches(skip, limit) {
  return await launchesDataBase.find({}).select('-_id -__v').sort({ flightNumber: 1 }).skip(skip).limit(limit);
}

async function saveLaunch(launch) {
  await launchesDataBase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    },
  );
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

const launchQuery = {
  query: {},
  options: {
    pagination: false,
    populate: [
      {
        path: 'rocket',
        select: {
          name: 1,
        },
      },
      {
        path: 'payloads',
        select: {
          customers: 1,
        },
      },
    ],
  },
};

async function populateLaunches() {
  console.log(log.bg.orange('DownLoading Launch Data...'));
  const resp = await axios.post(SPACEX_API_URL, launchQuery);
  if (resp.status !== 200) {
    console.log(log.warn.warning(`Problem dowloading ${log.hl.mission_control(log.decorate.bold('SpaceX'))} launch Data`));
    throw new Error('SpaceX Launch data download failed!');
  }

  const spaceXLaunchDocs = await resp.data.docs;
  // console.log('fetchedSpaceXLaunches', spaceXLaunchDocs);
  for (launchDoc of spaceXLaunchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      customers,
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
    saveLaunch(launch);
  }
}

async function loadSpaceXLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log(log.hl.mission_control('Launch data already loaded!'));
  } else {
    await populateLaunches();
  }
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.exists({ keplerName: launch.target });
  const mission = await launchesDataBase.exists({ mission: launch.mission });
  if (!planet) {
    throw new Error(`${log.warn.warning(launch.target)} is not a valid target`);
  }
  if (mission) {
    throw new Error(`${log.warn.warning(launch.mission)} Mission already in scheduled`);
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

// function scheduleNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ['ZTM', 'NASA'],
//       flightNumber: latestFlightNumber,
//     }),
//   );
// }

async function abortLaunchByID(launchId) {
  const aborted = await launchesDataBase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    },
  );
  return aborted.acknowledged && aborted.modifiedCount === 1;
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchByID,
  validatedLaunchID,
  loadSpaceXLaunchData,
};
