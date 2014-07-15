/**
 * Created by Wang Yihan on 2014/7/14.
 */

var ground = cc.Sprite.extend({
    speed : 5,
    posX : null,
    posY : null,
    len: null,

    ctor : function(lenth, high){
        this._super();
        this.len = eval(lenth);
        this.posY = eval(high);
        this.initWithFile(s_ground, cc.rect(0,0,this.len,30));
        this.posX = cc.Director.getInstance().getWinSize().width + this.len/2;
        this.init();
    },

    init : function(){
        this.setPosition(this.posX, this.posY);
        this.schedule(this.move, 0);
    },

    setFirstGround : function(){
        this.posX = 500;
        this.setPosition(this.posX, this.posY);
    },

    move : function(){
        this.posX = this.posX - this.speed;
        this.setPosition(this.posX, this.posY);
    }
});