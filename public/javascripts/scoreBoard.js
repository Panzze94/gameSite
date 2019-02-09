'use strict';

document.addEventListener("DOMContentLoaded", function(){

var app = new Vue ({
  el: '#app',
  name: 'vue-instance',

  data () {
    return {
      Itemname: '',
      players: [
        'soini26 300',
      ],
    };
  },

  mounted () {
    if (localStorage.getItem('players')) {

    try {
      this.players = JSON.parse(localStorage.getItem('players'));
    }  catch(e) {
      locaStorage.removeItem('players');
    }
    }

  },

   

})

}
)
