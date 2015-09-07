var express = require('express');
var morgan = require('morgan');
var app = express();

// set environment
var env = process.env.ENV || 'staging';
var environment = env === 'production' ? '' : '/' + env;

/* config */
var ENVS = { production: 80, staging: 60124 };

/* middleware */
app.use(morgan('combined'));

/* routes */
//app.get(environment + '/api', function (req, res) { res.send('API TBD'); });

/* static server */
app.use('/',express.static('../src/public'));
console.log('CWD: ',process.cwd());

/* server */
var server = app.listen(ENVS[env], function () {
  var host = env;
  var port = ENVS[env];

  console.log('Example app listening at http://%s:%s', host, port);
});
