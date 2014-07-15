/**
 * Created by Wang Yihan on 2014/7/14.
 */

var rock = cc.Sprite.extend({
    speed : null,
    width : null,
    height : null,
    posX : null,
    posY : null,

    ctor : function(x, y, type, speed){  //type = 0 短  type=1 长
        this._super();
        if(type == 0){
            this.initWithFile(s_rock, cc.rect(0,0,160,160));
            this.width = 80;
            this.height = 80;
            this.posY = eval(y) + 20;
        }
        else if(type == 1){
            this.initWithFile(s_rock, cc.rect(0,0,100,100));
            this.width = 50;
            this.height = 50;
            this.posY = eval(y) + 30;
        }
        this.posX = cc.Director.getInstance().getWinSize().width + eval(x);
        this.speed = eval(speed);
        this.init();
    },

    init : function(){
        this.setPosition(this.posX, this.posY);
        this.schedule(this.move, 0);
    },

    move : function(){
        this.posX = this.posX - this.speed;
        this.setPosition(this.posX, this.posY);
    }
});