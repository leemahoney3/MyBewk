'use strict';

const auth = require('../models/auth');
const bookmarkModel = require('../models/bookmarks');

const homeController = {

  index(request, response) {

    const user = auth.getUser(request.session.id);

    if (user) {

      response.render('home', {
        user: user,
        userBookmarkCount: bookmarkModel.countUserBookmarks(user.id),
        userFolderCount: bookmarkModel.countUserFolders(user.id),
        userAverageCount: bookmarkModel.countUserAverageBookmarks(user.id),
        folderWithMostBookmarks: bookmarkModel.getFolderWithMostBookmarks(user.id),
        folderWithLeastBookmarks: bookmarkModel.getFolderWithLeastBookmarks(user.id),
        bookmarkCount: bookmarkModel.countBookmarks(),
        bookmarkAverage: bookmarkModel.countAverageBookmarksPerUser(auth.userCount()),
        userWithMostBookmarks: bookmarkModel.getUserWithMostBookmarks(),
        userWithLeastBookmarks: bookmarkModel.getUserWithLeastBookmarks(),
      });

    } else {

      response.render('home', {
        user: user,
        bookmarkCount: bookmarkModel.countBookmarks(),
        bookmarkAverage: bookmarkModel.countAverageBookmarksPerUser(auth.userCount()),
        userWithMostBookmarks: bookmarkModel.getUserWithMostBookmarks(),
        userWithLeastBookmarks: bookmarkModel.getUserWithLeastBookmarks(),
      });

    }

  }

};

module.exports = homeController;
