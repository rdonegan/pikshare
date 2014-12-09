/***************
saved variables
***************/

var socket = io.connect(':8000/');

var nickForm = $('#setNick');
var nickError = $('#nickError');
var nickBox = $('#nickname');
var users = $('#users');
var nickname;

var messageForm = $('#send-message');
var messageBox = $('#message');
var chat = $('#chat');
var lines = $('#lines');



/***************
username entry
***************/

nickForm.submit(function(e){
	e.preventDefault();
  //createCookie with username info if none exists
  if(document.cookie==""){
    createCookie(nickBox.val());
  }
  nickname=nickBox.val();
	socket.emit('newUser', nickBox.val(), function(data){
		if(data){
      
			$('#nickWrap').hide();
      $('.count').hide();
			$('#contentWrap').show();
      $(".logo").attr("height", "5%");
		}
		else{
			nickError.html('Invalid username. Try again.');

		}
	});

	nickBox.val('');
});

socket.on('usernames', function(data){
	var html='';
	for(i=0; i<data.length; i++){
		html += "<div class='userList'>" + data[i] + "</div></br>";
	}

	users.html(html);
});


/***************
Create cookie
***************/
function createCookie(name){
  var expDate = new Date();
  expDate.setMonth(expDate.getMonth()+1);
  var cookieVal = name;
  document.cookie = "username=" + name + ";path=/;expires=" + expDate.toGMTString(); 
  console.log("Every cookie: " + document.cookie);
}

/***************
Checks if username already stored in cookie from previous session.
If so, brings user to chat.
If username is in use by another, it removes the cookie
and prompts the user to enter a new username.
***************/
socket.on('stored username', cookieCheck);

function cookieCheck(){
  var username;
  if(document.cookie!=""){
    //get stored username
    var allCookies = document.cookie.split(';');
    for(var i=0; i < allCookies.length; i++){
      if ((allCookies[i].indexOf("username"))!=-1){
        username = allCookies[i].substr("username".length+1);
        // console.log("stored username is:" + username);
        socket.emit('newUser', username, function(data){
          if(data){
            nickname=username;
            $('#nickWrap').hide();
            $('.count').hide();
            $('#contentWrap').show();
            $(".logo").attr("height", "5%");
          }
          else{
            nickError.html('Please choose a new username.');
            deleteCookie();
          }
        });
      }
    }
  }
}

function deleteCookie(){
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

/***************************
Converts uploaded image to base64 string and send through sockets
****************************/

$('#imagefile').bind('change', function(e){

  var data = e.originalEvent.target.files[0];
  var reader = new FileReader();
  reader.onload = function(evt){
    // image('me', evt.target.result); //posts the image with "me" name
    sendImageSocket(evt.target.result);
    // socket.emit('user image', evt.target.result);
  };
  reader.readAsDataURL(data);
      
});


/***************************
client sends call to socket.io
****************************/

//called when a new image is uploaded or taken.
//sends the data to socket.io
function sendImageSocket(img){
  console.log("sendimagesocket");
  socket.emit('user image', img);

  //update database
  // socket.emit('updateDatabase');

}


/***************************
client response on image
****************************/

socket.on('user image', image);

//process the image and append to .lines
function image (from, base64Image) {
  console.log("nickname is: " + nickname);
	// console.log("got to the image thing...");

  lines.append($('<p>').append($('<b>').text(from + " "), '<img class="newImg" src="' + base64Image + '"/>'));
  
  
}

/***************************
client response on home load
****************************/
socket.on('get total', showTotal);

//retrieves the total images sent from the db
function showTotal(val){
  // console.log(val);
  $('.count').html("<div class='countNum'>" +val + "</div>" +' pictures sent and counting.');
}


/***************************
Video methods
Adapted from examples at: 
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
****************************/


var streaming = false,
    video = document.querySelector('#video'),
    canvas = document.querySelector('#canvas'),
    startbutton = document.querySelector('#startbutton'),
    width = 200,
    height = 0;

navigator.getMedia = ( navigator.getUserMedia || 
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

navigator.getMedia(
  { 
    video: true, 
    audio: false 
  },
  function(stream) {
    if (navigator.mozGetUserMedia) { 
      video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
    }
    video.play();
  },
  function(err) {
    console.log("An error occured! " + err);
  }
);


//adjust the video screen if enabled on device
video.addEventListener('canplay', function(ev){
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
}, false);

//takePicture called when pressed
startbutton.addEventListener('click', function(ev){
  takePicture();
  ev.preventDefault();
}, false);

function takePicture() {
	
  canvas.getContext('2d').drawImage(video, 0, 0, width, height);
  var data = canvas.toDataURL();
  // console.log(data);
  sendImageSocket(data); //send data to server
}



