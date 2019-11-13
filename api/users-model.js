const db = require('../database/db-config');

module.exports = {
  find,
  findById,
  add,
}

function find() {
  return db('users');
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

async function add(user) {
  const [id] = await db('users').insert(user);
  return findById(id);
}

// Alt:
// function add(user) {
//   return db('users')
//     .insert(user, 'id')
//     .then(ids => {
//       return findById(ids[0]);
//     });
// }