//  repository.js
//
//  Exposes a single function - 'connect', which returns
//  a connected repository. Call 'disconnect' on this object when you're done.
'use strict';

var mysql = require('mysql');

//  Class which holds an open connection to a repository
//  and exposes some simple functions for accessing data.
class Repository {
  constructor(connection) {
    this.connection = connection;
  }

  get_all(domain) {
    return new Promise((resolve, reject) => {
      this.connection.query('call JSONbuild(?);',[domain], (err, results) => {
        if(err) {
          return reject(new Error("An error occured getting spad domains: " + err));
        }

        resolve({
          spad: results
        }); 
      } )
    })
  }    

  get_domains(domain) {
    return new Promise((resolve, reject) => {

      this.connection.query('select * from domains where domain=?;',[domain], (err, results) => {
        if(err) {
          return reject(new Error("An error occured getting spad domains: " + err));
        }

	resolve({
	  domain_id: results[0].domain_id,
	  domain: results[0].domain
	}); 
      });

    });
  }

  get_flows(service_id) {
    return new Promise((resolve, reject) => {

      this.connection.query('select flows.port, flows.name, flows.qos, flows.protocol from flows where service_id=?;',[service_id], (err, results) => {
        if(err) {
          return reject(new Error("An error occured getting spad flow info: " + err));
        }
        resolve({
	         flows: results 
        });
      });
    });
  }

  get_services(dom_id) {
    return new Promise(( resolve, reject) => {

      this.connection.query('select services.service_id, services.s_name, services.validtill from services where domain_id=?;',[dom_id], (err, results) => {
        if(err) {
	         return reject(new Error("An error occured getting spad services info: " + err));
        }
        resolve({
          services: results
        });
      });
    });
  }



  getUserByEmail(email) {

    return new Promise((resolve, reject) => {

      //  Fetch the customer.
      this.connection.query('SELECT email, phone_number FROM directory WHERE email = ?', [email], (err, results) => {

        if(err) {
          return reject(new Error("An error occured getting the user: " + err));
        }

        if(results.length === 0) {
          resolve(undefined);
        } else {
          resolve({
            email: results[0].email,
            phone_number: results[0].phone_number
          });
        }

      });

    });
  }

  disconnect() {
    this.connection.end();
  }
}

//  One and only exported function, returns a connected repo.
module.exports.connect = (connectionSettings) => {
  return new Promise((resolve, reject) => {
    if(!connectionSettings.host) throw new Error("A host must be specified.");
    if(!connectionSettings.user) throw new Error("A user must be specified.");
    if(!connectionSettings.password) throw new Error("A password must be specified.");
    if(!connectionSettings.port) throw new Error("A port must be specified.");

    resolve(new Repository(mysql.createConnection(connectionSettings)));
  });
};
