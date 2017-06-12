 //  spad.js
//
//  Defines thespad api. Add to a server by calling:
//  require('./.well-known/spad/v0/spad')
'use strict';

var async = require("async");

var assert = require( 'assert' );
var fs = require( 'fs' );
 
//  Only export - adds the API to the app with the given options.
module.exports = (app, options) => {

  app.get('/.well-known/spad/v0/spad', (req, res, next) => {

  	console.log(' GET Request ');
	  options.repository.get_all(req.headers.host).then((spad) => {
		var result = spad.spad ; 
    var result = result.shift().shift()
		console.log('Return from SQL: ', result.json_obj );
		res.status(200).send(result.json_obj);
	})
   });


  app.get('/search', (req, res) => {

    //  Get the email.
    var email = req.query.email;
    if (!email) {
      throw new Error("When searching for a user, the email must be specified, e.g: '/search?email=homer@thesimpsons.com'.");
    }

    //  Get the user from the repo.
    options.repository.getUserByEmail(email).then((user) => {

      if(!user) { 
        res.status(404).send('User not found.');
      } else {
        res.status(200).send({
          email: user.email,
          phoneNumber: user.phone_number
        });
      }
    })
    .catch(next);

  });
};
