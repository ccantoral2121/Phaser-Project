
RickTheChick.Level2 = function (game) {};

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

RickTheChick.Level2.prototype = {

    preload: function (game){

        this.load.tilemap('map','maps/Level2.json',null,Phaser.Tilemap.TILED_JSON);
    },

    create: function (game) {

        //--------TIMER------



        //--------SOUND-------

        //SOUNDS EFFECTS PLAYER
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


        //MAP COLLISION
        map.setCollisionBetween(0,24);

        //---------END MAP SETTINGS-----------

        //----------PHYSICS----------------

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
        timeLeft = 180;
        timer = this.time.create(false);
        timer.loop(1000,counterTime,this);
        timer.start();
        textTimer = this.add.text(255,10,'Time: ' + timeLeft, {fontStyle: 'Italic',fontSize: '15px', fill: 'white' });
        textTimer.fixedToCamera = true;




        //------Enemies --------
        new Enemy(0,game,509,890,player,weapon.bullets,200,1);
        new Enemy(1,game,1051,570,player,weapon.bullets,200,1);
        new Enemy(2,game,254,314,player,weapon.bullets,200,1);
        new Enemy(3,game,571,122,player,weapon.bullets,200,2);
        new Enemy(3,game,762,122,player,weapon.bullets,200,2);
        new Enemy(4,game,1152,282,player,weapon.bullets,250,1);
        new Enemy(5,game,1152,538,player,weapon.bullets,250,1);
        new Enemy(6,game,1152,794,player,weapon.bullets,250,1);
        new Enemy(7,game,1689,602,player,weapon.bullets,250,3);
        new Enemy(8,game,1689,602,player,weapon.bullets,125,1);
        new Enemy(9,game,1689,442,player,weapon.bullets,125,1);
        new Enemy(10,game,1689,282,player,weapon.bullets,125,1);
        new Enemy(11,game,1689,122,player,weapon.bullets,125,1);


        /*
        new Enemy(0,game,796,538,player,weapon.bullets,150,1);
        new Enemy(1,game,285,118,player,weapon.bullets,200,2);
        new Enemy(2,game,190,185,player,weapon.bullets,200,3);
        new Enemy(3,game,90,118,player,weapon.bullets,200,2);
        new Enemy(4,game,1184,250,player,weapon.bullets,200,2);
        new Enemy(5,game,733,30,player,weapon.bullets,125,2);
        new Enemy(6,game,1054,30,player,weapon.bullets,125,2);
        new Enemy(7,game,1722,154,player,weapon.bullets,175,2);
        new Enemy(8,game,1406,538,player,weapon.bullets,175,1);
        new Enemy(9,game,1616,794,player,weapon.bullets,175,1);
        new Enemy(10,game,1820,634,player,weapon.bullets,125,1);
        new Enemy(11,game,2332,473,player,weapon.bullets,175,2);
        */

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

        gameOver(this,180);
        restartPos(0, 836);//repositions player after it falls out of the map.
       // debug();//DEBUGGER
        nextLevel(this,'Menu');
    }

};

