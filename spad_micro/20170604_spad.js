 //  spad.js
//
//  Defines thespad api. Add to a server by calling:
//  require('./.well-known/spad/v0/spad')
'use strict';

var assert = require( 'assert' );
var fs = require( 'fs' );
var spad_object = {};
spad_object.domain = '';
spad_object.services = [];
spad_object.services.flows = [];

//  Only export - adds the API to the app with the given options.
module.exports = (app, options) => {

  app.get('/.well-known/spad/v0/spad', (req, res, next) => {
    	options.repository.get_domains(req.headers.host).then((spad) => {
		// store domain name into return object
      		spad_object.domain = spad.domain;
		// query sql DB for all services for the domain called
      		options.repository.get_services(spad.domain_id).then((spad) => {
			// store services into return object
			console.log(' return from services SQL: ', spad.services);
        		spad_object.services = spad.services
			// query flows for each service 
			console.log(' services: ', spad_object.services);
			for (var service_id in spad_object.services) {
				console.log(' service object: ', spad_object.services[service_id]);
				options.repository.get_flows(service_id).then((spad) => {
				console.log(' flows from SQL: ', JSON.stringify(spad));
					spad_object.services.flows = spad.flows;
					//res.status(200).send(spad_object);
				})
			};
			res.status(200).send(spad_object);
			// }
      		})
    
		// console.log('return complete spad object: '+JSON.stringify(spad_object));
    		//res.status(200).send(spad_object); // => { 
    	})
    
	.catch(next);
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
