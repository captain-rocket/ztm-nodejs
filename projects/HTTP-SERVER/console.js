fetch('http://localhost:3005/friends', {
  method: 'POST',
  body: JSON.stringify({ id: 2, user: 'agent5', message: 'Beware' }),
});

fetch('http://localhost:3005/friends', {
  method: 'POST',
  body: JSON.stringify({ id: 2, user: 'codemon', message: 'Hello World' }),
})
  .then((res) => res.json())
  .then((friend) => console.log(friend));
