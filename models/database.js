'use strict';

const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

class Database {

  constructor(file, defaults) {

    this.db = low(file, { storage: fileAsync });
    this.db.defaults(defaults).value();

  }

  add(collection, obj) {

    this.db.get(collection).push(obj).write();

  }

  remove(collection, obj) {

    this.db.get(collection).remove(obj).write();

  }

  update(collection, filter, obj) {

    this.db.get(collection).find(filter).assign(obj).write();

  }

  findAll(collection) {

    return this.db.get(collection).value();

  }

  findOneBy(collection, filter) {

    const results = this.db.get(collection).filter(filter).value();
    return results;

  }

}

module.exports = Database;
