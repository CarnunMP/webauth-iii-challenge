const db = require('../database/db-config');

module.exports = {
  find,
  findBy,
  findById,
  add,
}

function find() {
  return db('users');
}

function findBy(filter) {
  return db('users')
    .where(filter);
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