/**
 * Created by Wang Yihan on 2014/7/15.
 */
var property = cc.Sprite.extend({
    type : null,
    speed : null,
    width : null,
    height : null,
    posX : null,
    posY : null,
    //构造函数，根据不同类型加载不同图片
    ctor : function(x, y, type, speed){  //type = 0 短  type=1 长
        this._super();
        if(type == 'p_fly'){
            this.initWithFile(s_fly);
            this.type = 'p_fly';
            this.width = 20;
            this.height = 20;
            this.posY = eval(y) + 20;
        }
        else if(type == 'p_wudi'){
            this.initWithFile(s_wudi);
            this.type = 'p_wudi';
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