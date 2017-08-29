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
    }  
      
      
};

module.exports = Replies;