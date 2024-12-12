const app = new PIXI.Application();
const {Assets} = PIXI
const aplication = async ()=>{
    window.__PIXI_DEVTOOLS__ = {
        app: app,
        // If you are not using a pixi app, you can pass the renderer and stage directly
        // renderer: myRenderer,
        // stage: myStage,
    };

    app.stage.name = "Stage"
    await app.init({ width: 1900 , height: 1000 ,antialias: true,   });
    document.body.appendChild(app.canvas);

}
aplication()
const symbolData = new SymbolDataConfig();
const AssetsGame = new AssetsInGame(symbolData);
setTimeout(() => {
    //const reelcontainer = new ReelContainerView(app.stage,symbolData,matrixController,AssetsGame,inputController);
}, 2000);
const winSymbolsConfig = new WinSymbolsConfig()
const linesConfigData = new LinesConfigData();
const gameStateManager = new GameStateManager();
const matrixController = new MatrixController(symbolData,winSymbolsConfig,linesConfigData,gameStateManager);
const inputController = new InputController();
const connectionService = new ConnectionService(matrixController,gameStateManager);

setTimeout(() => {
    const ReelContainer1 = new ReelContainerViewNew(matrixController,connectionService, gameStateManager,AssetsGame,symbolData,app.stage);
    const ReelsControllerInstance = new ReelsController(ReelContainer1,inputController,matrixController,gameStateManager);

    //const reelcontainer = new ReelContainerView(app.stage,symbolData,matrixController,AssetsGame,inputController);
    }, 1000);



const spinButton = new SpinButton(app.stage,()=>{
    inputController.Spin.next()
    setTimeout(() => {
        if (!SceneReactiveProperty.ForceStop.value){
            SceneReactiveProperty.IsReelsRotate.value = false
        }

    }, 700);

});
const turboButton = new TurboButton(app.stage,()=>{
        SceneReactiveCommands.ChangeTurboMode.next()
});
document.addEventListener('keydown', function(event) {
    // Проверяем, какая клавиша была нажата
    if (event.key === 's') {
        console.log(SceneReactiveProperty.CanCallStop.value[0],SceneReactiveProperty.CanCallStop.value[1],SceneReactiveProperty.CanCallStop.value[2],SceneReactiveProperty.CanCallStop.value[3],SceneReactiveProperty.CanCallStop.value[4])
    }
});
spinButton.container.position.x = screen.width/2- spinButton.container.width;
spinButton.container.position.y = 850;
turboButton.container.position.x = screen.width/2- turboButton.container.width -200;
turboButton.container.position.y = 850;
function changePositionWithDelay() {
    // setTimeout(() => {
    //     for (reel of reelcontainer.reels) {
    //         reel.animation.kill()
    //     }
    //     console.log("position changed");
    // }, 2000);
    // for (let i = 0; i < config.reelsCount ; i++){
    //     gsap.getById("loop")?.kill();
    // }
    console.log("position changed");
}
function spin(){

    //let counter = 0;
    //console.log("spin");
    // for (let i = 0 ; i < reelcontainer.reels.length; i++){
    //     for (let k = 0; k < reelcontainer.reels[i].symbols.length; k++){
    //         console.log(reelcontainer.reels[i].symbols[k].container.position.x, reelcontainer.reels[i].symbols[k].container.position.y,counter);
    //         counter++;
    //     }
    // }
    // for (let reel of reelcontainer.reels) {
    //     console.log(reel.container.position.x, reel.container.position.y);
    // }
    // console.log(reelcontainer.container.position);
    // console.log(reelcontainer.reels.length);
    // console.log(reelcontainer.reels[0].symbols.length);console.log(reelcontainer.container.position);
    // console.log(reelcontainer.reels.length);
    // console.log(reelcontainer.reels[0].symbols.length);
}