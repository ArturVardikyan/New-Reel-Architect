class TurboButton {
    constructor(stage,action) {
        this.container = new PIXI.Container();
        stage.addChild(this.container);
        this.ChangeMode = action;
        this.button = new PIXI.Graphics();

        this.button.beginFill(0x66CCFF);
        this.button.drawRoundedRect(0, 0,150, 50, 10);
        this.button.endFill();
        this.container.width = this.button.width;
        this.container.height = this.button.height;
        this.container.addChild(this.button)
        this.button.x = 100;
        this.button.y = 100;
        this.textStyle = {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center',
        },
        this.buttonText = new PIXI.Text("text", this.textStyle);
        this.buttonText.anchor.set(0.5);
        this.buttonText.x = this.button.width / 2;
        this.buttonText.y = this.button.height / 2;
        this.button.addChild(this.buttonText)
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.reactiveProperty = SceneReactiveProperty
        this.onButtonDown = this.onButtonDown.bind(this);
        this.onButtonOver = this.onButtonOver.bind(this);
        this.onButtonOut = this.onButtonOut.bind(this);
        this.onButtonUp = this.onButtonUp.bind(this);
        this.button.on('pointerdown', this.onButtonDown);
        this.button.on('pointerover', this.onButtonOver);
        this.button.on('pointerout', this.onButtonOut);
        this.button.on('pointerup',this.onButtonUp)
        this.container.addChild(this.button);
        SceneReactiveCommands.ChangeTurboMode
        .subscribe(_=>{

            if (this.reactiveProperty.TurboMode.value == 1){
                this.reactiveProperty.TurboMode.value = 2
            }
            else if (this.reactiveProperty.TurboMode.value == 2){
                this.reactiveProperty.TurboMode.value = 3
            }
            else if (this.reactiveProperty.TurboMode.value == 3){
                this.reactiveProperty.TurboMode.value = 1
            }
            console.log("Mode changed to - " + this.reactiveProperty.TurboMode.value)
        })
        this.reactiveProperty.TurboMode.asObservable().subscribe(value => {
            if (value == 1) {
                config.SetTimeScale1()
                this.buttonText.text = "normal"
            }
            else if (value == 2) {
                config.SetTimeScale2()
                this.buttonText.text = "fast"
            }
            else if (value == 3) {
                config.SetTimeScale2()
                this.buttonText.text = "turbo"
            }
        })
    }
    onButtonDown() {
        this.ChangeMode();
    }
    onButtonOver() {

    }
    onButtonOut() {

    }
    onButtonUp(){

    }
}