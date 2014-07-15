/**
 * Created by Wang Yihan on 2014/7/14.
 */

var gameZIndex = {bg: 0, ui: 1, score:2}

var gameLayer = cc.LayerColor.extend({
    groundArray : null,
    rockArray : null,
    coinArray : null,
    speed : null,
    player : null,
    score : null,
    scoreLabel : null,

    ctor : function(){
        this._super();
        this.init();
    },

    init : function(){
        //background
        var bg = cc.Sprite.create(s_background);
        this.addChild(bg, gameZIndex.bg);
        //this.gameLayer.setColor(cc.c4(255,255,255,255));
        bg.setAnchorPoint(0,0);
        bg.setPosition(0,0);
        //player
        this.player = new player(100, 200);
        this.addChild(this.player, gameZIndex.ui);
        //ground rock coin
        this.groundArray = [];
        this.rockArray = [];
        this.coinArray = [];
        this.speed = 5;
        this.groundArray[0] = new ground(1000, 50, this.speed);
        this.groundArray[0].setFirstGround();
        this.addChild(this.groundArray[0], gameZIndex.ui);
        this.schedule(this.updateGround, 0);
        //event
        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);
        this.schedule(this.onTheGround, 0);
        //judge dead
        this.schedule(this.gameOver, 0);
        //scoreLayer
        this.score = 0;
        this.initScoreLable();
        this.schedule(this.updateScore, 0);
        //speed up
        this.schedule(this.speedUp, 5);
    },

    updateGround : function(){
        if(this.groundArray.length <= 0){
            this.addGround();
            return;
        }
        if(this.groundArray[0].posX + this.groundArray[0].len/2 <= 0){
            this.delGround();
        }
        if(this.rockArray[0] && this.rockArray[0].posX + 20 <= 0){
            this.delRock();
        }
        if(this.coinArray[0] && this.coinArray[0].posX + 20 <= 0){
            this.delCoin(0);
        }
        var num = this.groundArray.length;
        var screenWidth = cc.Director.getInstance().getWinSize().width;
        if(screenWidth - (this.groundArray[num-1].posX + this.groundArray[num-1].len/2) >= 100){
            this.addGround();
        }
    },

    addGround : function(){
        var size = cc.Director.getInstance().getWinSize();
        var num = this.groundArray.length;
        var len = GetRandomNum(300, 1800);
        var delta = GetRandomNum(100, 400);
        var upOrDown = GetRandomNum(-10, 10);
        var high;
        //确定与前面一块ground的高度差
        if(upOrDown >= 0 && delta <= 200){
            high = this.groundArray[num-1].posY + delta;
        }else{
            high = this.groundArray[num-1].posY - delta;
        }
        if(high >= size.height - 200){
            high = this.groundArray[num-1].posY - delta;
        }
        if(high < 100){
            if(delta > 200)
                high = this.groundArray[num-1].posY + delta;
            else
                high = this.groundArray[num-1].posY + delta - 200;
        }
        //根据长度确定是否加入障碍物
        if(len > 1300){
            for(var i = 300; i <= 1200; i+=300){
                if(GetRandomNum(-10, 10) > 0)
                    this.addRock(i, high, 0);
                else
                    this.addRock(i, high, 1);
            }
        }
        //加入金币
        if(len < 1000){
            for(var i = 300; i <= len-200; i+=100){
                if(GetRandomNum(-10, 10) > 0)
                    this.addCoin(i, high, 0);
                else
                    this.addCoin(i, high, 1);
            }
        }
        //添加到层
        this.groundArray[num] = new ground(len, high, this.speed);
        this.addChild(this.groundArray[num], gameZIndex.ui);
        function GetRandomNum(Min, Max){
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }
    },

    addRock : function(x, y, style){
        var num = this.rockArray.length;
        this.rockArray[num] = new rock(x, y, style, this.speed);
        this.addChild(this.rockArray[num], gameZIndex.ui);
    },

    addCoin : function(x, y, style){
        var num = this.coinArray.length;
        this.coinArray[num] = new coin(x, y, style, this.speed);
        this.addChild(this.coinArray[num], gameZIndex.ui);
    },

    delGround : function(){
        var toDelete = this.groundArray.shift();
        this.removeChild(toDelete, true);
    },
    delRock : function(){
        var toDelete = this.rockArray.shift();
        this.removeChild(toDelete, true);
    },
    delCoin : function(index){
        this.removeChild(this.coinArray[eval(index)], true);
        this.coinArray.splice(eval(index), 1);
    },

    onMouseDown:function(event) {
        this.player.fly();
    },

    onTheGround : function(){
        var x = this.player.posX;
        var y = this.player.posY;
        for(var i = 0; i < this.groundArray.length; i++){
            if(y <= this.groundArray[i].posY + 40 && y >= this.groundArray[i].posY + 20){
                if(x > this.groundArray[i].posX - this.groundArray[i].len/2 && x < this.groundArray[i].posX + this.groundArray[i].len/2)
                    if(this.player.on_ground == true)
                        return;
                    else{
                        if(this.player.falling){
                            this.player.on_ground = true;
                            return;
                        }
                    }
            }
        }
        this.player.on_ground = false;
    },

    gameOver : function(){
        if(this.collideRock() || this.fallDown()){
            //dead
            console.log('dead!!');
        }
    },

    collideRock : function(){
        for(var i = 0; i < this.rockArray.length; i++){
            if(this.player.posX < this.rockArray[i].posX+this.rockArray[i].width && this.player.posX > this.rockArray[i].posX-this.rockArray[i].width)
                if(this.player.posY < this.rockArray[i].posY+this.rockArray[i].height && this.player.posY > this.rockArray[i].posY-this.rockArray[i].height)
                    return true;
        }
        return false;
    },

    collideCoin : function(){
        for(var i = 0; i < this.coinArray.length; i++){
            if(this.player.posX < this.coinArray[i].posX+this.coinArray[i].width && this.player.posX > this.coinArray[i].posX-this.coinArray[i].width)
                if(this.player.posY < this.coinArray[i].posY+this.coinArray[i].height && this.player.posY > this.coinArray[i].posY-this.coinArray[i].height){
                    if(this.coinArray[i].type == 0)
                        this.addScore(200);
                    if(this.coinArray[i].type == 1)
                        this.addScore(300);
                    this.delCoin(i);
                }
        }
    },

    fallDown : function(){
        if(this.player.posY < 0){
            return true;
        }
        return false;
    },

    speedUp : function(){
        this.speed = this.speed * 1.2;
        for(var i = 0; i < this.groundArray.length; i++){
            this.groundArray[i].speed *= 1.2;
        }
        for(var j = 0; j < this.rockArray.length; j++){
            this.rockArray[j].speed *= 1.2;
        }
        for(var j = 0; j < this.coinArray.length; j++){
            this.coinArray[j].speed *= 1.2;
        }
    },

    initScoreLable : function(){
        var size = cc.director.getWinSize();
        this.scoreLabel = cc.LabelTTF.create('Score: 0', 'Consolas', 40);
        this.scoreLabel.setColor(0,0,0);
        this.scoreLabel.setPosition(130, size.height - 100);
        this.addChild(this.scoreLabel, gameZIndex.score);
    },

    updateScore : function(){
        this.collideCoin();
        var delta = parseInt(this.speed * 0.2);
        this.addScore(delta);

    },

    addScore : function(num){
        this.score += eval(num);
        this.scoreLabel.setString('Score: ' + this.score);
    }
})

var gameScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        this.addChild(new gameLayer);
    }
});