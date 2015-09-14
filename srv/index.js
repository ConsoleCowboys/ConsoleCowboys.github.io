// TODO: migrate this server to a gulp task

var express = require('express');
var exphbs  = require('express-handlebars');
var morgan = require('morgan');
var app = express();
var fs = require('fs');

// set environment
var env = process.env.ENV || 'staging';
var environment = env === 'production' ? '' : '/' + env;

/* config */
var ENVS = { production: 80, staging: 60124 };

/* middleware */
app.use(morgan('combined'));

/* routes */
//app.get(environment + '/api', function (req, res) { res.send('API TBD'); });

// handlebars options
var options = {
  extname: '.hbs',

  // TODO consolidate this with those helpers used by gulp task.
  helpers: {
    capitals : function(str){ return str && str.toUpperCase() || ''; }
  }
};

// handlebars renderer
var hbs = exphbs.create(options);

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// respond with handlesbars template (rendered)
app.use(function (req,res,next) {
  var entireUrl = req.originalUrl;
  var ext = entireUrl.split('.').pop();
  var filepath = function (fldr) {
    fldr = fldr || 'public';
    return process.cwd() + '/src/' + fldr + entireUrl;
  };

  // FIXME: this crude method breaks if directories contain periods
  // if url has no extension, render with handlebars
  if (ext === entireUrl) {
    return res.render('../src/templates');
  // if requesting js, use app.js
  } else if (ext === 'js') {
    filepath = filepath('scripts');
    fs.stat(filepath, function (err) {
      if (!err) return res.sendFile(filepath);
      return res.status(404).send('404: Not found');
    });
  // FIXME: the dirtiest static file server to avoid figuring out how to make
  // express routers work with a compiled static page handlebars middleware
  } else {
    filepath = filepath();
    fs.stat(filepath, function (err) {
      if (!err) return res.sendFile(filepath);
      return res.status(404).send('404: Not found');
    });
  }
});

/* server */
var server = app.listen(ENVS[env], function () {
  var host = env;
  var port = ENVS[env];

  console.log('Example app listening at http://%s:%s', host, port);
});
