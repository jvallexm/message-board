'use strict';

var UpdateDb  =  require('../database/updateDb.js');
var Thread    =  require('./threads.js');
var Replies   =  require('./replies.js');

module.exports = (app,io,socket,url) => {
    
  app.route('/api/threads/:board')
     .delete((req,res)=>{
         
     })
     .get((req,res)=>{ 
         Thread.getBoard(req,res,url); 
     })
     .post((req,res)=>{
         
     })
     .put((req,res)=>{
         
     });
  
  app.route('/api/replies/:board?')
     .delete((req,res)=>{
         
     })
     .get((req,res)=>{
         Replies.getThread(req,res,url);
     })
     .post((req,res)=>{
         
     })
     .put((req,res)=>{
         
     });
  
};

/*


I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
I can POST a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.

I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')
I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')*/