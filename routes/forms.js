'use strict';

$( ".form" ).submit((e)=>{  
  
  event.preventDefault();
  let whichRoute = "/api/replies/"
  if( $('#' + e.target.id).attr("class").indexOf("thread-form") > -1);
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
  $.each(arr,(i,input)=>{
     obj[input.name] = input.value;
  });
  console.log(obj);
  console.log("Route: " + whichRoute);
  $.ajax({
     type : type,
     url  : whichRoute + obj.board, 
     data : obj,
     success: (data)=>{
       window.location = data.redirect;
     }
  });
  
});

