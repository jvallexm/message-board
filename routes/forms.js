'use strict';

$( ".form" ).submit((e)=>{  
  
  event.preventDefault();
  let whichRoute = "/api/replies/"
  if( $('#' + e.target.id).attr("class").split(' ').indexOf("thread-form") != -1)
      whichRoute = "/api/threads/"
  console.log(e.target.id);
  console.log(e.target.name);
  let type = 'PUT';
  if(e.target.name == 'POST')
      type = 'POST';
  if(e.target.name == 'DELETE')
      type = 'DELETE';
  let arr  = $('#' + e.target.id).serializeArray();
  let obj  = {};
  console.log("Route: " + whichRoute);
  $.each(arr,(i,input)=>{
     obj[input.name] = input.value;
  });
  //setTimeout(()=>{
    console.log(obj);
   
    $.ajax({
       type : type,
       url  : whichRoute + obj.board, 
       data : obj,
       success: (data)=>{
         window.location = data.redirect;
       }
    });
  //},50000);
});

