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

var url = process.env.MONGO_URL;

io.on('connection', (socket) => {
   
   console.log("new connection!");
   
   //Sends clients all boards when they connect
   socket.on("need boards",(boards)=>{
        
        console.log("a user needs boards");     
        MongoClient.connect(url, (err,db)=>{
         if(err)
           console.log(err);
         else
         {
            var toSend = [];
            var getBoard = (board,length)=>{
                console.log("attempting to get board " + board);
                var thisBoard = db.collection(board);
                var newBoard = {
                    _id: board,
                    name: "",
                    threads: []
                };
                if(board == "b")
                  newBoard.name = "Random";
                if(board == "c")  
                  newBoard.name = "Compliments";
                thisBoard.find({},{})
                         .toArray((err,result)=>{
                             if(err)
                                console.log(err);
                             else
                             {
                                 console.log("got board " + board + " from database");
                                 newBoard.threads = result;
                                 toSend.push(newBoard);
                                 if(toSend.length == length)
                                 {
                                     console.log("all boards found, sending " + length + " boards to client");
                                     socket.emit("send boards", {boards: toSend});
                                     db.close();
                                 }
                             }
                         });
            };      
            for(var i=0;i<boards.boards.length;i++)
            {
                getBoard(boards.boards[i],boards.boards.length);
            }
         }
         
       });
   });
   
   //Pushes new board to database
   socket.on("push thread",(data)=>{
        MongoClient.connect(url, (err,db)=>{
             if(err)
               console.log(err);
             else
             {
                 var pushTo = db.collection(data.board);
                 var pushOne = () =>{
                     pushTo.insert(data.thread);
                     socket.broadcast.emit("send thread", data);
                 };
                 pushOne(db,()=>{db.close();});
             }
       });     
   });
   
});