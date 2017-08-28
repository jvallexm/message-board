'use strict';

$( ".thread-form" ).submit((e)=>{  
  console.log(e.target.id);
  let type = 'PUT';
  if(e.target.name == 'POST')
      type = 'POST';
  if(e.target.name == 'DELETE')
      type = 'DELETE';
  let arr  = $('#' + e.target.id).serializeArray();
  let obj  = {board: "b"};
  $.each(arr,(i,input)=>{
     obj[input.name] = input.value;
  });
  console.log(obj);
  $.ajax({
     type : type,
     url  : "/api/threads/" + obj.board, 
     data : obj
  });
  //event.preventDefault();
});