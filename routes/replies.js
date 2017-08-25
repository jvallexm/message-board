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
      }
      
      
};

module.exports = Replies;