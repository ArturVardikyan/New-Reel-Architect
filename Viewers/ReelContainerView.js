// const { Assets, Sprite, Graphics } = PIXI;
// class ReelContainerView {
//     constructor(ParentContainer,symbolData,matrixController,AssetsInGame,inputController) {
//         this.container = new PIXI.Container();
//         this.container.sortableChildren = true;
//         this.image = new PIXI.Sprite();
//         this.maskGraphics = undefined;
//         this.ReelsContainer = new PIXI.Container();
//         this.container.addChild(this.ReelsContainer);
//         this.frameTexture = undefined;
//         ParentContainer.addChild(this.container);
//         this.reels = [];
//         this.additionalReel = undefined;
//         this.reactiveProperty = SceneReactiveProperty;
//         this.matrixController = matrixController;
//         this.uiReactive = undefined;
//         this.slowMode = false;
//         this.initBonusScene = false;
//         this.exitBonusScene = false;
//         this.previewFakeRotateState = false;
//         this.cancellationTokenSource = undefined;
//         this.AssetsInGame = AssetsInGame;
//         this.init()
//         this.container.zIndex = 1
//         this.container.name = "GlobalREELSCONTAINER"
//         this.ReelsContainer.name = "ReelContainerView"
//         this.container.sortableChildren = true;
//         this.ReelsContainer.sortableChildren = true;
//         this.ReelsContainer.zIndex = 1
//         this.SymbolDataConfig = symbolData
//         this._sceneReactiveCommands = SceneReactiveCommands
//         this._inputController = inputController
//     }
//     Init(){
//
//         this.InitReels()
//         this.InitProperties()
//     }
//     InitProperties() {
//         this._sceneReactiveCommands.ChangeTurboMode.subscribe(_=>{
//             if(this.reactiveProperty.TurboMode.value === 1){
//                 this.reactiveProperty.TurboMode.value = 2;
//             }
//             else if(this.reactiveProperty.TurboMode.value === 2){
//                 this.reactiveProperty.TurboMode.value = 3;
//             }
//             else if(this.reactiveProperty.TurboMode.value === 3){
//                 this.reactiveProperty.TurboMode.value = 1;
//             }
//         })
//         this.reactiveProperty.SpinningAudioPunch.asObservable().pipe(
//             rxjs.operators.skip(1)
//         ).subscribe(_ => {
//             if (this.spiningAudio != null) {
//                 this.spiningAudio.pitch = _;
//             }
//         });
//         this.reactiveProperty.ForceStop.asObservable().pipe(
//             rxjs.operators.skip(1)
//         ).subscribe(_ => {
//             if (!_) return;
//             this.reactiveProperty.SpinningAudioPunch.Value = 1;
//             if (this.slowMode) {
//                 //Time.timeScale = _reactiveProperty.ForceSpeedValue.Value * 2;
//                 if (this.reactiveProperty.TurboMode.value == 2)
//                 {
//                     config.SetTimeScale2();
//                 }
//                 else if (this.reactiveProperty.TurboMode.value == 0)
//                 {
//                     config.SetTimeScale1();
//                 }
//             }
//             else {
//                 if (!this.reactiveProperty.TurboMode.value == 3)
//                 {
//                     //Time.timeScale = 1;
//                     config.SetTimeScale1();
//                 }
//
//             }
//         });
//         this.reactiveProperty.ForceStop.asObservable().pipe(
//             rxjs.operators.skip(1)
//         ).subscribe(stop => {
//             if (stop) {
//                 this.Skip();
//             }
//         });
//
//         this.reactiveProperty.SkipWinAnimation.asObservable().pipe(
//             rxjs.operators.skip(1)
//         ).subscribe(_ => {
//             if (_) {
//                 this.Skip();
//             }
//         });
//         this.reactiveProperty.IsReelsRotate.asObservable().pipe(
//             rxjs.operators.skip(1)
//         ).subscribe(rotate => {
//             if (rotate) {
//                 this.reactiveProperty.ForceStop.value = false
//                 this.Rotate()
//             }
//             else {
//                 //console.log("called stop");
//                 this.Stop();
//             }
//         });
//         this._inputController.Spin.subscribe(_=>{
//             this.reactiveProperty.ForceStop.value = true;
//             this.SpinAction();
//
//         })
//         this._sceneReactiveCommands.Rotate.subscribe(_=>{
//             this.RotateReelsInit()
//         })
//     }
//     SpinAction() {
//         //GameStateManager.Instance.EndSessionTimeDetection();
//         //GameStateManager.Instance.StartSessionTimeDetection();
//         // if (this.reactiveProperty.ValidationAction.value /*is ValidationAction.Break or ValidationAction.Show*/) {
//         //     return;
//         // }
//         if (this.reactiveProperty.SpinLocked.value) {
//             return;
//
//         }
//
//         // if (this.reactiveProperty.HasSkipJackpot.value) {
//         //     this.reactiveProperty.SkipJackpotAction.OnNext(Unit.Default);
//         //     return;
//         // }
//
//         // if (this.reactiveProperty.Bonus.value != BonusType.Bonus &&
//         //     _reactiveProperty.CurrentState.Value == CurrentState.Show) {
//         //     // _reactiveProperty.SkipWinAnimation.Value = true;
//         //     _reactiveProperty.ForceStop.Value = true;
//         // }
//
//
//         // if (this.reactiveProperty.HasCongratulationState.Value) {
//         //     _disposableAutoplayCounter?.Dispose();
//         //     EventBus.CloseCongratulation?.Invoke();
//         //     return;
//         // }
//
//         // if (this.reactiveProperty.SkipPause.Value) {
//         //     _disposableAutoplayCounter?.Dispose();
//         //     EventBus.Skip?.Invoke();
//         //     return;
//         // }
//
//
//         if (this.reactiveProperty.IsReelsRotate.value) {
//             this.StopReelsInit();
//             //console.log("STOP")
//         }
//         else {
//              if (true/*this.reactiveProperty.CurrentState.value == CurrentState.None*/) {
//                 if (/*!this.reactiveProperty.JaguarMode.value*/true)
//                     this.reactiveProperty.ForceStop.value = false;
//                  this.reactiveProperty.Rotate.next()
//                  //console.log("ROTATE")
//              }
//         }
//     }
//     StopReelsInit(){
//         if (!this.reactiveProperty.IsReelsRotate.value) {
//             //console.log("false");
//             return;
//         }
//         //console.log("TRUE");
//         //_disposableStop?.Dispose();
//         // if (!_reactiveProperty.IsReelsRotate.Value || !_reactiveProperty.WinReadyToShow.Value) {
//         //     return;
//         // }
//
//         this.reactiveProperty.IsReelsRotate.value = false;
//     }
//     Skip() {
//         // if (this.cancellationTokenSource != null) {
//         //     this.cancellationTokenSource.abort();
//         //     //this.cancellationTokenSource.dispose();
//         // }
//         //
//         // this.cancellationToken = true;
//     }
//     RotateReelsInit() {
//         // if (_reactiveProperty.AutoSpin.Value && _reactiveProperty.CountOfAutoSpin.Value != 0) {
//         //     _reactiveProperty.CountOfAutoSpin.Value--;
//         // }
//
//         //_disposableStop?.Dispose();
//         //_reactiveProperty.CurrentState.Value = CurrentState.Wait;
//
//         this.reactiveProperty.IsReelsRotate.value = true;
//     }
//     Rotate() {
//         this.cancellationToken = false;
//         this.reactiveProperty.SkipWinAnimation.value = false;
//         this.initBonusScene = false;
//         this.exitBonusScene = false;
//
//         //this.uiReactive.GuaranteedWinPreviewState.value = this.uiReactive.GuaranteedWin.value;
//
//
//
//         this.loop = []
//         this.StartRotate();
//     }
//     async StartRotate() {
//         // Dispose of the existing cancellation token source if it exists
//         if (this.cancellationTokenSource) {
//             this.cancellationTokenSource.abort();
//             //console.log("mtav abort")
//         }
//         this.reactiveProperty.SpinLocked.value = true;
//         this.cancellationTokenSource = new AbortController();
//
//
//         //SoundManager.playSpinSound();
//         const {signal} = this.cancellationTokenSource;
//         for (let reel of this.reels) {
//             reel.RotateReel();
//             //console.log("hii")
//             if (this.reactiveProperty.TurboMode.value !== 3) {
//                 if (config.introSecondsBetweenReels > 0) {
//                     await this.delay(config.introSecondsBetweenReels * 1000, signal);
//                 }
//             }
//             if (reel.index == 4){
//                 this.reactiveProperty.SpinLocked.value = false;
//             }
//         }
//
//        // EventBus.openBonusAfterBigWin = null;
//         setTimeout(() => {
//                 this.reactiveProperty.IsReelsRotate.value = false;
//                 console.log("position changed");
//             }, 2000);
//         // Rotate the additional reel if it exists
//         if (this.additionalReel != null) {
//             this.additionalReel.RotateReel();
//         }
//
//         this.reactiveProperty.WinReadyToShow.value = false;
//
//        // this.SetReelGradientState(true);
//         //
//         //
//         //this.connection.sendSpin();
//     }
//     WinDone(hasWin) {
//         this.reactiveProperty.WinReadyToShow.Value = true;
//     }
//     Stop() {
//         //this.matrixController.CheckWin();
//         // if (this.reactiveProperty.Bonus.value != BonusType.None && GameStateManager.Instance.State == GameState.Normal) {
//         //     if (_reactiveProperty.Bonus.Value == BonusType.FreeSpin) {
//         //         this.initBonusScene = true;
//         //     }
//         // }
//         //
//         // if (GameStateManager.Instance.State == GameState.FreeSpins && _reactiveProperty.Bonus.Value == BonusType.None) {
//         //     this.exitBonusScene = true;
//         // }
//         //console.log("stopcalles")
//         this.StopReels();
//     }
//     async StopReels() {
//         //_disposable?.Dispose();
//         if (this.reactiveProperty.TurboMode.value === 3)
//         {
//             //Time.timeScale = 1;
//             config.SetTimeScale1();
//         }
//
//         this.reactiveProperty.CurrentState.value = "CurrentState.Wait";
//         this.reactiveProperty.SkipWinAnimation.value = false;
//         //SetReelGradientState(false);
//         let slowReelsStartIndex = this.matrixController.GetFirstLowStopReelIndex();
//         let slowReelsEndIndex = this.matrixController.GetLastLowStopReelIndex();
//         this.slowMode = false;
//         for (let i = 0 ; i < this.reels.length;i++){
//             this.reels[i].blockRandomSymbol = true;
//             this.reels[i].SetSymbols();
//         }
//
//         if (this.additionalReel != null) {
//             this.additionalReel.BlockRandomSymbol = true;
//             this.additionalReel.SetSymbols();
//         }
//
//         for (let i = 0; i < this.reels.length; i++) {
//             this.reels[i].Stop(this.reactiveProperty.ForceStop.value, this.slowMode);
//             if (this.reactiveProperty.ForceStop.value) {
//                 this.reactiveProperty.SpinningAudioPunch.value = 1;
//                 this.reactiveProperty.SkipWinAnimation.value = false;
//                 if (this.reactiveProperty.TurboMode.value !== 3)
//                 {
//                     //Time.timeScale = 1f;
//                     config.SetTimeScale1();
//                 }
//
//                 this.slowMode = false;
//                 this.cancellationToken = true;
//                 for (let k = 0; k < this.reels.length; k++) {
//                     if (!this.reels[k].reelStoped) {
//                         this.reels[k].Stop(true, false);
//                     }
//                 }
//
//                 break;
//             }
//             await new Promise((resolve) => setTimeout(resolve, config.stopSecondsBetweenReels*1000));
//             if ((i < slowReelsEndIndex && slowReelsEndIndex > 0) || slowReelsEndIndex < 0) {
//                 if (
//                     i >= slowReelsStartIndex &&
//                     slowReelsStartIndex > 0 &&
//                     !this.reactiveProperty.ForceStop.value
//                 ) {
//                     for (let j = 0; j < 6; j++) {
//                         try {
//                             if (!this.cancellationToken && !this.cancellationTokenSource.isCancellationRequested) {
//                                 await this.delay(
//                                     (config.stopDuration / 3) * 1000,
//                                     this.cancellationTokenSource
//                                 );
//                             }
//                         } catch (e) {
//                             // Handle cancellation error if needed
//                         }
//
//                         if (this.reactiveProperty.ForceStop.value) {
//                             this.slowMode = false;
//                             this.reactiveProperty.SpinningAudioPunch.value = 1;
//                             this.reactiveProperty.SkipWinAnimation.value = false;
//
//                             if (!this.reactiveProperty.TurboMode.value) {
//                                 // Time.timeScale = 1;
//                                config.SetTimeScale1();
//                             }
//
//                             break;
//                         }
//                     }
//
//                     if (!this.reactiveProperty.ForceStop.value) {
//                         this.slowMode = true;
//                         this.reactiveProperty.SpinningAudioPunch.value = 0.5;
//                         // Time.timeScale = 0.5;
//                         config.SetTimeScale0_5();
//                         this.reactiveProperty.SkipWinAnimation.value = false;
//
//                         for (let reel of this.reels) {
//                             reel.SetNonBlurSymbols();
//                         }
//
//                         // if (this.uiReactive.reelEffect) {
//                         //     this.uiReactive.reelEffect.execute(i);
//                         // }
//
//                         if (i != (this.reels.length - 1)) {
//                             try {
//                                 if (!this.cancellationToken) {
//                                     await this.delay(
//                                         config.specialSymbolReelDelay * 1000,
//                                         this.cancellationTokenSource
//                                     );
//                                 }
//                             } catch (e) {
//                                 // Handle cancellation error if needed
//                             }
//                         }
//                     }
//                 }
//             }
//
//
//             if (
//                 !this.reactiveProperty.ForceStop.value &&
//                 this.reactiveProperty.TurboMode.value !== 3
//             ) {
//                 try {
//                     if (!this.cancellationToken) {
//                         let delayTime = this.reactiveProperty.TurboMode.value === 3
//                             ? config.stopSecondsBetweenReels / 4
//                             : config.stopSecondsBetweenReels;
//                         await this.delay(delayTime * 1000, this.cancellationTokenSource);
//                     }
//                 } catch (e) {
//                     // Handle cancellation error if needed
//                 }
//             }
//         }
//
//         if (this.additionalReel != null) {
//             // this.additionalReel.Stop(this.reactiveProperty.ForceStop.value,
//             //     this.matrixController.hasFreeSpinWin || this.matrixController.FakeBonus);
//         }
//
//         if (!this.reactiveProperty.ForceStop.value) {
//             try {
//                 if (
//                     this.matrixController.hasFreeSpinWin ||
//                     this.matrixController.indexSpecialSymbol > 0 ||
//                     (this.matrixController.FakeBonus && !this.reactiveProperty.ForceStop.value)
//                 ) {
//                     // Time.timeScale = 0.5;
//                     config.SetTimeScale0_5();
//                     await this.delay(
//                         config.stopSlowDuration * 1000,
//                         this.cancellationTokenSource
//                     );
//                 }
//             } catch (e) {
//                 console.error("eror in stopreels")
//             }
//         }
//
//
//         //await this.delay(config.stopSecondsBetweenReels)
//         // if (this.uiReactive.HideReelsEffect) {
//         //     this.uiReactive.HideReelsEffect.execute();
//         // }
//         // if (_reactiveProperty.ForceStop.Value) {
//         //
//         // if (this.reactiveProperty.JaguarMode.value) {
//         //     config.SetTimeScale2();
//         //     await this.delay((config.stopDuration / 3) * 1000);
//         // } else {
//         //     // Time.timeScale = 1;
//         //     config.SetTimeScale1();
//         //     let factor =
//         //         this.reactiveProperty.ForceStop.value &&
//         //         (this.matrixController.hasWin ||
//         //             this.matrixController.hasScatterWin ||
//         //             this.matrixController.indexSpecialSymbol > 0)
//         //             ? 2
//         //             : 1;
//         //     await this.delay(
//         //         ((config.stopDuration * factor) / 3) * 1000
//         //     );
//         // }
//
//         // }
//
//         // SoundManager.Instance.PlayRotateReelSound(false);
//         //this.CheckGamesState();
//         if (this.matrixController.hasWildWin) {
//             for (let i = 0; i < this.matrixController.expandingWild.length; i++) {
//                 if (this.matrixController.expandingWild[i] > 0) {
//                     this.reels[i].ExpandWild();
//                 }
//             }
//
//             // SoundManager.Instance.PlayWildExpandSound();
//             // await this.delay(
//             //     config.wildSymbolSwitchDelay * 1000,
//             //     this.cancellationTokenSource
//             // );
//         }
//
//         this.ShowWin();
//         //EventBus.ShowWin?.Invoke();
//     }
//     async InitReels() {
//         this.container.sizeDelta = config.reelsContainerSize;
//
//         for (let i = 0; i < config.reelsCount; i++) {
//             const newReel = new Reel(i,this.ReelsContainer,this.matrixController,this.SymbolDataConfig,this.AssetsInGame)
//             this.reels.push(newReel);
//             newReel.InitReelIndex(i);
//         }
//
//         if (this.additionalReel != null) {
//             this.additionalReel.InitReelIndex(config.reelsCount);
//         }
//
//         await new Promise((resolve) => setTimeout(resolve, 20)); // ~1 frame at 60fps
//
//         //this.horizontalLayoutGroup.enabled = false;
//         this.reactiveProperty.ReelsSpacing.value =
//             -(this.reels[1].container.position.x - this.reels[0].container.position.x);
//         this.reactiveProperty.IconsSpacing.value =
//             this.reels[1].container.position.x - this.reels[0].container.position.x -
//             config.symbolSize.width;
//         this.TurnOnLayout()
//     }
//     TurnOnLayout(){
//         for (let i = 0 ; i < this.reels.length; i++){
//             if(i == 0){
//                 this.reels[i].container.position.x = config.reelsSpacing
//                 continue;
//             }
//             this.reels[i].container.position.x = config.reelsSpacing + this.reels[i].index*(config.reelsSpacing + config.symbolSize.width)
//         }
//     }
//     async init() {
//         this.frameTexture = await Assets.load('assets/sprites/Containers/Frame40586.png');
//         this.image = new PIXI.Sprite(this.frameTexture);
//         // this.maskGraphics = new PIXI.Graphics();
//         // this.maskGraphics.beginFill(0xffffff);
//         // this.maskGraphics.drawRect(0, 0, this.image.width, this.image.height);
//         // this.maskGraphics.endFill();
//         // this.container.mask= this.maskGraphics;
//         this.container.addChild(this.image);
//         //this.container.addChild(this.maskGraphics);
//         this.container.zIndex = 1;
//         this.container.position.y = 100
//         this.ReelsMaskContainers = []
//         for (let i = 0 ; i < config.reelsCount; i++){
//             const TempContainer = new PIXI.Container();
//             this.ReelsMaskContainers.push(TempContainer);
//             TempContainer.name = "ReelMask"
//             this.container.addChild(TempContainer);
//
//             const TempMaskGraphic = new PIXI.Graphics();
//             TempMaskGraphic.beginFill(0xffffff);
//             TempMaskGraphic.drawRect(0, 0, config.symbolSize.width, config.visibleSymbolsCount*(config.symbolsSpacing+config.symbolSize.height));
//             TempMaskGraphic.endFill();
//
//             TempContainer.mask= TempMaskGraphic;
//
//             TempContainer.addChild(TempMaskGraphic);
//             TempContainer.position.x = i*(config.symbolSize.width + config.symbolsSpacing + config.reelsSpacing/5)+config.reelsSpacing*2;
//             TempContainer.position.y = 20
//             TempContainer.zIndex = 2
//
//            // this.container.mask = (TempMaskGraphic);
//         }
//         const TempMaskGraphic = new PIXI.Graphics();
//         TempMaskGraphic.beginFill(0xffffff);
//         TempMaskGraphic.drawRect(0, 0, config.reelsCount*(config.symbolSize.width+config.reelsSpacing)-config.reelsSpacing*2, config.visibleSymbolsCount*(config.symbolsSpacing+config.symbolSize.height) + config.reelsSpacing-10);
//         TempMaskGraphic.endFill();
//         this.ReelsContainer.addChild(TempMaskGraphic)
//         TempMaskGraphic.position.x = config.reelsSpacing+15
//         TempMaskGraphic.position.y = config.reelsSpacing-5
//         this.ReelsContainer.mask = TempMaskGraphic
//         this.Init();
//     }
//
//     delay(ms, signal) {
//         return new Promise((resolve, reject) => {
//             const timeout = setTimeout(() => {
//                 resolve();
//             }, ms);
//
//             // Listen for the abort event to cancel the delay
//             signal.addEventListener('abort', () => {
//                 clearTimeout(timeout);
//                 reject(new DOMException('Operation canceled', 'AbortError'));
//             });
//         });
//     }
//     ShowWin(onlySpecial = false) {
// //     _reactiveProperty.CurrentState.Value = CurrentState.Show;
// //     if (!_reactiveProperty.JaguraMode.Value) {
// //     //Time.timeScale = 1;
// //     _reelsConfig.SetTimeScale1();
// // }
// // else {
// //     //Time.timeScale = 2;
// //     _reelsConfig.SetTimeScale2();
// // }
// // List<ReelsSymbolVisiblityData> reelsSymbolVisiblityDatas = new List<ReelsSymbolVisiblityData>();
// // reelsSymbolVisiblityDatas = _matrixController.GetVisiblitySymbols();
// // ReelsSymbolVisiblityData additionReelWinData = _matrixController.GetAdditionalSymbol();
// // if (_spiningAudio != null) {
// //     _spiningAudio?.Stop();
// // }
// //
// //
// // _reactiveProperty.SpinningAudioPunch.Value = 1;
// //
// // foreach (var reelsSymbolData in reelsSymbolVisiblityDatas) {
// //     if (!reelsSymbolData.Visible) {
// //         _reels[reelsSymbolData.X]
// //             .SetSymbolsVisiblityByIndex(reelsSymbolData);
// //     }
// // }
// //
// // if (_additionalReel != null && additionReelWinData != null) {
// //     _additionalReel.SetSymbolsVisiblityByIndex(additionReelWinData);
// // }
// //
// // if (_matrixController.HasWin || _exitBonusScene || _matrixController.HasScatterWin) {
// //     _exitBonusScene = false;
// //     Observable.Timer(TimeSpan.FromSeconds(_reelsConfig.ShowWinPopupDuration)).Subscribe(_ => {
// //         if (_reactiveProperty.Bonus.Value == BonusType.Jackpot) {
// //             _reactiveProperty.OpenJackPot.OnNext(Unit.Default);
// //         }
// //
// //         if (_winConfig.GetAnimIndexByWin((float) _uiReactive.Win.Value / (float) _uiReactive.Bet.Value) >= 0) {
// //             if (_uiReactive.TotalWin.Value > 0 && GameStateManager.Instance.State == GameState.Normal) {
// //                 Debug.Log("Subscribe OpenBonusAfterBigWin");
// //                 EventBus.OpenBonusAfterBigWin += () => {
// //                     _uiReactive.ShowTotalWin.Value = true;
// //                     _reactiveProperty.ShowWinsPopup?.OnNext(Unit.Default);
// //                     EventBus.OpenBonusAfterBigWin = null;
// //                 };
// //             }
// //
// //             _reactiveProperty.ShowWinsPopup?.OnNext(Unit.Default);
// //         }
// //     else {
// //             if (_uiReactive.TotalWin.Value > 0 && GameStateManager.Instance.State == GameState.Normal) {
// //                 _uiReactive.ShowTotalWin.Value = true;
// //                 _reactiveProperty.ShowWinsPopup?.OnNext(Unit.Default);
// //             }
// //         }
// //     });
// //     Observable.Timer(TimeSpan.FromSeconds(_reactiveProperty.ForceStop.Value
// //         ? _reelsConfig.ShowWinDuration
// //         : _reelsConfig.ShowWinDelay)).Subscribe(_ => {
// //         _reactiveProperty.CurrentState.Value = CurrentState.None;
// //     });
// // }
// // else {
// //     _reactiveProperty.CurrentState.Value = CurrentState.None;
// // }
// //
// // if (_initBonusScene) {
// //     _initBonusScene = false;
// //     _reactiveProperty.SpinLocked.Value = true;
// //     if (_winConfig.GetAnimIndexByWin((float) _uiReactive.Win.Value / (float) _uiReactive.Bet.Value) < 0) {
// //         Observable.Timer(TimeSpan.FromSeconds(2)).Subscribe(_ => {
// //             _reactiveProperty.OpenBonus?.OnNext(Unit.Default);
// //         });
// //     }
// // else {
// //         EventBus.OpenBonusAfterBigWin += () => {
// //             _reactiveProperty.OpenBonus?.OnNext(Unit.Default);
// //             EventBus.OpenBonusAfterBigWin = null;
// //         };
// //         // _reactiveProperty.ShowWinsPopup?.OnNext(Unit.Default);
// //     }
// // }
// // else {
// //     if (GameStateManager.Instance.State == GameState.Normal && _uiReactive.MaintenanceSecond.Value <= 0 &&
// //         _uiReactive.IsOnMaintenance.Value) {
// //         _reactiveProperty.SpinLocked.Value = true;
// //         if (_winConfig.GetAnimIndexByWin((float) _uiReactive.Win.Value / (float) _uiReactive.Bet.Value) <= 0) {
// //             Observable.Timer(TimeSpan.FromSeconds(2)).Subscribe(_ => {
// //                 GameStateManager.Instance.ReloadPlatform();
// //             });
// //         }
// //     else {
// //             EventBus.OpenBonusAfterBigWin += () => {
// //                 _reactiveProperty.SpinLocked.Value = true;
// //                 Observable.Timer(TimeSpan.FromSeconds(3)).Subscribe(_ => {
// //                     GameStateManager.Instance.ReloadPlatform();
// //                     EventBus.OpenBonusAfterBigWin = null;
// //                 });
// //             };
// //         }
// //     }
// // }
// }
// }
