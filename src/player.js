/**
 * Created by Wang Yihan on 2014/7/15.
 */
var player = cc.Sprite.extend({
    velocity : null,
    accelerate : null,
    posX : null, posY : null,
    on_ground : null,                   //悬空标识
    falling : null,                     //下落标识  只有在下落过程中才可以落在地上
    flyLable : null,                    //吃到羽毛后的飞行标识
    one_jump : null, two_jump : null,   //一、二段跳标识
    //构造函数
    ctor : function(x, y, str){
        this._super();
        this.posX = eval(x);
        this.posY = eval(y);
        this.initWithSpriteFrameName(str);
        this.init();
    },
    //初始化
    init : function(){
        this.setPosition(this.posX, this.posY);
        this.velocity = 0;
        this.accelerate = 0.9;
        this.on_ground = false;
        this.one_jump = false;
        this.two_jump = false;
        this.falling = true;
        this.flyLable = false;
        this.schedule(this.move, 0);
    },
    //跳起
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
        this.velocity = 20;
    },
    //根据不同的标识状态和速度&加速度更新位置
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
    //飞行模式
    fly : function(){
        this.velocity = 14;
        this.flyLable = true;
        this.scheduleOnce(this.fallDown, 2);
    },
    fallDown : function(){
        this.velocity = 0;
        this.flyLable = false;
    }
});