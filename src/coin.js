/**
 * Created by Wang Yihan on 2014/7/15.
 */
/**
 * Created by Wang Yihan on 2014/7/14.
 */

var coin = cc.Sprite.extend({
    type : null,
    speed : 5,
    width : null,
    height : null,
    posX : null,
    posY : null,

    ctor : function(x, y, type, speed){  //type = 0 短  type=1 长
        this._super();
        if(type == 0){
            this.initWithFile(s_coin, cc.rect(0,0,40,40));
            this.type = 0;
            this.width = 20;
            this.height = 20;
            this.posY = eval(y) + 20;
        }
        else if(type == 1){
            this.initWithFile(s_coin, cc.rect(0,0,50,60));
            this.type = 1;
            this.width = 25;
            this.height = 30;
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