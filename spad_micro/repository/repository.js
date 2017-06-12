//  repository.js
//
//  Exposes a single function - 'connect', which returns
//  a connected repository. Call 'disconnect' on this object when you're done.
//
//  Author:   Tobias Neumann, tneumann(at)leder-neumann.de
//  Date:     June 9th 2017
//  Version:  0.9

'use strict';

var mysql = require('mysql');

//  Class which holds an open connection to a repository
//  and exposes some simple functions for accessing data.
class Repository {
  constructor(connection) {
    this.connection = connection;
  }
  // calls mySQL stored procude JSONbuild and returns JSON formated objet
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
