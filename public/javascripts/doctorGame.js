"use strict";

// Game configuration, Canvas
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
// Declared variables in the game
var player;
var daleks;
var sonics;
var bombs;
var sonicWaves;
var platforms;
var cursors;
var highScore = 0;
var score = 0;
var gameOver = false;
var scoreText;
var endText;
var button;
var button2;

// Game object
var game = new Phaser.Game(config);
// preloading the game
function preload ()
{
    this.load.image('space', 'assets/space.jpg');
    this.load.image('planetsurface', 'assets/surface.png');
    this.load.image('moon','assets/surface_small.png')
    this.load.image('sonic', 'assets/sonic.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('dalek','assets/dalek.png');
    this.load.image('sonicWave', 'assets/sonicWave.png');
    this.load.spritesheet('doctor', 'assets/doctor.png', { frameWidth: 50, frameHeight: 60 });

}
//Creating the game components
function create ()
{
    //  Background for the game
    this.add.image(400, 300, 'space');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground of the planet.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'planetsurface').setScale(2).refreshBody();

    //  Other surfaces
    platforms.create(700, 400, 'planetsurface');
    platforms.create(-50, 250, 'planetsurface');
    platforms.create(850, 220, 'planetsurface');
    //smaller moon to jump on
    platforms.create(450,200,'moon').setScale(1).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'doctor');

    //  Player physics properties. Give the Doctor a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('doctor', { start: 10, end: 17 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'doctor', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('doctor', { start: 19, end: 26 }),
        frameRate: 20,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some sonics to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    sonics = this.physics.add.group({
        key: 'sonic',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    sonics.children.iterate(function (child) {

        //  Give each sonic a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();
    sonicWaves = this.physics.add.group();
    daleks = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#999' });

    //set highscore for the game
    var highScore = localStorage.highScore

    //  Collide the Doctor, dalek and the sonics with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(sonics, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(daleks, platforms);


    //  Checks to see if the player overlaps with any of the sonics, if he does call the collectsonic function
    this.physics.add.overlap(player, sonics, collectsonic, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player, daleks, hitBomb, null, this);

    // Checks if dalek overlaps with sonics
    this.physics.add.overlap(daleks, sonics, destroySonic, null, this);
}


function update ()
{

    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-180);

        player.anims.play('left', true);

        if (cursors.right.spaceKey)
        {
          useSonic();
        }
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(180);

        player.anims.play('right', true);
        if (cursors.left.spaceKey)
        {
          useSonic();
        }
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectsonic (player, sonic)
{
    sonic.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (sonics.countActive(true) === 0)
    {
        //  A new batch of sonics to collect
        sonics.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        // Create bombs every round
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
        //create a Dalek every round
        var dalek = daleks.create(x,200,'dalek');
        dalek.setVelocity(Phaser.Math.Between(-100,100));
        dalek.setCollideWorldBounds(false);
        dalek.allowGravity = false;

    }
}
//updating highscore if new record
function checkScore(){
  if (this.localStorage) {
      localStorage.score = this.score;
      if (localStorage.highScore) {
          if (locaStorage.score > localStorage.highScore) {
              localStorage.highScore = localStorage.score;
          }
      }
      else {
          localStorage.highScore = localStorage.highScore;
      }
  }}

// What happens when a dalek hits a sonic
function destroySonic (dalek,sonic) {
  sonic.disableBody(true, true);
}
// What happens when player hits a bomb
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    endText = this.add.text(300, 200, 'You lost', { fontSize: '64px', fill: '#300' });

    player.anims.play('turn');

    checkScore();
    localStorage.setItem('score',score);
    localStorage.setItem('highScore',highScore);
    // options to continue
    button = this.add.text(250, 320, 'Save highscore', {fontSize: '50px',  fill: '#FFFFFF' });

    button2 = this.add.text(250,280, 'Play again', {fontSize: '50px', fill: '#00ff00'});

    gameOver = true;
}
function useSonics () {

  var sonicWave = sonicWawes.create(200, 200, 'sonicWawe');
  sonicWave.setVelocityX(100);
  sonicWave.allowGravity = false;
}
