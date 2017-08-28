'use strict';

$( ".form-form" ).submit((e)=>{  
 event.preventDefault(); 
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
  $.ajax({
     type : type,
     url  : "/api/threads/" + obj.board, 
     data : obj
  });
  
  
});