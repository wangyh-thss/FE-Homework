//游戏结束层
var GameOverLayer = cc.LayerColor.extend({
    // constructor
    text_score : null,//当前分数
    text_highScore : null, //本地最高分
    score : null,
    ctor:function (num) {
        this._super();
        this.score = eval(num)+1;
        this.init();
    },
    init:function () {
        this._super(cc.c4b(0, 0, 0, 180));
        var winSize = cc.Director.getInstance().getWinSize();
        var centerPos = cc.p(winSize.width / 2, winSize.height/2 - 250);
        cc.MenuItemFont.setFontSize(30);
        var menuItemRestart = cc.MenuItemSprite.create(
            cc.Sprite.create(s_restartBotton),
            cc.Sprite.create(s_restartBotton0),
            this.onRestart, this);
        var menu = cc.Menu.create(menuItemRestart);
        menu.setPosition(centerPos);
        this.addChild(menu);
        this.text_score = new cc.LabelTTF.create('Your Score:'+this.score, 'Harrington', 140);
        this.text_score.setColor(new cc.Color3B(255,255,255));
        this.text_score.setPosition(winSize.width / 2, winSize.height/2 + 350);
        console.log(typeof this.text);
        console.log('Your Score:'+this.score)
        this.addChild(this.text_score);
        if(localStorage['highScore'] && localStorage['highScore'] > this.score){
            this.text_highScore = new cc.LabelTTF.create('High Score:'+localStorage['highScore'], 'Comic Sans MS', 70);
            this.text_highScore.setColor(new cc.Color3B(255,255,255));
            this.text_highScore.setPosition(winSize.width / 2, winSize.height/2 + 150);
            cc.AudioEngine.getInstance().playEffect(m_gameoverFail);
        }else{
            localStorage['highScore'] = this.score;
            this.text_highScore = new cc.LabelTTF.create('New High Score!!', 'Comic Sans MS', 70);
            this.text_highScore.setColor(new cc.Color3B(255,255,255));
            this.text_highScore.setPosition(winSize.width / 2, winSize.height/2 + 150);
            cc.AudioEngine.getInstance().playEffect(m_highScore);
        }
        this.addChild(this.text_highScore);
    },
    //重新开始按钮事件响应
    onRestart:function (sender) {
        cc.Director.getInstance().resume();
        //重新建一个游戏场景
        cc.Director.getInstance().replaceScene(new gameScene());
    }
});