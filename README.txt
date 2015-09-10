***************
PikShare
An app by Ryan Donegan
Created for 67-328, Fall 2014
***************

Created for Mobile to Web: Developing Distributed Applications. PikShare allows users to log on with a custom, unique username and communicate with other users via photo. Similar to Snapchat, users are able to communicate via picture only. Compatible with mobile devices.


To run PikShare on node.js locally:

1. cd to Pikshare directory
2. Locate public > javascript > clientSocket.js
3. Change the first uncommented line of code from "var socket = io.connect(':8000/');" to "var socket = io.connect('/');"
4. Run 'node server' in terminal.

* View a live version at http://pikshare-rdonegan.rhcloud.com/


Project Resources:

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
http://blog.marcon.me/post/31143865164/send-images-through-websockets
