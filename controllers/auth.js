'use strict';

const auth    = require('../models/auth');
const shortid = require('shortid');

let success = false;
let error   = '';

const authController = {

  signIn(request, response) {

    const user = auth.getUser(request.session.id);

    if (user) {

      response.redirect('/');

    } else {

      response.render('auth/signin', { title: 'Sign In', user: user });

    }

  },

  postSignIn(request, response) {

    let email    = request.body.email;
    let password = request.body.password;

    // Three checks..
    if (email == '' || password == '') {

      error = 'Please fill in all fields.';
      response.render('auth/signin', { title: 'Sign In', error: error });

    } else if (!auth.checkEmailExists(email)) {

      error = 'That email does not exist.';
      response.render('auth/signin', { title: 'Sign In', error: error });

    } else if (!auth.checkPassword(email, password)) {

      error = 'Incorrect password entered.';
      response.render('auth/signin', { title: 'Sign In', error: error });

    } else {

      const user = auth.getUserByEmail(email);

      request.session.id = user.id;
      response.redirect('/');

    }

  },

  signUp(request, response) {

    const user = auth.getUser(request.session.id);

    if (user) {

      response.redirect('/');

    } else {

      response.render('auth/signup', { title: 'Sign Up' });

    }

  },

  postSignUp(request, response) {

    let data = {
      id: shortid.generate(),
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password
    };

    if (data.firstName == '' || data.lastName == '' || data.email == '' || data.password == '') {

      error = 'Please fill in all fields.';
      success = false;

    } else if (auth.checkEmailExists(data.email)) {

      error = 'That email already exists.';
      success = false;

    } else {

      auth.signUp(data);
      error = '';
      success = true;

    }

    response.render('auth/signup', { title: 'Sign Up', success: success, error: error })

  },

  signOut(request, response) {

    request.session.reset();

    response.redirect('/');

  },

};

module.exports = authController;
