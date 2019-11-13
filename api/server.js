const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const server = express();
const Users = require('./users-model');
const restricted = require('./middleware/restricted');

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("We're in business!");
});

server.post('/api/register', (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 11);
  const userToPost = { ...user, password: hash };

  Users.add(userToPost)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).send('ERROR: ' + err.message);
    });
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token: token, 
        });
      } else {
        res.status(401).send('Invalid credentials.');
      }
    })
    .catch(err => {
      res.status(401).send('ERROR: ' + err.message);
    })
});

server.get('/api/users', restricted, (req, res) => {
  if (req.decodedToken && req.decodedToken.department) {
    Users.findBy({ department: req.decodedToken.department })
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        res.send(err.message);
      });
  } else {
    res.status(401).send('No credentials provided');
  }
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    department: user.department,
  };

  const option = {
    expiresIn: '1d',
  }

  const result = jwt.sign(
    payload,
    process.env.SECRET,
    option,
  );
  
  return result;
}

module.exports = server;
