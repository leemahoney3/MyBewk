'use strict';

/* Bookmarks Controller */

const shortid       = require('shortid');
const bookmarkModel = require('../models/bookmarks');

const auth = require('../models/auth');

const path = require('path');

const cloudinary    = require('cloudinary');

cloudinary.config({
 cloud_name: 'leewitiot',
 api_key: '982369437942357',
 api_secret: 'dkk_omRv5CDZMz9Mg84ZO0LVW4U'
});

const bookmarks = {

  // List folders
  index(request, response) {

    const user = auth.getUser(request.session.id);

    console.info('Rendering Bookmark Folders Page');

    response.render('bookmarks/index', {
      title: 'Bookmarks',
      folders: bookmarkModel.getAllUserFolders(user.id),
      user: user
    });

  },

  // List bookmarks in folder
  viewFolder(request, response) {

    const user = auth.getUser(request.session.id);

    const folderid = request.params.folderid;

    //console.log(folderid);
    const folder = bookmarkModel.getFolder(folderid)[0];
      //console.log('Rendering Folder (' + folder.title + ') Page');
      //console.log('User Id: ' + user.id + ' | Folder User Id: ' + folder.userid);

    if (folder.userid == user.id) {

      response.render('bookmarks/folder/index', { title: folder.title, folder: folder, user: user });

    } else {
      response.redirect('/');
    }

  },

  // New folder
  newFolder(request, response) {

    const user = auth.getUser(request.session.id);

    console.info('Rendering New Folder Page');

    response.render('bookmarks/new', { title: 'New Folder' , user: user});

  },

  // New folder POST
  newFolderPost(request, response) {

    const user = auth.getUser(request.session.id);

    const viewData = {
      title: 'New Folder',
      error: null,
      user: user
    };

    let privateFolder = true;

    if (request.body.private != "on") {
      privateFolder = false;
    }

    const data = {
      id: shortid.generate(),
      userid: user.id,
      title: request.body.title,
      description: request.body.description,
      private: privateFolder,
      bookmarks: []
    };

    if (data.title != '' && data.description != '') {

      bookmarkModel.addFolder(data);
      response.redirect('/bookmarks/');

    } else {

      viewData.error = 'Could not add folder, please fill in all fields.';
      response.render('bookmarks/new', viewData);

    }

  },

  // Delete folder
  deleteFolder(request, response) {

    const userid = request.session.id;
    const folderid = request.params.folderid;

    bookmarkModel.removeFolder(folderid, userid);
    response.redirect('/bookmarks/');

  },

  // New bookmark
  newBookmark(request, response) {

    const user = auth.getUser(request.session.id);

    console.log('Rendering New Bookmark Page');

    const folderid = request.params.folderid;

    response.render('bookmarks/folder/new', { title: 'New Bookmark', folderid: folderid, user: user });

  },

  // New bookmark POST
  newBookmarkPost(request, response) {

    const user = auth.getUser(request.session.id);

    const folderid = request.params.folderid;

    const viewData = {
      title: 'New Bookmark',
      folderid: folderid,
      error: null,
      user: user
    };

    const data = {
      id: shortid.generate(),
      title: request.body.title,
      link: request.body.link,
      image: '',
      summary: request.body.summary
    };

    // Handle Image Upload.
    const image = request.files.picture;

    image.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          //console.log(result);
          data.image = result.url;
        });
      }
    });

    if (!data.link.startsWith("http://")) {
      data.link = 'http://' + data.link;
    }

    if (data.title != '' && data.link != '' && data.summary != '') {

      bookmarkModel.addBookmark(folderid, data);
      response.redirect('/bookmarks/folder/' + folderid + '/');

    } else {

      viewData.error = 'Could not add bookmark, please fill in all fields.';
      response.render('bookmarks/folder/new', viewData);

    }

  },

  // Delete bookmark
  deleteBookmark(request, response) {

    const folderid    = request.params.folderid;
    const bookmarkid  = request.params.bookmarkid;

    const imageUrl = request.query.i;

    const id = path.parse(imageUrl);

    cloudinary.api.delete_resources([id.name], function (result) {
      console.log(result);
    });

    bookmarkModel.removeBookmark(folderid, bookmarkid);

    response.redirect('/bookmarks/folder/' + folderid + '/');

  },

  publicBookmarks(request, response) {

    const user = auth.getUser(request.session.id);

    response.render('bookmarks/public', {
      title: 'Public Bookmarks',
      publicFolders: bookmarkModel.getAllPublicFolders(),
      user: user
    });

  },

  // List bookmarks in public folder
  viewPublicFolder(request, response) {

    const user = auth.getUser(request.session.id);

    const folderid = request.params.folderid;

    //console.log(folderid);
    const folder = bookmarkModel.getFolder(folderid)[0];
      //console.log('Rendering Folder (' + folder.title + ') Page');
      //console.log('User Id: ' + user.id + ' | Folder User Id: ' + folder.userid);

    if (folder.private == false) {

      response.render('bookmarks/folder/public', { title: folder.title, publicFolder: folder, user: user });

    } else {
      response.redirect('/');
    }

  },

};

module.exports = bookmarks;
