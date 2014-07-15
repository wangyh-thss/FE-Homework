/**
 * Created by Wang Yihan on 2014/7/15.
 */
var player = cc.Sprite.extend({
    velocity : null,
    accelerate : null,
    posX : null, posY : null,
    on_ground : null,
    falling : null,
    flyLable : null,
    one_jump : null, two_jump : null,

    ctor : function(x, y, str){
        this._super();
        this.posX = eval(x);
        this.posY = eval(y);
        this.initWithSpriteFrameName(str);
        this.init();
    },

    init : function(){
        this.setPosition(this.posX, this.posY);
        this.velocity = 0;
        this.accelerate = 0.8;
        this.on_ground = false;
        this.one_jump = false;
        this.two_jump = false;
        this.falling = true;
        this.flyLable = false;
        this.schedule(this.move, 0);
    },

    jump : function(){
        if(this.flyLable == true)
            return;
        if(this.one_jump && this.two_jump)
            return;
        if(this.one_jump == false)
            this.one_jump = true;
        else if(this.one_jump == true && this.two_jump == false)
            this.two_jump = true;
        this.on_ground = false;
        this.velocity = 22;
    },

    move : function(){
        if(this.flyLable == true){
            if(this.posY < cc.Director.getInstance().getWinSize().height - 100){
                this.posY = this.posY + this.velocity;
                this.setPosition(this.posX, this.posY);
            }
            return;
        }
        if(this.velocity < 0){
            this.falling = true;
        }else{
            this.falling = false;
        }
        if(this.on_ground == false){
            this.posY = this.posY + this.velocity;
            this.velocity = this.velocity - this.accelerate;
            this.setPosition(this.posX, this.posY);
        }else{
            this.one_jump = this.two_jump = this.falling = false;
            this.velocity = 0;
            this.setPosition(this.posX, this.posY);
        }
    },

    fly : function(){
        this.velocity = 14;
        this.flyLable = true;
        this.scheduleOnce(this.noFly, 2);
    },

    noFly : function(){
        this.velocity = 0;
        this.flyLable = false;
    }
});