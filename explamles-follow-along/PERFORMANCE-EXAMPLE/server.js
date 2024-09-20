const express = require('express');
/*
* *******************************************************************************
* Multi Processing server horizontally scaled with load balancer using PM2 instead of cluster 
# const cluster = require('cluster');
# const os = require('os');

* Force Round Robin on Windows OS cluster.schedulingPolicy = cluster.SCHED_RR;
 */
const app = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // * event loop blocked...
  }
}

app.get('/', (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
  delay(4000);
  res.send(`Beep Beep Beep! ${process.pid}`);
});
console.log('Running server.js');
/*
 * Replaced using PM2
 # if (cluster.isPrimary) {
 #   console.log(`Primary has been started...`);
 #   const NUM_WORKERS = os.cpus().length - 2;
 #   for (let i = 0; i < NUM_WORKERS; i++) {
 #     cluster.fork();
 #   }
 # } else {
 */
console.log(`Worker process started.`);
app.listen(3000);
// # }

/*
 * To start a cluster in PM2
 * Run PM2 command passing in -i flag(i for instance) it measures the amount of * worker processes in the cluster
 * followed by argument amount of works or CPUs to utilize or can be set to max to use all available on the server machine
 *
 * Example: pm2 start server.js -i max
 * Specify log file
 * Example: pm2 start server.js -l log.txt -i max
 */
