'use strict';

const bcrypt  = require('bcrypt');

const Database = require('./database');

const auth = {

  database: new Database('./data/users.json', { users: [] }),
  collection: 'users', // Collection is basically same as table name in MySQL Database.

  getUser(id) {

    const result = this.database.findOneBy(this.collection, { 'id': id });
    return result[0];

  },

  getUsers() {

    const result = this.database.findAll(this.collection);
    return result;

  },

  getUserByEmail(email) {

    const result = this.database.findOneBy(this.collection, { 'email': email });
    return result[0];

  },

  signUp(data) {

    data.password = bcrypt.hashSync(data.password, 10);
    this.database.add(this.collection, data);

  },

  checkEmailExists(email) {

    const result = this.database.findOneBy(this.collection, { 'email': email });
    return result.length;

  },

  checkPassword(email, password) {

    const hashedPassword = this.getUserByEmail(email).password;
    return bcrypt.compareSync(password, hashedPassword);

  },

  updateUser(id, data) {

    //const user = this.getUser(email);

    this.database.update(this.collection, { 'id': id }, data);

  },

  userCount() {

    const result = this.database.findAll(this.collection);
    return result.length;
  }

};

module.exports = auth;
