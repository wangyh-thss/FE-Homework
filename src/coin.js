/**
 * Created by Wang Yihan on 2014/7/15.
 */
/**
 * Created by Wang Yihan on 2014/7/14.
 */

var coin = cc.Sprite.extend({
    speed : 5,
    width : null,
    height : null,
    posX : null,
    posY : null,

    ctor : function(x, y, speed, str){  //type = 0 短  type=1 长
        this._super();
        this.initWithSpriteFrameName(str);
        this.type = 0;
        this.width = 20;
        this.height = 20;
        this.posY = eval(y) + 20;
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