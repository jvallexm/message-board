'use strict';

var UpdateDb = require('../database/updateDb.js');

const Thread = {

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
      }
}

module.exports = Thread;