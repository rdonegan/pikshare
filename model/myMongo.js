var util = require("util");
var mongoClient = require('mongodb').MongoClient;
/*
 * This is the connection URL and the database name
 */
var url = 'mongodb://localhost:27017/pikCount';
var mongoDB; // The connected database


// Use connect method to connect to the Server
mongoClient.connect(url, function(err, db) {
  if (err) doError(err);
  console.log("Connected correctly to server");
  mongoDB = db;
  //search for document in database
  //initialize with value of 0 if not found
  var crsr = mongoDB.collection("total").find();
  crsr.toArray(function(err,docs){
  	// console.log("docs is: " + docs);
  	if(docs.length==0){
  		mongoDB.collection("total").insert({num:1},{safe:true}, function(){console.log("inserted!")});
  	}
  });


});


// INSERT
exports.insert = function(collection, query, callback) {
        console.log("start insert");
        mongoDB.collection(collection).insert(
          query,
          {safe: true},
          function(err, crsr) {
            if (err) doError(err);
            console.log("completed mongo insert");
            callback(crsr);
            console.log("done with insert callback");
          });
        console.log("leaving insert");
}

// FIND
exports.find = function(collection, query, callback) {
        var crsr = mongoDB.collection(collection).find(query);
        crsr.toArray(function(err, docs) {
          if (err) doError(err);
          callback(docs);
        });
 }



// UPDATE
//Updates total collection by 1
exports.update = function(collection){ //, callback) {
	//find current value stored
	var crsr = mongoDB.collection("total").find();
	crsr.toArray(function(err,docs){
  	// console.log("docs is: " + docs);
  		console.log("docs is: "+ docs[0]["num"]);
  		updateVal(collection, docs[0]["num"]+1)
  		// curNum += docs[0]["num"];
  	
  	});

        
  };


//increments the value of num in collection 'total' by one with each new image
var updateVal = function(collection, val){
	console.log("value here is: "+ val);

	 mongoDB.collection(collection).update(
            								{},
            								{"num":val}, {
              								
            								}, function(err, crsr) {
              								if (err) doError(err);
              							console.log("update successful!");
              // callback('Update succeeded');
        });

};

//returns the current value being stored in the database
exports.getCurrVal = function(collection, callback){
	var crsr = mongoDB.collection("total").find();
	crsr.toArray(function(err,docs){
  	// console.log("docs is: " + docs);
  		// console.log("docs is: "+ docs[0]["num"]);
  		// return(docs[0]["num"]);
  		callback(docs[0]["num"]);
  		// curNum += docs[0]["num"];
  	
  	});
};

var doError = function(e) {
        util.debug("ERROR: " + e);
        throw new Error(e);
    }
