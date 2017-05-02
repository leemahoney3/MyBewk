'use strict';

// Pull in required libraries
const express       = require('express');
const handlebars    = require('express-handlebars');
const fileUpload    = require('express-fileupload');

const path          = require('path');
const routes        = require('./routes');
const session       = require('client-sessions');
const bodyParser    = require('body-parser');

const app = express();

app.use(fileUpload());

app.use(session({
  cookieName: 'session',
  secret: '%6hh3&^593*',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/assets')));
app.use('/', routes);

app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

const listener = app.listen(process.env.PORT || 80, function () {
  console.info(`MyBewk started on port ${listener.address().port}`);
});
