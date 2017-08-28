'use strict';

var UpdateDb = require('../database/updateDb.js');

const Thread = {
    
  flagThread: (url,req,res)=>{
      
         console.log("Thread PUT request");
         console.log(req.body);
         UpdateDb.flag(url,req.body,()=>{
             res.send({redirect: '/success'});
         });  
         
  },    

  getBoard: (req,res,url)=>{
         let boards = {boards: [req.params.board]};
         UpdateDb.getBoards(url,boards,(toSend)=>{
             var sorted = toSend[0].threads.sort((a,b)=>{
                if(a.bumped_on > b.bumped_on)
                  return -1;
                else
                  return 1;
             });
             let max_length = 10;
             if(sorted.length < 10)
                max_length = sorted.length;
             for(var i=0;i<max_length;i++)
             {
                 let oldReplies = sorted[i].replies.sort((a,b)=>{
                     if(a.posted_on > b.posted_on)
                        return -1;
                     else   
                        return 1;
                 });
                 let newReplies = [];
                 let repliesLength = 3;
                 if(oldReplies.length < 3)
                    repliesLength = oldReplies.length;
                 for(let j=0;j<repliesLength;j++)
                 {
                     newReplies.push(oldReplies[j]);
                 }
                 sorted[i].replies = newReplies;
             }
             res.send(sorted);
         },true);
      },
      
    pushThread: (url,req,res,io)=>{
         let newThread = req.body;
         res.send({redirect: '/'});
         newThread.posted_on = Math.round((new Date()).getTime() / 1000);
         newThread.bumped_on = Math.round((new Date()).getTime() / 1000);
         newThread._id = Math.round((new Date()).getTime() / 1000);
         newThread.replies = [];
         newThread.flagged = false;
         newThread.name = newThread.thread_name;
         console.log(newThread);
         console.log("Thread POST request to " + req.params.board);
         UpdateDb.pushThread(url,{board: newThread.board,thread: newThread},()=>{
             io.sockets.emit("send thread", newThread);
         });
         
         
    },
    
    deleteThread: (url,req,res,io)=>{
        
         console.log("trying to delete post " + req.body.thread_id);
         UpdateDb.deleteThread(url,req.body,(check)=>{
             if(check)
             {
                 io.sockets.emit("send pop", {board: req.body.board, thread: {_id: parseInt(req.body._id)}});
                 res.send({redirect: '/success'});
             }     
             else
                res.send({redirect: '/failure'});
         });
    }
}

module.exports = Thread;