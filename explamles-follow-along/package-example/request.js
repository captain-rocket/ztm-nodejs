const axios = require('axios');

axios
  .get('https://www.duckduckgo.com')
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  })
  .then(() => {
    console.log('All done!');
  });
