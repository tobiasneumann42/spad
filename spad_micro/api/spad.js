//  spad.js
//
// Defines the spad api. Add to a server by calling:
// './.well-known/spad/v0/spad'
// on http get to well-known URL call stored procedure in mySQL to
// gather required data and returns spad formated JSON object
//
//  Author:   Tobias Neumann, tneumann(at)leder-neumann.de
//  Date:     June 9th 2017
//  Version:  0.9

var jose = require('node-jose');

'use strict';
 
//  Only export - adds the API to the app with the given options.
module.exports = (app, options) => {

  app.get('/.well-known/spad/v0/spad', (req, res, next) => {
	  options.repository.get_all(req.headers.host).then((spad) => {
      // get rid of some wrapers that mysql JSON function puts around
      // the JSON object we want 
      // console.log('DEBUG: check key', privateKey);
		  var result = spad.spad.shift().shift() ; 
		  res.status(200).send(result.json_obj);
	   })
  });
};
