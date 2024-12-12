
    class ReelsController {
        _reelsContainerView
        _inputController
        _reactiveProperty
        _reelsConfig
        _matrixController
        _SceneReactiveCommands
        _disposableAutoplayCounter
        _disposableStop
        _disposableGameFreez
        _gameStateManager

        constructor(
            reelsContainerView,
            inputController,
             matrixController,GameStateManager) {
            this._reelsContainerView = reelsContainerView;
            this._inputController = inputController;
            this._reactiveProperty = SceneReactiveProperty;
            this._reelsConfig = config;
            this._matrixController = matrixController;
            this._SceneReactiveCommands = SceneReactiveCommands;
            this._gameStateManager = GameStateManager;
            this.Initialize()
        }

        Initialize() {
            console.log("Initialized ReelsController");
            this._SceneReactiveCommands.Rotate.subscribe(_=>{
                this.RotateReels()
            });
            this._SceneReactiveCommands.StartAutoSpin.subscribe(_=>{
                this.AutoSpin()
            }) ;
            this._reelsContainerView.Init();
            this.subscribePropertys();
        }


        async subscribePropertys() {
            await this.WaitForNextFrame();
            this._reactiveProperty.WinReadyToShow.asObservable().pipe(
                rxjs.operators.skip(1)
            ).subscribe(ready => {
                if (ready) {
                    if (this._reactiveProperty.CountOfAutoSpin.value === 0) {
                        this.AutoSpin(0);
                    }

                    if (this._reactiveProperty.TurboMode.value === 3) {
                        this.StopReels();
                    } else {
                        let StopDelayTimer = rxjs.timer(this._reelsConfig.stopDelay * 1000);
                        this._disposableStop = StopDelayTimer.subscribe(_ => {
                            this.StopReels();
                        });
                        // this._disposableStop = timer(TimeSpan.FromSeconds(this._reelsConfig.stopDelay)).subscribe(_ => {
                        //     this.StopReels();
                        // });
                    }
                }
            });
            this._inputController.AutoplaySpin.subscribe(_ => {
                this._reactiveProperty.AutoSpin.value = true;
                if (this._reactiveProperty.CurrentStateConfig.value === CurrentState.None) {
                    this.SpinAction();
                }
            });
            this._inputController.Spin.subscribe((_ => {
                this._reactiveProperty.ForceStop.value = false;
                this.SpinAction();

            }));

            this._reactiveProperty.CurrentStateConfig.subscribe(_ => {
                if (_ === CurrentState.None) {
                    let AutoPlayTimer = rxjs.timer(this._reactiveProperty.TurboSpin.value
                        ? this._reelsConfig.showWinDuration
                        : this._reelsConfig.showWinDuration * 4)
                    this._disposableAutoplayCounter = AutoPlayTimer.subscribe(x => {
                            if (this._reactiveProperty.AutoSpin.value && !this._reactiveProperty.SkipPause.value) {
                                if (this._reactiveProperty.CountOfAutoSpin.value !== 0) {
                                    if (this._gameStateManager.GameFreez.value) {
                                        this._disposableGameFreez = this._gameStateManager.GameFreez.subscribe(value => {
                                            if (!value) {
                                                this.SpinAction();
                                            }
                                            this.GameFreezDispose()
                                        });
                                    } else {
                                        this.SpinAction();
                                    }
                                }
                            }
                        });
                } else {
                    this.AutoplayCounterDispose()
                }
            });
        }

         AutoSpin(count) {
            this._reactiveProperty.CountOfAutoSpin.value = count;
            if (this._reactiveProperty.CountOfAutoSpin.value === 0) {
                this._reactiveProperty.AutoSpin.value = false;
            }
        }


    SpinAction() {

            this._gameStateManager.EndSessionTimeDetection();
            this._gameStateManager.StartSessionTimeDetection();
            if (this._reactiveProperty.ValidationActionConfig.value === ValidationAction.Break || this._reactiveProperty.ValidationActionConfig.value ===  ValidationAction.Show) {
                return;
            }

            if (this._reactiveProperty.SpinLocked.value) {
                return;
            }

            if (this._reactiveProperty.HasSkipJackpot.value) {
                this._reactiveProperty.SkipJackpotAction.next();
                return;
            }

            if (this._reactiveProperty.Bonus.value !== BonusType.Bonus &&
                this._reactiveProperty.CurrentStateConfig.value === CurrentState.Show) {
                // this._reactiveProperty.SkipWinAnimation.value = true;
                this._reactiveProperty.ForceStop.value = true;
            }


            if (this._reactiveProperty.HasCongratulationState.value) {
                this.AutoplayCounterDispose()
                this._SceneReactiveCommands.CloseCongratulation?.next();
                return;
            }

            if (this._reactiveProperty.SkipPause.value) {
                this.AutoplayCounterDispose()
                this._SceneReactiveCommands.Skip?.next();
                return;
            }


            if (this._reactiveProperty.IsReelsRotate.value) {
                this.StopReels();
            }
            else {
                if (this._reactiveProperty.CurrentStateConfig.value === CurrentState.None) {
                    if (!this._reactiveProperty.TurboMode.value)
                        this._reactiveProperty.ForceStop.value = false;
                    this._SceneReactiveCommands.Rotate?.next();
                }
            }
        }

         RotateReels() {
            if (this._reactiveProperty.AutoSpin.value && this._reactiveProperty.CountOfAutoSpin.value !== 0) {
                this._reactiveProperty.CountOfAutoSpin.value--;
            }

            this.StopDispose()
            this._reactiveProperty.CurrentStateConfig.value = CurrentState.Wait;
            this._reactiveProperty.IsReelsRotate.value = true;
        }

         StopReels() {

            if (!this._reactiveProperty.IsReelsRotate.value) {
                console.log("mtav StopReels")
                return;
            }

            this.StopDispose()
            if (!this._reactiveProperty.IsReelsRotate.value /*|| !this._reactiveProperty.WinReadyToShow.value*/) {
                console.log("mtav StopReels")
                return;
            }

            this._reactiveProperty.IsReelsRotate.value = false;
        }
        StopDispose(){
            this._disposableStop?.unsubscribe()
        }
        AutoplayCounterDispose(){
            this._disposableAutoplayCounter?.unsubscribe()
        }
        GameFreezDispose(){
            this._disposableGameFreez?.unsubscribe()
        }
        WaitForNextFrame() {
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    resolve();
                });
            });
        }
}
