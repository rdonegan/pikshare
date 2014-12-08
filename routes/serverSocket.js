var mongo = require("../model/myMongo.js");

exports.init = function(io) {

	nicknames = []

	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}

	io.sockets.on('connection', function(socket){

		
		// console.log("currently:" + mongo.getCurrVal("total", function(){}));

		//perform when the homepage is first opened
		mongo.getCurrVal("total", function(val){
			// console.log("the current value is: " + val);
			// console.log(typeof val+"");
			socket.emit('get total', val);
		})

		//check if username is stored on browser
		io.sockets.emit('stored username');
	

		socket.on('newUser', function(data, callback){
			// console.log("stored nicknames: " + nicknames[0]);
			if(nicknames.indexOf(data) !== -1 || data ==""){
				callback(false);
			}
			else{
				callback(true);
				socket.nickname = data;
				nicknames.push(socket.nickname);
				// io.sockets.emit('usernames', nicknames);
				updateNicknames();
			}
		});

		//when sending an image
		socket.on('user image', function (msg) {
      		io.sockets.emit('user image', socket.nickname, msg);
      		mongo.update("total");
    	});


		socket.on('disconnect', function(data){
			if(!socket.nickname) return;
			nicknames.splice(nicknames.indexOf(socket.nickname), 1);
			updateNicknames();
		});
	});



	

}