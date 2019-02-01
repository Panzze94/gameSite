'use strict';
document.addEventListener( "DOMContentLoaded", function(){
  var app = new Vue({
     el:'#title',
     data: {
       message : 'Submit your high score!'
     },
     methods: {
       submitClick: function() {
         console.log('click');
       }
     }
     });
});
