'use strict';

var path        = require('path');
var express     = require('express');
var app         = express(); 
var env         = require('dotenv').config();
var helmet      = require('helmet');
var UpdateDb    = require('./database/updateDb.js');
var apiRoutes   = require('./routes/apiRoutes.js');
var bodyParser  = require('body-parser');

const server = app
 
  .use( bodyParser.json() )
  .use( bodyParser.urlencoded({ extended: true }) )
  .use( helmet() )
  .use(                             express.static(__dirname) )
  .use( '/api/?'                  , express.static(__dirname) )
  .use( '/board/:board/'          , express.static(__dirname) )
  .use( '/board/:board/:post_id'  , express.static(__dirname) )
  .listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`));

const io = require('socket.io')(server);

var url = process.env.MONGO_URL;

io.on('connection', (socket) => {

   app.use(helmet());

   console.log("new connection!");
   
   //Sends clients all boards when they connect
   socket.on("need boards",(boards)=>{
        console.log("a user needs boards");     
        UpdateDb.getBoards(url,boards,(toSend, length)=>{
           console.log("all boards found, sending " + length + " boards to client");
           socket.emit("send boards", {boards: toSend}); 
        });
   });
   
   //Pushes new board to database
   socket.on("push thread",(data)=>{
        UpdateDb.pushThread(url,data, ()=>{socket.broadcast.emit("send thread", data);});
   });
   
   //Pops deleted threads from database
   socket.on("pop thread",(data)=>{
        UpdateDb.popThread(url,data, ()=>{socket.broadcast.emit("send pop", data);});
   });
   
   //Posts updated threads to database
   socket.on("post update",(data)=>{
       UpdateDb.updateThread(url,data,()=>{socket.broadcast.emit("send update", data)});
   });

});

app.get('/forms',(req,res)=>{
   res.redirect('./forms.html'); 
});

app.get('/success',(req,res)=>{
   res.send("Success!"); 
});

apiRoutes(app,io,server,url);