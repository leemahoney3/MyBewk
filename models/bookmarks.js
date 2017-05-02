'use strict';

/* Bookmark Model */

const Database  = require('./database');
const _         = require('lodash');
const auth      = require('./auth');

const bookmarks = {

  database: new Database('./data/bookmarks.json', { folders: [] }),
  collection: 'folders',

  // Get number of bookmarks in database
  countBookmarks() {

    const folders = this.getAllFolders();
    let count     = 0;

    for (let i = 0; i < folders.length; i++) {
      count += folders[i].bookmarks.length;
    }

    return count;

  },

  // Counts the average bookmarks per user.
  countAverageBookmarksPerUser(userCount) {


    let average = this.countBookmarks() / userCount;

    if (isNaN(average)) {
      average = 0;
    }

    return average;

  },

  countUserAverageBookmarks(userId) {

    let average = this.countUserBookmarks(userId) / this.countUserFolders(userId);

    if (isNaN(average)) {
      average = 0;
    }

    return average;
  },


  // Returns all folders.
  getAllFolders() {

    return this.database.findAll(this.collection);

  },

  // Returns all public folders.
  getAllPublicFolders() {

    return this.database.findOneBy(this.collection, { 'private': false });

  },

  // Returns the total amount of bookmarks a user owns.
  countUserBookmarks(userid) {

    const folders = this.getAllUserFolders(userid);
    let count     = 0;

    for (let i = 0; i < folders.length; i++) {
      count += folders[i].bookmarks.length;
    }

    return count;

  },

  // Returns the number of folders a user owns.
  countUserFolders(userid) {

    const folders = this.getAllUserFolders(userid);
    let count     = 0;

    for (let i = 0; i < folders.length; i++) {
      count++;
    }

    return count;

  },

  // Returns the name of the folder with the most bookmarks.
  getFolderWithMostBookmarks(userid) {

    // Loop through each folder
    // Check for bookmark count and set it, if higher set it again, that folder at the end is the most.
    const folders = this.getAllUserFolders(userid);
    let count     = 0;
    let folder    = "N/A";

    for (let i = 0; i < folders.length; i++) {
      const bookmarks = folders[i].bookmarks.length;
      if (count < bookmarks) {
        count = bookmarks;
        folder = folders[i].title;
      }
    }

    return folder;

  },

  // Returns the total amount of bookmarks in the folder that has the most bookmarks.
  getMostBookmarksCount(userid) {

    const folders = this.getAllUserFolders(userid);
    let count     = 0;
    let folder    = "N/A";

    for (let i = 0; i < folders.length; i++) {
      const bookmarks = folders[i].bookmarks.length;
      if (count < bookmarks) {
        count = bookmarks;
        folder = folders[i].bookmarks.length;
      }
    }

    return folder;

  },

  // Returns the name of the folder with the least bookmarks.
  getFolderWithLeastBookmarks(userid) {

    // Loop through each folder
    // Check for bookmark count and set it, if higher set it again, that folder at the end is the most.
    const folders = this.getAllUserFolders(userid);
    let count     = this.getMostBookmarksCount(userid);
    let folder    = "N/A";

    for (let i = 0; i < folders.length; i++) {
      const bookmarks = folders[i].bookmarks.length;
      if (count > bookmarks) {
        count = bookmarks;
        folder = folders[i].title;
      }
    }

    return folder;

  },

  // Returns the user with the most bookmarks
  getUserWithMostBookmarks() {

    const users = auth.getUsers();
    let count   = 0;
    let user    = "N/A";


    for (let i = 0; i < users.length; i++) {

      const bookmarks = this.countUserBookmarks(users[i].id);

      if (count < bookmarks) {
        count = bookmarks;
        user = users[i].firstName + " " + users[i].lastName;
      }

    }

    return user;

  },

  // Returns bookmark count of user with most bookmarks
  getUserWithMostBookmarksCount(userid) {

    const users = auth.getUsers();
    let count   = 0;
    let user    = "N/A";

    for (let i = 0; i < users.length; i++) {
      const bookmarks = this.countUserBookmarks(users[i].id);
      if (count < bookmarks) {
        count = bookmarks;
      }
    }

    return count;

  },

  // Returns user with least bookmarks
  getUserWithLeastBookmarks() {

    const users = auth.getUsers();
    let count   = this.getUserWithMostBookmarksCount();
    let user    = "N/A";


    for (let i = 0; i < users.length; i++) {

      const bookmarks = this.countUserBookmarks(users[i].id);

      if (count > bookmarks) {
        count = bookmarks;
        user = users[i].firstName + " " + users[i].lastName;
      }

    }

    return user;

  },

  // Get all folders in database
  getAllUserFolders(userid) {

    return this.database.findOneBy(this.collection, { userid: userid });

  },

  // Get specific folder from database by id
  getFolder(id) {

    return this.database.findOneBy(this.collection, { id: id });

  },

  // Add a folder to the database
  addFolder(object) {

    this.database.add(this.collection, object);

  },

  // Remove a folder from the database
  removeFolder(id, userid) {

    const folder = this.getFolder(id)[0];

    if (userid == folder.userid) {
      this.database.remove(this.collection, folder);
    } else {
      console.info('Not your folder.');
    }

  },

  // Add a bookmark to the database
  addBookmark(folderid, object) {

    const folder = this.getFolder(folderid)[0];
    console.log(folder.bookmarks);
    folder.bookmarks.push(object);
    //_.add(folder.bookmarks, object);
    //console.log(folder);

  },

  // Remove a bookmark from the database
  removeBookmark(folderid, bookmarkid) {

    const folder = this.getFolder(folderid)[0];
    _.remove(folder.bookmarks, { id: bookmarkid });

  },

};

module.exports = bookmarks;
