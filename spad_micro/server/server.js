//  server.js

var express = require('express');
var morgan = require('morgan');

// make things secure https
var fs = require('fs');
var http = require('http');
var https = require('https');
// for now using static certificate, TBD how to use Letsencrypt instead
// var privateKey = fs.readFileSync( options.privKeyFile, 'utf8');
// var certificate = fs.readFileSync( options.certFile, 'utf8');
// var credentials = {key: privateKey, cert: certificate};

module.exports.start = (options) => {

  return new Promise((resolve, reject) => {
    // for static file certiticates check that certificate and private key filenames are defined
    // and files exist
    if((!options.privKeyFile) || (!fs.statSync(options.privKeyFile)) ||
         (!options.certFile) || (!fs.statSync(options.certFile))) throw new Error("private key file required.");

    var privateKey = fs.readFileSync( options.privKeyFile, 'utf8');
    var certificate = fs.readFileSync( options.certFile, 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    //  Make sure we have a repository and port provided.
    if(!options.repository) throw new Error("A server must be started with a connected repository.");
    if(!options.port) throw new Error("A server must be started with a port.");

    //  Create the app, add some logging.
    var app = express();
    app.use(morgan('dev')); 

    //  Add the APIs to the app.
    require('../api/spad')(app, options);

    // launch https server
    var httpsServer = https.createServer(credentials, app)

    //  Start the app, creating a running server which we return.
    var server = httpsServer.listen(options.port, () => {
      resolve(server);
    });

  });
};
