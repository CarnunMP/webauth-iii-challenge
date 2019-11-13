const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const server = express();
const Users = require('./users-model');

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
      res.status(500).json(err.message);
    });
});

module.exports = server;
