

//lives global variable
/*  Declaring lives as a global variable allows me to
    carry lives collected in previous levels to the next
    level. Also timer is treated a a global variable, and
    on every level time is updated.
*/
var lives = 3;
var timer;
var timeLeft = 120;
var textTimer;


Enemy = function(index,game,x,y,player,player_bullets,range,fireRate) {

    /*  Function:   Enemy, creates a enemy with its own update function,
                    allows each enemy to have its own unique behaviour
        Arguments:  index, Phaser game, position x, position y, player
                    player_bullets(weapon created inside of prototype
                    Ex. weapon.bullets), range (enemy x position from
                    player position), fireRate (how many bullets is
                    capable of shot)
    */


    //Enemy function
    Phaser.Sprite.call(this,game,x,y,'enemyPlant');
    this.fireRate = fireRate;
    this.range = range;
    this.playerBullets = player_bullets;

    //position of the enemy
    this.x = x;
    this.y = y;
    this.game = game;

    this.player = player;
    //creates the weapon for each individual enemy
    this.weapon = game.add.weapon(this.fireRate,'egg');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    this.weapon.bulletKillDistance = this.range;
    this.weapon.bulletSpeed = 200;
    this.weapon.fireRate = 100;
    this.weapon.trackSprite(this);

    //enemy is added to the world
    game.add.existing(this);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

    var distanceToPlayer;

Enemy.prototype.update = function (){

    //notes: the plants now shot based on a better and accurate distance between the current plant
    //and player.

    //checks collision between enemy weapon and player
    this.game.physics.arcade.overlap(this.weapon.bullets, this.player ,bulletCollision,null,this);

    //calculates the distance to player in every loop
    distanceToPlayer = this.game.math.distance(this.x,this.y,this.player.x,this.player.y);

    //shoots enemy weapon to player direction if player is in range
    if(distanceToPlayer < this.range && this.alive){

        //weapon calculates and shot to player location changes every time it shots
        this.weapon.fireAtSprite(this.player);

    }

    //collision between player bullets and enemy
    if(checkOverlap(this,this.playerBullets)){
        if(this.alive){
            //plays hurt sound
            //kills enemy and weapon
            plantSound.play();
            this.kill();
            this.weapon.bullets.killAll();

        }
    }


};
//enemy function checks collision between to sprites
function checkOverlap(spriteA, spriteB){
    //CONTROLS COLLISION BETWEEN TO SPRITES
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}


RickTheChick.Level1 = function (game) {};

//VARIABLES

//------MAP VARIABLES -------
var map;
var layer;


//-----VARIABLES PLAYER -------
var fireButton;
var cursors;
var player;
var jumpTimer = 0;
var weapon;
var jumpVelocity = -550;
var speed = 100;
var velocityIncrement = 100;
var livesText;
var corn;
var coinText;
var chest;
var facingSide = true;

//shotgun

var fireLimit = 8;
var bulletsLeft = fireLimit;
//enemy
var enemyPlant;

//buttons
var runFaster;

//------VARIABLES SOUNDS EFFECTS--------
var jumpSound;
var fireSound;
var coinSound;
var extraLiveSound;
var hurtSound;
var loseSound;
var plantSound;

//debugger
var debugText;
var coordinates;

//Shotgun
var shotgunText;

    RickTheChick.Level1.prototype = {

        preload: function (game){

            this.load.tilemap('map','maps/Level1.json',null,Phaser.Tilemap.TILED_JSON);
        },

        create: function (game) {
            //--------SOUND-------

            //SOUNDS EFFECTS
            jumpSound = this.add.audio('jump');
            fireSound = this.add.audio('fire');
            coinSound = this.add.audio('coin');
            extraLiveSound = this.add.audio('extraLive');
            hurtSound = this.add.audio('hurt');
            loseSound = this.add.audio('lose');
            plantSound = this.add.audio('planthurt');

            //---------FIRST LEVEL MAP ----------

            //BACKGROUND COLOR
            this.stage.backgroundColor = "#4488AA";

            //MAP SETTINGS AND PROPERTIES
            map = this.add.tilemap('map');
            map.addTilesetImage('ground');
            layer = map.createLayer('Tile Layer 1');
            layer.resizeWorld();


            //MAP COLLISIONS
            map.setCollisionBetween(0,24);

            //---------END MAP SETTINGS-----------

            //----------PHYSICS----------------

            //Phaser Arcade Physics
            this.physics.startSystem(Phaser.Physics.ARCADE);

            //----------END PHYSICS--------------


            //-----Corn group -----
            corn = this.add.group();
            corn.enableBody = true;

            map.createFromObjects('corn layer',33,'corn',0,true,false,corn);
            //------Chest group ----

            chest = this.add.group();
            chest.enableBody = true;

            map.createFromObjects('chest layer',37,'chest',1,true,false,chest);

            //---------- PLAYER SETTINGS -------
            player = this.add.sprite(0, 836, 'chick');

            //Adding Physics -- Player
            this.physics.arcade.enable(player);
            player.body.bounce.y = 0.3;
            player.body.gravity.y = 1500;
            player.body.collideWorldBounds = true;

            //Animations -- Player
            var animationRate = 10;
            player.animations.add('right', [4, 5, 6, 7], animationRate, true);
            player.animations.add('left', [0, 1, 2, 3], animationRate, true);


            //---------- END PLAYER SETTINGS


            //----------WEAPON SETTINGS---------
            weapon = this.add.weapon(1, 'shot');
            weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE; //kill bullets when they reach a certain distance
            weapon.bulletKillDistance = 125;
            weapon.bulletSpeed = 400;
            weapon.fireRate = 500;
            weapon.fireLimit = fireLimit;


            //tracking system

            weapon.trackSprite(player, 30, 15, true);
            weapon.trackRotation = false;

            //-------- END WEAPON SETTINGS------------


            //--------- CONTROLS SETTINGS ------------

            cursors = this.input.keyboard.createCursorKeys();
            fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            runFaster = this.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

            fireButton.onDown.add(fire);


            //=-------- END CONTROL SETTINGS-------------

            //--------- CAMERA SETTINGS -----------
            this.camera.follow(player);

            //--------- END CAMERA SETTINGS-------

            //debugger
            /*
            debugText = this.add.text(16, 30, 'Coordinates: ', {fontSize: '10px', fill: '#00'});
            debugText.fixedToCamera = true;
            */
            //------------ TEXT SETTINGS ------------
            //text lives
            livesText = this.add.text(16, 10, 'Lives: ' + lives, {fontStyle: 'Italic',fontSize: '15px', fill: 'Red'});
            livesText.fixedToCamera = true;
            //text coins
            coinText = this.add.text(490,10,'Corn Left: ' + corn.total, {fontStyle: 'Italic', fontSize: '15px', fill: 'yellow'});
            coinText.fixedToCamera = true;
            //text shotgun
            shotgunText = this.add.text(490,30,'Shotgun: ' + bulletsLeft, {fontStyle: 'Italic',fontSize: '15px', fill: 'blue' });
            shotgunText.fixedToCamera = true;

            //----- TIMER ------
            timer = this.time.create(false);
            timer.loop(1000,counterTime,this);
            timer.start();

            textTimer = this.add.text(255,10,'Time: ' + timeLeft, {fontStyle: 'Italic',fontSize: '15px', fill: 'white' });
            textTimer.fixedToCamera = true;


            //------Enemies --------
            new Enemy(0,game,732,695,player,weapon.bullets,225,25);
            new Enemy(1,game,1853,885,player,weapon.bullets,125,1);
            new Enemy(2,game,2203,725,player,weapon.bullets,150,1);
            new Enemy(3,game,2491,665,player,weapon.bullets,200,1);
            new Enemy(4,game,2828,470,player,weapon.bullets,100,1);

        },


        update: function () {

            //PART OF DEBUGGER FUNCTION
            coordinates = player.x + '  ' + player.y;

            //RESET PLAYER VELOCITY TO ZERO
            player.body.velocity.x = 0;

            //PHYSICS COLLISIONS
            this.physics.arcade.collide(player, layer); // collision with map tiles
            this.physics.arcade.overlap(player,corn,collectCorn, null,this); //collision between player and corn
            this.physics.arcade.overlap(player,chest,lootChest,null,this); //chest looting collision




            if (cursors.left.isDown) {
                facingSide = false;
                //Move Left
                //player animations plays, speed increment
                player.body.velocity.x = -speed;
                player.animations.play('left');
                weapon.fireAngle = 180;

                //this if statements add velocity when A key and left are pressed
                if (cursors.left.isDown && runFaster.isDown) {
                    player.body.velocity.x = -speed - velocityIncrement;
                }

            } else if (cursors.right.isDown) {

                facingSide = true;

                // Move Right
                player.body.velocity.x = speed;
                player.animations.play('right');
                weapon.fireAngle = 0;
                if (cursors.right.isDown && runFaster.isDown) {
                    player.body.velocity.x = speed + velocityIncrement;
                }

            } else {

                //Stops animations when player isn't moving
                //frame stop depending on what way Chick is looking.
                if(facingSide){

                    player.animations.stop();
                    player.frame = 4;
                    weapon.fireAngle = 0;
                    weapon.trackSprite(player, 30, 18, false);
                }else if(!facingSide) {

                    player.animations.stop();
                    player.frame = 3;
                    weapon.fireAngle = 180;
                    weapon.trackSprite(player, 0, 18, false);
                }
            }

            //Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)
                && this.time.now > jumpTimer) {

                player.body.velocity.y = jumpVelocity;
                jumpTimer = this.time.now + 750;
                jumpSound.play();

                if (runFaster.isDown) {

                    player.body.velocity.y = jumpVelocity - 100;
                }
            }

            //Makes the throw eggs and depends on what side Chick is facing
            if (fireButton.isDown) {
                if(facingSide){
                    player.frame =8;

                }else if(!facingSide){
                    player.frame = 9;
                }
            }

            gameOver(this,120);
            restartPos(0, 836);//repositions player after it falls out of the map.
           // debug();//DEBUGGER
            nextLevel(this,'Level2');
        }

    };

    //----------------USEFUL FUNCTIONS------------------

    function gameOver(game,resetTime) {

        this.game = game;

        if(lives < 1){
            lives = 3;
            timeLeft = resetTime;
            timer.stop();
            this.game.state.start('Menu'); //Menu state to restart the entire game
        }else if(timeLeft < 1){
            timeLeft = resetTime;
            textTimer.text = "Time: " + timeLeft;
            resetPlayer(0,836);
        }

    }

    function counterTime(){
        timeLeft--;
        textTimer.text = "Time: " + timeLeft;
    }

    function resetPlayer(positionX,positionY) {

        lives = lives - 1;
        livesText.text = "Lives: " + lives;//updates lives left
        player.x = positionX;
        player.y = positionY;

    }


    function lootChest(player,chest){
        chest.kill();
        lives++;
        livesText.text = "Lives: " + lives; //updates lives left
        extraLiveSound.play();
        bulletsLeft = fireLimit;
        shotgunText.text = "Shotgun: "+ bulletsLeft; //updates shotgun bullets
        weapon.resetShots();
    }

    function collectCorn(player,coin) {
        //it's used on collision between player and coin/corn
        coinSound.play();
        coin.kill();
        coinText.text = "Corn Left: " + corn.total; //updates corn left text

    }

    function bulletCollision(){
        //it uses on collision between player and enemy bullet
        bulletsLeft = fireLimit;
        shotgunText.text = "Shotgun: " + bulletsLeft;
        hurtSound.play();
        resetPlayer(0,836);
    }

    function restartPos(positionX,positionY) {
        //restart player position after player falls out fo the map

        if (player.body.y > 931) {
            loseSound.play();
            lives = lives - 1;
            bulletsLeft = fireLimit;
            shotgunText.text = "Shotgun: " + bulletsLeft;
            //lives are taking away when player falls out of the map.
            livesText.text = 'Lives: ' + lives;
            //reposition player.
            player.x = positionX;
            player.y = positionY;
        }
    }

    function fire() {
        if(bulletsLeft > 0 ){
            //shots only if the bullet left > 0
            bulletsLeft = bulletsLeft -1; //reduces bullets left by one
            shotgunText.text = "Shotgun: " + bulletsLeft; //updates shotgun bullets
            fireSound.play();
            weapon.fire();
        }

    }

    /*
    function debug() {
        debugText.text = 'Coordinates: ' + coordinates;
    }
    */

    function nextLevel(game,level){


        if(corn.total < 1) {
            //function calls the next level.
            timer.stop();
            bulletsLeft = 8;
            this.game = game;
            levelText = this.game.add.text(250,200, 'Good Job!', {fontStyle: 'Italic',fontSize: '50px', fill: 'Blue'});
            this.game.time.events.add(Phaser.Timer.SECOND * 1,function () {
                this.game.state.start(level);
            },this);

        }
    }


