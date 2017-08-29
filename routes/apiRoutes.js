'use strict';

var UpdateDb    =  require('../database/updateDb.js');
var Thread      =  require('./threads.js');
var Replies     =  require('./replies.js');
var bodyParser  =  require('body-parser');


module.exports = (app,io,socket,url) => {

  app.route('/api/threads/:board/?')
     .delete((req,res)=>{
         
         Thread.deleteThread(url,req,res,io);
            
     })
     .get((req,res)=>{ 
         
         Thread.getBoard(req,res,url); 
         
     })
     .post((req,res)=>{
        
        Thread.pushThread(url,req,res,io);
         
     })
     .put((req,res)=>{
         
        Thread.flagThread(url,req,res);
         
     });
  
  app.route('/api/replies/:board/?')
     .delete((req,res)=>{
         
     })
     .get((req,res)=>{
         
         Replies.getThread(req,res,url);
         
     })
     .post((req,res)=>{
        
        Replies.pushReply(req,res,url,io); 
        
     })
     .put((req,res)=>{
        
        Replies.flagReply(req,res,url,io);         

     });
  
};

/*

I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')*/