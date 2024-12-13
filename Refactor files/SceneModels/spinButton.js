class SpinButton {
    constructor(stage,action) {
        this.spin = action;
        this.InitContainer(stage)
    }
    InitContainer(stage){
        this.container = new PIXI.Container();
        stage.addChild(this.container);
        this.button = new PIXI.Graphics();
        this.button.beginFill(0x66CCFF);
        this.button.drawRoundedRect(0, 0,150, 50, 10);
        this.button.endFill();
        this.container.width = this.button.width;
        this.container.height = this.button.height;
        this.container.addChild(this.button)
        this.button.x = 100;
        this.button.y = 100;
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.container.addChild(this.button);
        this.InitButtonActions()
    }
    InitButtonActions(){
        this.onButtonDown = this.onButtonDown.bind(this);
        this.onButtonOver = this.onButtonOver.bind(this);
        this.onButtonOut = this.onButtonOut.bind(this);
        this.onButtonUp = this.onButtonUp.bind(this);
        this.button.on('pointerdown', this.onButtonDown);
        this.button.on('pointerover', this.onButtonOver);
        this.button.on('pointerout', this.onButtonOut);
        this.button.on('pointerup',this.onButtonUp)
    }
    onButtonDown() {
        this.spin();
    }
    onButtonOver() {

    }
    onButtonOut() {

    }
    onButtonUp(){

    }

}