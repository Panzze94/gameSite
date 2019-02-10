'use strict';

document.addEventListener("DOMContentLoaded", function(){

var app = new Vue ({
    el: '#app',
    name: 'vue-instance',

    data () {
      return {
        itemName: '',
        players: [
          'master26 300',
          'theSilence 688',
          'RiverSong 900'
        ],
        highScore: localStorage.getItem('highScore'),
      };
    },

    mounted () {
      if (localStorage.getItem('players')) {

      try {
        this.players = JSON.parse(localStorage.getItem('players'));
      }  catch(e) {
        localStorage.removeItem('players');
      }
      }

    },
    methods: {
      // adding new player and score
      addItem () {
        if (!this.itemName) return;
        this.players.push(this.itemName);
        console.log(this.itemName);
        this.itemName ='';
        this.savePlayers();
      },
      savePlayers(){
        // local storage only supports strings as values--> converting the array to string
          let parsed = JSON.stringify(this.players);
          localStorage.setItem('players', parsed);
            },

     },
   }
  )})
