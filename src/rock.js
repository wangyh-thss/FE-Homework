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
            this.initWithFile(s_rock0, cc.rect(0,0,110,128));
            this.width = 55;
            this.height = 64;
            this.posY = eval(y) + 20;
        }
        else if(type == 1){
            this.initWithFile(s_rock1, cc.rect(0,0,68,79));
            this.width = 34;
            this.height = 39.5;
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