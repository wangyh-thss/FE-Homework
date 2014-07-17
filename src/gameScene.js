/**
 * Created by Wang Yihan on 2014/7/14.
 */

var gameZIndex = {bg: 0, ui: 1, score:2}

var gameLayer = cc.LayerColor.extend({
    spriteSheetPlayer:null,
    spriteSheetCoin:null,
    runningAction:null,
    jumpUpAction:null,
    jumpDownAction:null,
    flyAction:null,
    rollAction:null,
    wudiAction:null,
    animFramesCoin:null,
    groundArray : null,
    rockArray : null,
    coinArray : null,
    numLabelArray : null,
    propertyArray : null,
    speed : null,
    player : null,
    score : null,
    scoreLabel : null,
    highScoreLabel : null,
    wudiLabel : null,

    ctor : function(){
        this._super();
        this.init();
    },
    //初始化
    init : function(){
        this.wudiLabel = false;
        cc.AudioEngine.getInstance().playEffect(m_bgm, true);

        //人物
        this.initPlayer();
        //地面  障碍物  金币  物品
        this.groundArray = [];
        this.rockArray = [];
        this.coinArray = [];
        this.propertyArray = [];
        this.numLabelArray = [];
        this.speed = 8;
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
        //随时检测游戏结束条件
        this.schedule(this.gameOver, 0);

        //初始化、更新分数
        this.score = 0;
        this.initScoreLable();
        this.schedule(this.updateScore, 0);

        //定期加速
        this.schedule(this.speedUp, 2.5);
        //每帧检测
        this.scheduleUpdate();
    },

    onExit:function() {
        this.runningAction.release();
        this.jumpUpAction.release();
        this.jumpDownAction.release();
        this.rollAction.release();
        this.flyAction.release();
        this.wudiAction.release();

        this._super();
    },

    //每帧检测，判断玩家当前动作状态并为相应动作添加动画效果
    update : function(){
        if(this.player.playerState == 'run'||this.player.playerState == 'wudi')
        {
            if(this.player.velocity > 0)
            {
                this.player.stopAllActions();
                this.player.runAction(this.jumpUpAction);
                this.player.playerState = 'jumpUp1';
            }
        }
        else if(this.player.playerState == 'jumpUp1')
        {
            if(this.player.falling == true) {
                this.player.stopAllActions();
                this.player.runAction(this.jumpDownAction);
                this.player.playerState = 'jumpDown';
            }
            else if(this.player.two_jump == true)
            {
                this.player.stopAllActions();
                this.player.runAction(this.rollAction);
                this.player.playerState = 'jumpUp2';
            }
        }
        else if(this.player.playerState == 'jumpDown')
        {
            if(this.player.on_ground == true)
            {
                this.player.stopAllActions();
                this.player.runAction(this.runningAction);
                this.player.playerState = 'run';
            }
            else if(this.player.two_jump == true)
            {
                this.player.stopAllActions();
                this.player.runAction(this.rollAction);
                this.player.playerState = 'jumpUp2';
            }
        }
        else if(this.player.playerState == 'jumpUp2')
        {
            if(this.player.falling == true)
            {
                this.player.stopAllActions();
                this.player.runAction(this.runningAction);
                this.player.playerState = 'jumpDown';
            }
        }
        //flyAction
        if(this.player.flyLable == true && this.player.playerState != 'fly')
        {
            this.player.stopAllActions();
            this.player.runAction(this.flyAction);
            this.player.playerState = 'fly';
        }
        if(this.player.flyLable == false && this.player.playerState == 'fly')
        {
            this.player.stopAllActions();
            this.player.runAction(this.jumpDownAction);
            this.player.playerState = 'jumpDown';
        }
        //wudiAction
        if(this.wudiLabel == true && this.player.playerState != 'wudi')
        {
            this.player.stopAllActions();
            this.player.runAction(this.wudiAction);
            this.player.playerState = 'wudi';
            cc.log('xx');
        }
        if(this.wudiLabel == false && this.player.playerState == 'wudi')
        {
            this.player.stopAllActions();
            this.player.runAction(this.runningAction);
            this.player.playerState = 'run';
        }
    },

    initPlayer : function(){
        this._super();
        // 创建精灵表单
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_runnerplist);
        this.spriteSheetPlayer = cc.SpriteBatchNode.create(s_runner);
        this.addChild(this.spriteSheetPlayer, gameZIndex.ui);
        //初始化奔跑动作
        var animFrames = [];
        for (var i = 1; i < 9; i++) {
            var str = "p" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = cc.Animation.create(animFrames, 0.1);
        this.runningAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.runningAction.retain();

        //初始化跳跃动作
        animFrames = [];
        var str = "jumpup.png";
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
        animFrames.push(frame);
        animation = cc.Animation.create(animFrames, 0.5);
        this.jumpUpAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.jumpUpAction.retain();

        animFrames = [];
        str = "jumpdown.png";
        frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
        animFrames.push(frame);
        animation = cc.Animation.create(animFrames, 0.5);
        this.jumpDownAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.jumpDownAction.retain();

        //初始化翻滚动作
        animFrames = [];
        for (var i = 1; i < 16; i++) {
            var str = "roll" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
        animation = cc.Animation.create(animFrames, 0.01);
        this.rollAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.rollAction.retain();

        //初始化飞行动作
        animFrames = [];
        for (var i = 1; i < 5; i++) {
            var str = "playerFly" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
        animation = cc.Animation.create(animFrames, 0.2);
        this.flyAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.flyAction.retain();

        //初始化无敌动作
        animFrames = [];
        for (var i = 1; i < 9; i++) {
            var str = "wudi" + i + ".png";
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }
        animation = cc.Animation.create(animFrames, 0.05);
        this.wudiAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.wudiAction.retain();


        this.player = new player(300, 300, 'p1.png');
        this.player.runAction(this.runningAction);
        this.spriteSheetPlayer.addChild(this.player);
    },

    updateGround : function(){
        //当元素移出画面将其删除
        if(this.groundArray.length <= 0){
            this.addGround();
            return;
        }
        if(this.groundArray[0].posX + this.groundArray[0].len/2 <= 0){
            this.delGround();
        }
        if(this.rockArray[0] && this.rockArray[0].posX + 20 <= 0){
            this.delRock(0);
        }
        if(this.coinArray[0] && this.coinArray[0].posX + 20 <= 0){
            this.delCoin(0);
        }
        if(this.propertyArray[0] && this.propertyArray[0].posX + 20 <= 0){
            this.delProperty(0);
        }
        if(this.numLabelArray[0] && this.numLabelArray[0].posY > 1400){
            this.delNumLabel();
        }
        var num = this.groundArray.length;
        var gap = GetRandomNum(60, 100);
        var screenWidth = cc.Director.getInstance().getWinSize().width;
        if(screenWidth - (this.groundArray[num-1].posX + this.groundArray[num-1].len/2) >= gap){
            this.addGround();
        }
        function GetRandomNum(Min, Max){
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }
    },

    addGround : function(){
        var size = cc.Director.getInstance().getWinSize();
        var num = this.groundArray.length;
        var len = GetRandomNum(300, 2300);
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
            if(delta > 300)
                delta -= 200;
            high = this.groundArray[num-1].posY - delta;
        }
        if(high < 200){
            if(delta > 300)
                delta -= 200;
            high = this.groundArray[num-1].posY + delta;

        }
        //根据长度确定是否加入障碍物
        if(len > 1300){
            for(i = 500; i <= len-500; i+=600){
                if(GetRandomNum(-10, 10) > 0)
                    this.addRock(i, high+60, 0);
                else
                    this.addRock(i, high+20, 1);
            }
        }
        //加入金币
        if(len < 1200){
            for(i = 300; i <= len-300; i+=100){
                    this.addCoin(i, high + 70);
            }
        }
        //加入物品
        if(GetRandomNum(1, 100) <= 20){
            var pos = GetRandomNum(200, len);
            var typeChoice = GetRandomNum(0, 13)
            if(typeChoice < 5)
                this.addProperty(pos, high+30, 'p_fly');
            else if(typeChoice > 8)
                this.addProperty(pos, high+30, 'p_wudi');
            else
                this.addProperty(pos, high+30, 'p_book');
        }
        //添加到层
        this.groundArray[num] = new ground(len, high, this.speed);
        this.addChild(this.groundArray[num], gameZIndex.ui);
        //随机函数
        function GetRandomNum(Min, Max){
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }
    },
    //指定位置添加障碍物
    addRock : function(x, y, style){
        var num = this.rockArray.length;
        this.rockArray[num] = new rock(x, y, style, this.speed);
        this.addChild(this.rockArray[num], gameZIndex.ui);
    },
    //初始化金币动画
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
    //指定位置添加金币
    addCoin : function(x, y){
        var animation = cc.Animation.create(this.animFramesCoin, 0.1);
        var coinAction = cc.RepeatForever.create(cc.Animate.create(animation));
        var num = this.coinArray.length;
        this.coinArray[num] = new coin(x, y, this.speed, "1.png");
        //this.addChild(this.coinArray[num], gameZIndex.ui);
        this.coinArray[num].runAction(coinAction);
        this.spriteSheetCoin.addChild(this.coinArray[num]);
    },
    //指定位置添加指定物品
    addProperty : function(x, y, style){
        var num = this.propertyArray.length;
        this.propertyArray[num] = new property(x, y, style, this.speed);
        this.addChild(this.propertyArray[num], gameZIndex.ui);
    },
    //删除无效的地面、障碍物、金币、物品
    delGround : function(){
        var toDelete = this.groundArray.shift();
        this.removeChild(toDelete, true);
    },
    delRock : function(index){
        this.removeChild(this.rockArray[eval(index)], true);
        this.rockArray.splice(eval(index), 1);
    },
    delCoin : function(index){
        this.spriteSheetCoin.removeChild(this.coinArray[eval(index)], true);
        this.coinArray.splice(eval(index), 1);
    },
    delProperty : function(index){
        this.removeChild(this.propertyArray[eval(index)], true);
        this.propertyArray.splice(eval(index), 1);
    },
    delNumLabel : function(){
        var toDelete = this.numLabelArray.shift();
        this.removeChild(toDelete, true);
    },
    //鼠标点击事件
    onMouseDown:function(event) {
        this.player.jump();
    },
    //判断是否在地面上
    onTheGround : function(){
        var x = this.player.posX;
        var y = this.player.posY;
        for(var i = 0; i < this.groundArray.length; i++){
            if(y <= this.groundArray[i].posY + 160 && y >= this.groundArray[i].posY + 90){
                if(x + 30 > this.groundArray[i].posX - this.groundArray[i].len/2 && x - 10 < this.groundArray[i].posX + this.groundArray[i].len/2)
                    if(this.player.on_ground == true)
                        return;
                    else{
                        if(this.player.falling){
                            this.player.on_ground = true;
                            this.player.alterPosition(this.groundArray[i].posY);
                            cc.AudioEngine.getInstance().playEffect(m_fallDown);
                            return;
                        }
                    }
            }
        }
        this.player.on_ground = false;
    },
    //掉下gameover
    fallDown : function(){
        if(this.player.posY < -100){
            cc.AudioEngine.getInstance().stopAllEffects();
            cc.AudioEngine.getInstance().playEffect(m_gameoverFall);
            return true;
        }
        return false;
    },
    //判断游戏结束条件
    gameOver : function(){
        if(this.collideRock() || this.fallDown()){
            //dead
            cc.Director.getInstance().pause();
            this.getParent().addChild(new GameOverLayer(this.score));
        }
    },
    //判断是否与障碍物碰撞
    collideRock : function(){
        for(var i = 0; i < this.rockArray.length; i++){
            if(this.player.posX-40 < this.rockArray[i].posX+this.rockArray[i].width && this.player.posX+40 > this.rockArray[i].posX-this.rockArray[i].width)
                if(this.player.posY-50 < this.rockArray[i].posY+this.rockArray[i].height && this.player.posY+50 > this.rockArray[i].posY-this.rockArray[i].height)
                    if(this.wudiLabel == false){
                        cc.AudioEngine.getInstance().stopAllEffects();
                        cc.AudioEngine.getInstance().playEffect(m_gameoverCatch);
                        return true;
                    }else{
                        this.delRock(i);
                        cc.AudioEngine.getInstance().playEffect(m_rock);
                    }

        }
        return false;
    },
    //判断是否吃到金币，并触发事件
    collideCoin : function(){
        for(var i = 0; i < this.coinArray.length; i++){
            if(this.player.posX-50 < this.coinArray[i].posX+this.coinArray[i].width && this.player.posX+50 > this.coinArray[i].posX-this.coinArray[i].width)
                if(this.player.posY-80 < this.coinArray[i].posY+this.coinArray[i].height && this.player.posY+80 > this.coinArray[i].posY-this.coinArray[i].height){
                    this.addScore(200);
                    this.numLabelArray[this.numLabelArray.length] = new getScoreLabel(this.player.posX, this.player.posY);
                    this.addChild(this.numLabelArray[this.numLabelArray.length-1], gameZIndex.ui);
                    cc.AudioEngine.getInstance().playEffect(m_coin);
                    this.delCoin(i);
                }
        }
    },
    //判断是否吃到物品，并触发事件
    collideProperty : function(){
        for(var i = 0; i < this.propertyArray.length; i++){
            if(this.player.posX-50 < this.propertyArray[i].posX+this.propertyArray[i].width && this.player.posX+50 > this.propertyArray[i].posX-this.propertyArray[i].width)
                if(this.player.posY-80 < this.propertyArray[i].posY+this.propertyArray[i].height && this.player.posY+80 > this.propertyArray[i].posY-this.propertyArray[i].height){
                    if(this.propertyArray[i].type == 'p_fly')
                        this.player.fly();
                    if(this.propertyArray[i].type == 'p_wudi')
                        if(this.wudiLabel == false)
                            this.wudi();
                    if(this.propertyArray[i].type == 'p_book'){
                        this.eatBook();
                    }
                    this.delProperty(i);
                }
        }
    },
    //吃到升级书，如果没有三段跳技能，则获得该技能，否则加1000分
    eatBook : function(){
        if(this.player.three_ability == false){
            this.numLabelArray[this.numLabelArray.length] = new getScoreLabel(this.player.posX, this.player.posY);
            this.numLabelArray[this.numLabelArray.length-1].setString('获得技能：三段跳！！');
            this.addChild(this.numLabelArray[this.numLabelArray.length-1], gameZIndex.ui);
            this.player.three_ability = true;
        }else{
            this.numLabelArray[this.numLabelArray.length] = new getScoreLabel(this.player.posX, this.player.posY);
            this.numLabelArray[this.numLabelArray.length-1].setString('+1000');
            this.addChild(this.numLabelArray[this.numLabelArray.length-1], gameZIndex.ui);
            this.addScore(1000);
        }
        cc.AudioEngine.getInstance().playEffect(m_book);
    },
    //整体提速
    speedUp : function(times){
        var i = 0;
        if(times == 3)
            var n = 3;
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
    //降速
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
    //初始化分数显示
    initScoreLable : function(){
        var size = cc.director.getWinSize();
        this.scoreLabel = cc.LabelTTF.create('Score: 0', 'Consolas', 40);
        this.scoreLabel.setColor(new cc.Color3B(255,255,255));
        this.scoreLabel.setPosition(size.width-200, size.height - 100);
        this.addChild(this.scoreLabel, gameZIndex.score);
        if(localStorage['highScore']){
            this.highScoreLabel = cc.LabelTTF.create('High Score:'+localStorage['highScore'], 'Consolas', 40);
            this.highScoreLabel.setColor(new cc.Color3B(255,255,255));
            this.highScoreLabel.setPosition(size.width-200, size.height - 160);
            this.addChild(this.highScoreLabel, gameZIndex.score);
        }
    },
    //更新分数，与当前速度以及金币数挂钩
    updateScore : function(){
        this.collideCoin();
        var delta = parseInt(this.speed * 0.2);
        this.addScore(delta);

    },
    //增加分数
    addScore : function(num){
        this.score += eval(num);
        this.scoreLabel.setString('Score: ' + this.score);
    },
    //无敌：加速并不死
    wudi : function(){
        this.wudiLabel = true;
        this.speedUp(3);
        this.scheduleOnce(this.stopWudi, 3);
        cc.AudioEngine.getInstance().playEffect(m_speedup);
    },
    stopWudi : function(){
        this.wudiLabel = false;
        this.slowDown(3);
    }
})

var gameScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        cc.log(cc.Director.getInstance().isSendCleanupToScene());
        this.addChild(new BackgroundLayer);
        this.addChild(new gameLayer);
    }
});