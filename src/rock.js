/**
 * Created by Wang Yihan on 2014/7/14.
 */

var rock = cc.Sprite.extend({
    speed : 5,
    posX : null,
    posY : null,

    ctor : function(x, y, type){  //type = 0 短  type=1 长
        this._super();
        if(type == 0){
            this.initWithFile(s_rock, cc.rect(0,0,30,30));
            this.posY = eval(y) + 15;
        }
        else if(type == 1){
            this.initWithFile(s_rock, cc.rect(0,0,35,50));
            this.posY = eval(y) + 25;
        }
        this.posX = cc.Director.getInstance().getWinSize().width + eval(x);
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