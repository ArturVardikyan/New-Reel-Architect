const SceneReactiveCommands = {
     Rotate: new rxjs.Subject(),//executes with function argument
     Skip: new rxjs.Subject(),
     CloseCongratulation: new rxjs.Subject(),
     ShowWin: new rxjs.Subject(),
     StartAutoSpin : new rxjs.Subject(),//executes with count of AutoSpin
     WinDone:  new rxjs.Subject(),//executes with boolean argument
     OnActionChange : new rxjs.Subject(),//executes with boolean argument
     Reconnect : new rxjs.Subject(),//executes with function argument
     OpenBonusAfterBigWin : new rxjs.Subject(),
     OpenFreeBetAfterBigWin : new rxjs.Subject(),
     ConnectToTranslate : new rxjs.Subject(),//executes with function argument
     ChangeTurboMode: new rxjs.Subject()

}
function ClearAllBuses(){
    SceneReactiveCommands.Rotate = null;
    SceneReactiveCommands.Skip = null;
    SceneReactiveCommands.CloseCongratulation = null;
    SceneReactiveCommands.ShowWin = null;
    SceneReactiveCommands.WinDone = null;
    SceneReactiveCommands.StartAutoSpin = null;
    SceneReactiveCommands.OnActionChange = null;
    SceneReactiveCommands. OpenBonusAfterBigWin = null;
    SceneReactiveCommands.OpenFreeBetAfterBigWin = null;
    SceneReactiveCommands.ConnectToTranslate = null;
}