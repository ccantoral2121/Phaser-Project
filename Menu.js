RickTheChick.Menu = function (game) {};


    RickTheChick.Menu.prototype = {

        create: function () {

            //ONE TIME SETTINGS  ----- AT MOMENT NOT SURE OF WHAT THEY DO
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = false;
            this.scale.minWidth = 600;
            this.scale.minHeight = 400;
            this.scale.pagelAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

            var levelText;


            //this.input.addPointer();
            this.stage.backgroundColor = "#FFF";

            //Menu
            this.add.sprite(0, 0,'menu');

            //START BUTTON

            menuText = this.add.text(250,252,'Press to play',{fontStyle: 'Italic',fontSize: '15px',fill: 'white'});

            button = this.add.button(275, 275, 'playButton', function () {

                levelText = this.add.text(240,350, 'LEVEL 1', {fontStyle: 'Italic',fontSize: '30px', fill: 'Red'});


                this.time.events.add(Phaser.Timer.SECOND * 2,function () {

                    var music;
                    music = this.add.audio('backgroundMusic');
                    music.volume = 0.05;
                    music.play();

                    this.state.start('Level1');
                },this);


            }, this);



        }
    };



