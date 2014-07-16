var BackgroundLayer = cc.Layer.extend({
    background1:null,
    background2:null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._super();
        this.background1 = cc.Sprite.create(s_background1);
        this.background2 = cc.Sprite.create(s_background2);
        var winSize = cc.Director.getInstance().getWinSize();
        var centerPos = cc.p(winSize.width/2, winSize.height/2);
        this.background1.setPosition(centerPos);
        this. background2.setPosition(cc.p(winSize.width*(3/2), winSize.height/2));
        this.addChild(this.background1);
        this.addChild(this.background2);

        this.scheduleUpdate();
    },
    update:function(){
        this.background1.setPositionX(this.background1.getPositionX() - 1);
        this.background2.setPositionX(this.background2.getPositionX() - 1);
        var box = this.background1.getBoundingBox();
        var box0 = this.background2.getBoundingBox();
        if(box.x+box.width <= 0){
            this.background1.setPositionX(box0.x+box0.width*3/2);
        };
        if(box0.x+box0.width <= 0){
            this.background2.setPositionX(box.x+box.width*3/2);
        };
    }
});