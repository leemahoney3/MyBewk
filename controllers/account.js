'use strict';

const auth    = require('../models/auth');

let success = false;
let error   = '';

const account = {

  editAccount(request, response) {

    const user = auth.getUser(request.session.id);

    if (user) {

      response.render('account/edit', { title: 'Edit Account', user: user });

    } else {

      response.redirect('/');

    }


  },

  postEditAccount(request, response) {

    const user = auth.getUser(request.session.id);

    const data = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email
    };

    if (data.firstName == '' || data.lastName == '' || data.email == '') {

      error = 'Please fill in all fields.';
      success = false;

    } else if (auth.checkEmailExists(data.email) && data.email != user.email) {

      error = 'That email is already in use.';
      success = false;

    } else {

      auth.updateUser(user.id, data);
      error = '';
      success = true;

    }

    response.render('account/edit', { title: 'Edit Account', success: success, error: error, user:user });

  }

};

module.exports = account;
