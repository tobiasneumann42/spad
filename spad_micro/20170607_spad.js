 //  spad.js
//
//  Defines thespad api. Add to a server by calling:
//  require('./.well-known/spad/v0/spad')
'use strict';

var async = require("async");

var assert = require( 'assert' );
var fs = require( 'fs' );
var spad_object = {};
spad_object.domain = '';
spad_object.services = [];
spad_object.services.flows = [];
var res_go = 0;
 
//  Only export - adds the API to the app with the given options.
module.exports = (app, options) => {

  app.get('/.well-known/spad/v0/spad', (req, res, next) => {

	async.auto( {

    	retrieve_mk1: function(callback) {
	    	options.repository.get_domains(req.headers.host).then((spad) => {
				// store domain name into return object
      			spad_object.domain = spad.domain;
				// query sql DB for all services for the domain called
      			options.repository.get_services(spad.domain_id).then((spad) => {
					// store services into return object
					console.log('Q1 return from services SQL: ', spad.services);
        			spad_object.services = spad.services ;
        			console.log('Q1 return global object: ', spad_object.services);
        			callback();
				})
			});
		},

		retrieve_mk2: ['retrieve_mk1', function(callback) {
			// query flows for each service 
			console.log('Q2 services: ', spad_object.services);
			console.log('Q2 number of services: ', spad_object.services.length);
			for (var service_id in spad_object.services) {
				console.log(' service object: ', spad_object.services[service_id].service_id);
				options.repository.get_flows(spad_object.services[service_id].service_id, (err, result) => {
					console.log(' flows from SQL: ', JSON.stringify(result));
					//spad_object.services[service_id].flows = spad.flows;
					res_go += 1;
					console.log(' done with flows... ', res_go );
					callback();
				});
				
			}
			console.log(' end for ');
		}]

	}, function(err, result) {
			console(' while start ')
			while (spad_object.services.length!==res_go)  {
				console.log(' waiting ...')
			};

			res.status(200).send(spad_object);
			console.log('done:', err || results);
		}
	);

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
