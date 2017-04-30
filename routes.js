'use strict';

const express = require('express');
const router  = express.Router();

const homeController    = require('./controllers/home');
const authController    = require('./controllers/auth');
const accountController = require('./controllers/account');
const bookmarks = require('./controllers/bookmarks');

// Main Route
router.get('/', homeController.index);

// Authentication Routes
router.get('/auth/signin/', authController.signIn);
router.post('/auth/signin/', authController.postSignIn);

router.get('/auth/signup/', authController.signUp);
router.post('/auth/signup/', authController.postSignUp);

router.get('/auth/signout/', authController.signOut);

router.get('/account/edit/', accountController.editAccount);
router.post('/account/edit/', accountController.postEditAccount);

// Bookmark Routes
router.get('/bookmarks/', bookmarks.index);

router.get('/bookmarks/public/', bookmarks.publicBookmarks);
router.get('/bookmarks/public/:folderid/', bookmarks.viewPublicFolder);

router.get('/bookmarks/new/', bookmarks.newFolder);
router.post('/bookmarks/new/', bookmarks.newFolderPost);

router.get('/bookmarks/delete/:folderid/', bookmarks.deleteFolder);

router.get('/bookmarks/folder/:folderid/', bookmarks.viewFolder);

router.get('/bookmarks/folder/:folderid/new/', bookmarks.newBookmark);
router.post('/bookmarks/folder/:folderid/new/', bookmarks.newBookmarkPost);

router.get('/bookmarks/folder/:folderid/delete/:bookmarkid/', bookmarks.deleteBookmark);

module.exports = router;
