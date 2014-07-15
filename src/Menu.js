var MenuLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
    },
    init:function(){
        this._super();

        var director = cc.Director.getInstance();
        var winsize = director.getWinSize();
        var startpos = cc.p(winsize.width / 5, winsize.height*3 / 4);
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        var spritebg = cc.Sprite.create(s_startBackground);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        cc.MenuItemFont.setFontSize(60);

        var menuItemPlay= cc.MenuItemSprite.create(
            cc.Sprite.create(s_startBotton), // normal state image
            cc.Sprite.create(s_startBotton0), //select state image
            this.onPlay, this);
        var menu = cc.Menu.create(menuItemPlay);  //7. create the menu
        menu.setPosition(startpos);
        this.addChild(menu);
    },

    onPlay : function(){
        cc.log("==onplay clicked");
        var director = cc.Director.getInstance();
        director.replaceScene(new gameScene());
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});