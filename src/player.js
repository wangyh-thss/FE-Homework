/**
 * Created by Wang Yihan on 2014/7/15.
 */
var player = cc.Sprite.extend({
    velocity : null,
    accelerate : null,
    posX : null, posY : null,
    on_ground : null,
    falling : null,
    one_jump : null, two_jump : null,

    ctor : function(x, y){
        this._super();
        this.posX = eval(x);
        this.posY = eval(y);
        this.initWithFile(s_player, cc.rect(0,0,30,30));
        this.init();
    },

    init : function(){
        this.setPosition(this.posX, this.posY);
        this.velocity = 0;
        this.accelerate = 0.4;
        this.on_ground = false;
        this.one_jump = false;
        this.two_jump = false;
        this.falling = true;
        this.schedule(this.move, 0);
    },

    jump : function(){
        console.log(this.one_jump, this.two_jump)
        if(this.one_jump && this.two_jump)
            return;
        if(this.one_jump == false)
            this.one_jump = true;
        else if(this.one_jump == true && this.two_jump == false)
            this.two_jump = true;
        this.on_ground = false;
        this.velocity = 16;
    },

    move : function(){
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
            console.log(this.velocity);
            this.one_jump = this.two_jump = this.falling = false;
            this.velocity = 0;
            this.setPosition(this.posX, this.posY);
        }
    }
});