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

   //Adds a new thread
   var pushThread = (data, func) =>{
            MongoClient.connect(url, (err,db)=>{
             if(err)
               console.log(err);
             else
             {
                 var pushTo = db.collection(data.board);
                 var pushOne = () =>{
                     console.log("sending new thread to database");
                     pushTo.insert(data.thread);
                     func();
                 };
                 pushOne(db,()=>{db.close();});
             }
       });     
    };
    
    //Removes and old thread
    var popThread = (data, func) =>{
        
            MongoClient.connect(url, (err,db)=>{
             if(err)
               console.log(err);
             else
             {
                 var removeFrom = db.collection(data.board);
                 var removeOne = () =>{
                     console.log("removing thread from database");
                     removeFrom.remove({_id: data.thread._id});
                     func();
                 };
                 removeOne(db,()=>{db.close();});
             }
       });      
    };
    
    //Sends boards from an array
    var getBoards = (boards,func) =>{
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
                                     func(toSend, length);
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
    };
    
   //Adds updates to threads
   var updateThread = (data, func) =>{
      MongoClient.connect(url, (err,db)=>{
         if(err)
           console.log(err);
         else
         {
             var updateThis = db.collection(data.board);
             var updateOne = () => {
                 updateThis.update({_id: data.thread._id},data.thread);
                 func();
             };
             updateOne(db,()=>{db.close();});
         }
      });     
   };
   
   console.log("new connection!");
   
   //Sends clients all boards when they connect
   socket.on("need boards",(boards)=>{
        console.log("a user needs boards");     
        getBoards(boards,(toSend, length)=>{
           console.log("all boards found, sending " + length + " boards to client");
           socket.emit("send boards", {boards: toSend}); 
        });
   });
   
   //Pushes new board to database
   socket.on("push thread",(data)=>{
        pushThread(data, ()=>{socket.broadcast.emit("send thread", data);});
   });
   
   //Pops deleted threads from database
   socket.on("pop thread",(data)=>{
        popThread(data, ()=>{socket.broadcast.emit("send pop", data);});
   });
   
   //Posts updated threads to database
   socket.on("post update",(data)=>{
       updateThread(data,()=>{socket.broadcast.emit("send update", data)});
   });
   
});