
var RickTheChick = {};

RickTheChick.Boot = function(game) {};

RickTheChick.Boot.prototype = {

    preload: function () {

        //preload bar ---- to use later on the project
        this.load.image('button','images/loader_bar.png');
        this.load.image('sky','assets/sky.png');

        //Preload image
        this.load.image('playButton','images/playButton.png');
        this.load.image('egg','images/egg.png');
        this.load.image('shot','images/shot.png');
        this.load.image('menu','images/menu.png');
        this.load.image('playButton','images/playbutton.png');
        this.load.image('corn','images/corn.png');
        this.load.image('chest','images/chest.png');
        this.load.image('enemyPlant','images/enemy_plant.png');
        this.load.image('black','images/black.png');

        //LOADING ASSETS
       // this.load.image('sky','images/sky.png');
        this.load.audio('jump','audio/jump.mp3');
        this.load.audio('fire','audio/fire.mp3');
        this.load.audio('coin','audio/coin.mp3');
        this.load.audio('extraLive','audio/extra_live.mp3');
        this.load.audio('hurt','audio/hurt.mp3');
        this.load.audio('lose','audio/lose.mp3');
        this.load.audio('planthurt','audio/planthurt.mp3');
        this.load.audio('backgroundMusic','audio/music.mp3');

        //LOADING SPRITE SHEETS
        this.load.spritesheet('chick','assets/chick.png',32,28);

        //maps are going to be loaded on their corresponded level
        this.load.image('ground','assets/ground.png');

    },

    update: function(){

            this.state.start('Menu');

    }
};
