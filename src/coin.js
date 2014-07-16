/**
 * Created by Wang Yihan on 2014/7/15.
 */
/**
 * Created by Wang Yihan on 2014/7/14.
 */

var coin = cc.Sprite.extend({
    speed : null,
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

var getScoreLabel = cc.LabelTTF.extend({
    posX : null, posY : null,
    action : null,
    speed : null,
    label : null,
    ctor : function(x, y){
        this._super();
        this.posY = eval(y)+180;
        this.posX = eval(x);
        //this.label = cc.LabelTTF.create('+200', 'Consolas', 40);
        //this.label.setColor(0,0,0);
        this.initWithString('+200', 'Harrington', 40);
        this.setColor(new cc.Color3B(255,255,0));
        console.log(this.posX, this.posY);
        this.setPosition(this.posX, this.posY);
        this.action = cc.FadeOut.create(1.0);
        this.speed = 5;
        this.runAction(this.action);
        this.schedule(this.move, 0);
    },

    move : function(){
        this.posY = this.posY + this.speed;
        this.setPosition(this.posX, this.posY);
    }
});