const EventEmitTer = require('events');
const celebrity = new EventEmitTer();

// Subscribe to celebrity for Observer 1
celebrity.on('race', (result) => {
  if (result === 'win') {
    console.log('Congradulations! You are the best! ');
  }
});
// Subscribe to celebrity for Observer 2
celebrity.on('race', (result) => {
  if (result === 'win') {
    console.log('I could have done better! ');
  }
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

celebrity.emit('race', 'win');
celebrity.emit('race', 'lost');
