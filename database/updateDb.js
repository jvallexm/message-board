'use strict';
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

const UpdateDb = 
{

   pushThread: (url, data, func)=>{
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
    },
    
   popThread: (url, data, func)=>{
        
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
    },
    
    //Sends boards from an array
    getBoards: (url,boards,func,no_delete)=>{
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
                if(board == "d")
                  newBoard.name = "DnD";
                if(board == "m")
                  newBoard.name = "Memes";
                if(board == "p")
                  newBoard.name = "Pop Punk";
                var obj = {};
                if(no_delete)
                {
                    console.log("removing delete_password");
                    obj = {
                        delete_password: 0,
                        "replies.delete_password": 0,
                        "replies.replies.delete_password": 0
                    };
                }    
                thisBoard.find({},obj)
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
    },
    
   //Adds updates to threads
   updateThread : (url, data, func)=>{
      MongoClient.connect(url, (err,db)=>{
         if(err)
           console.log(err);
         else
         {
             var updateThis = db.collection(data.board);
             var updateOne = () => {
                 console.log("updating post from database");
                 updateThis.update({_id: data.thread._id},data.thread);
                 func();
             };
             updateOne(db,()=>{db.close();});
         }
      });     
   },
    
   flag: (url, data, func)=>{
        MongoClient.connect(url, (err,db)=>{
         if(err)
           console.log(err);
         else
         {
             var updateThis = db.collection(data.board);
             var updateOne  = () => {
                 console.log("flagging one post");
                 console.log("trying to flag id " + parseInt(data.thread_id));
                 updateThis.update({_id: parseInt(data.thread_id)},{$set: {flagged: true}});
                 func();
             };
             updateOne(db,()=>{db.close();});
         }
      });   
   },
   
   deleteThread: (url, data, func)=>{
       MongoClient.connect( url, (err,db)=>{
           if(err)
             console.log(err);
           else
           {
               var findFrom = db.collection(data.board);
               var findOne  = ()=>{
                   findFrom.findOne({_id: parseInt(data.thread_id)},{})
                           .then((found)=>{
                                  
                                  let check = false;
                                  if(found.delete_password == data.delete_password)
                                  {
                                      console.log("pass");
                                      check = true;
                                      findFrom.remove({_id: parseInt(data.thread_id)});
                                  }
                                  else
                                    console.log("fail");
                                  func(check);
                                  
                           });
               };
               findOne(db,()=>{db.close();});
           }
       });
   },
   
   pushReply: (url,data,func)=>{
     
         MongoClient.connect(url, (err,db)=>{
         if(err)
           console.log(err);
         else
         {
             var updateThis = db.collection(data.board);
             var updateOne = () => {
                 console.log("updating post from database");
                 let now =  Math.round((new Date()).getTime() / 1000);
                 console.log("the time is " + now);
                 updateThis.update({_id: parseInt(data.thread_id)},{
                     $set  : {bumped_on: now},
                     $push : {replies: {
                         _id             : now,
                         flagged         : false,
                         replies         : [],
                         text            : data.text,
                         delete_password : data.delete_password,
                         posted_on       : now
                     }}
                 });
                 func();
             };
             updateOne(db,()=>{db.close();});
         }
      }); 
       
   },
       
   test: ()=>{
       console.log("db module test");
   }    
};

module.exports = UpdateDb;