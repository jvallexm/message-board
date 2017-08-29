'use strict';

var UpdateDb = require('../database/updateDb.js');

const Replies = {
    
    getThread: (req,res,url)=>{
         let boards = {boards: [req.params.board]};
         console.log("original url: " + req.originalUrl);
         if(req.originalUrl.indexOf("?thread_id=")==-1)
         {
             res.status(404);
             res.send("Not found");
         }
         else{
             let _id = req.originalUrl.split("?thread_id=")[1];
             //console.log("trying to find " + _id);
             UpdateDb.getBoards(url,boards,(toSend)=>{
                 let threads = toSend[0].threads;
                 let threadCheck = false;
                 for(var i=0;i<threads.length;i++)
                 {
                    if(threads[i]._id == _id)
                    {
                        threadCheck = true;
                        res.send(threads[i]);
                    }    
                 }
                 if(!threadCheck)
                    res.send("Sorry, can't find that thread!");
             },true);
         }     
      },
      
    flagReply: (req,res,url,io)=>{
        
         console.log("attempting to flag reply " + req.body.reply_id + " to thread " + req.body.thread_id);
         UpdateDb.flagReply(url,req.body,(thread,check)=>{
             console.log("sending thread with flagged reply");
             io.sockets.emit("send update",{
                 board: req.body.board,
                 thread: thread
             });
             if(check)
                res.send({redirect: '/success'});
         });
    },  
      
    pushReply: (req,res,url,io)=>{
        
        console.log("Atempting to post reply to thread " + req.body.thread_id);
         UpdateDb.pushReply(url,req.body,()=>{
            console.log("reply posted!");
            io.sockets.emit("send reply",{
               board  : req.params.board,
               thread : req.body.thread_id,
               reply  : req.body
            });
            res.send({redirect: "/board/" + req.params.board});
         });
    },  
    
    deleteReply:  (req,res,url,io)=>{
         
         console.log("attempting to delete reply " + req.body.reply_id + " from thread " + req.body.thread_id);
         UpdateDb.popReply(url,req.body,(check,thread)=>{
             if(check)
             {
               io.sockets.emit("send update",{
                 board: req.body.board,
                 thread: thread
               });  
               res.send({redirect: '/success'});
             }
             else
                res.send({redirect: '/failure'});
         });
    }
      
      
};

module.exports = Replies;