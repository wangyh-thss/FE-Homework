/**
 * Created by Wang Yihan on 2014/7/14.
 */

var gameZIndex = {bg: 0, ui: 1, score:2}

var gameLayer = cc.LayerColor.extend({
    spriteSheetPlayer:null,
    spriteSheetCoin:null,
    runningAction:null,
    animFramesCoin:null,
    groundArray : null,
    rockArray : null,
    coinArray : null,
    propertyArray : null,
    speed : null,
    player : null,
    score : null,
    scoreLabel : null,
    wudiLabel : null,

    ctor : function(){
        this._super();
        this.init();
    },

    init : function(){
        this.wudiLabel = false;

        //player
        this.initPlayer();

        //ground rock coin
        this.groundArray = [];
        this.rockArray = [];
        this.coinArray = [];
        this.propertyArray = [];
        this.speed = 5;
        this.groundArray[0] = new ground(1800, 50, this.speed);
        this.groundArray[0].setFirstGround();
        this.addChild(this.groundArray[0], gameZIndex.ui);
        this.schedule(this.updateGround, 0);
        this.initCoin();
        //event
        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);
        this.schedule(this.onTheGround, 0);
        this.schedule(this.collideProperty, 0);

        //judge dead
        this.schedule(this.gameOver, 0);

        //score
        this.score = 0;
        this.initScoreLable();
        this.schedule(this.updateScore, 0);

        //speed up
        this.schedule(this.speedUp, 4);
    },

    initPlayer : function(){
        this._super();
        // create sprite sheet
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_runnerplist);
        this.spriteSheetPlayer = cc.SpriteBatchNode.create(s_runner);
        this.addChild(this.spriteSheetPlayer, gameZIndex.ui);
        // init runningAction
        var animFrames = [];
        for (var i = 1; i < 9; i++) {
            var str = "p" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = cc.Animation.create(animFrames, 0.1);
        this.runningAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.player = new player(300, 300, 'p1.png');
        this.player.runAction(this.runningAction);
        this.spriteSheetPlayer.addChild(this.player);
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
        if(this.propertyArray[0] && this.propertyArray[0].posX + 20 <= 0){
            this.delProperty(0);
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
        var high, i;
        //确定与前面一块ground的高度差
        if(upOrDown >= 0 && delta <= 200){
            high = this.groundArray[num-1].posY + delta;
        }else{
            high = this.groundArray[num-1].posY - delta;
        }
        if(high >= size.height - 500){
            high = this.groundArray[num-1].posY - delta;
        }
        if(high < 200){
            if(delta > 200)
                high = this.groundArray[num-1].posY + delta;
            else
                high = this.groundArray[num-1].posY + delta - 200;
        }
        //根据长度确定是否加入障碍物
        if(len > 1300){
            for(i = 300; i <= 1200; i+=300){
                if(GetRandomNum(-10, 10) > 0)
                    this.addRock(i, high+60, 0);
                else
                    this.addRock(i, high+20, 1);
            }
        }
        //加入金币
        if(len < 1200){
            for(i = 300; i <= len-300; i+=100){
                if(GetRandomNum(-10, 10) > 0)
                    this.addCoin(i, high);
                else
                    this.addCoin(i, high);
            }
        }
        //加入物品
        if(GetRandomNum(1, 100) < 40){
            var pos = GetRandomNum(200, len)
            if(GetRandomNum(-10, 10) > 0)
                this.addProperty(pos, high+30, 'p_fly');
            else
                this.addProperty(pos, high+30, 'p_wudi');
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

    initCoin:function(){
        //create sprite sheet
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_coinplist);
        this.spriteSheetCoin = cc.SpriteBatchNode.create(s_coin);
        this.addChild(this.spriteSheetCoin, gameZIndex.ui);
        // init runningAction
        this.animFramesCoin = [];
        for (var i = 1; i < 9; i++) {
            var str = i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            this.animFramesCoin.push(frame);
        }
    },

    addCoin : function(x, y){
        var animation = cc.Animation.create(this.animFramesCoin, 0.1);
        var coinAction = cc.RepeatForever.create(cc.Animate.create(animation));
        var num = this.coinArray.length;
        this.coinArray[num] = new coin(x, y, this.speed, "1.png");
        //this.addChild(this.coinArray[num], gameZIndex.ui);
        this.coinArray[num].runAction(coinAction);
        this.spriteSheetCoin.addChild(this.coinArray[num]);
    },

    addProperty : function(x, y, style){
        var num = this.propertyArray.length;
        this.propertyArray[num] = new property(x, y, style, this.speed);
        this.addChild(this.propertyArray[num], gameZIndex.ui);
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
        this.spriteSheetCoin.removeChild(this.coinArray[eval(index)], true);
        this.coinArray.splice(eval(index), 1);
    },
    delProperty : function(index){
        this.removeChild(this.propertyArray[eval(index)], true);
        this.propertyArray.splice(eval(index), 1);
    },

    onMouseDown:function(event) {
        this.player.jump();
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
        if((this.collideRock() && this.wudiLabel == false) || this.fallDown()){
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
                    this.addScore(200);
                    this.delCoin(i);
                }
        }
    },

    collideProperty : function(){
        for(var i = 0; i < this.propertyArray.length; i++){
            if(this.player.posX < this.propertyArray[i].posX+this.propertyArray[i].width && this.player.posX > this.propertyArray[i].posX-this.propertyArray[i].width)
                if(this.player.posY < this.propertyArray[i].posY+this.propertyArray[i].height && this.player.posY > this.propertyArray[i].posY-this.propertyArray[i].height){
                    if(this.propertyArray[i].type == 'p_fly')
                        this.player.fly();
                    if(this.propertyArray[i].type == 'p_wudi')
                        this.wudi();
                    this.delProperty(i);
                }
        }
    },

    fallDown : function(){
        if(this.player.posY < 0){
            return true;
        }
        return false;
    },

    speedUp : function(times){
        var i = 0;
        if(times == 2)
            var n = 2;
        else
            var n = 1.1;
        this.speed = this.speed * n;
        for(i = 0; i < this.groundArray.length; i++){
            this.groundArray[i].speed *= n;
        }
        for(i = 0; i < this.rockArray.length; i++){
            this.rockArray[i].speed *= n;
        }
        for(i = 0; i < this.coinArray.length; i++){
            this.coinArray[i].speed *= n;
        }
        for(i = 0; i < this.propertyArray.length; i++){
            this.propertyArray[i].speed *= n;
        }
    },

    slowDown : function(times){
        var i = 0;
        var n = eval(times);
        this.speed = this.speed / n;
        for(i = 0; i < this.groundArray.length; i++){
            this.groundArray[i].speed /= n;
        }
        for(i = 0; i < this.rockArray.length; i++){
            this.rockArray[i].speed /= n;
        }
        for(i = 0; i < this.coinArray.length; i++){
            this.coinArray[i].speed /= n;
        }
        for(i = 0; i < this.propertyArray.length; i++){
            this.propertyArray[i].speed /= n;
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
    },

    wudi : function(){
        this.wudiLabel = true;
        this.speedUp(2);
        this.scheduleOnce(this.stopWudi, 3);
    },

    stopWudi : function(){
        console.log('stop');
        this.wudiLabel = false;
        this.slowDown(2);
    }
})

var gameScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        this.addChild(new BackgroundLayer);
        this.addChild(new gameLayer);
    }
});