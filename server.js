'use strict';

var path = require('path');
var express = require('express');
var app = express(); 
var env = require('dotenv').config();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

const server = app
  .use(express.static(__dirname))
  .listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`));

const io = require('socket.io')(server);

//var url = process.env.MONGO_URL;

io.on('connection', (socket) => {
    
    console.log("new connection: " + socket.id);
    
});