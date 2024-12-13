class ReelContainerViewNew {

    constructor(
        matrixController,
        connectionService, GameStateManager,AssetsInGame,SymbolData,ParentContainer) {
        this._reelsConfig = config;
        this._reactiveProperty = SceneReactiveProperty;
        this._matrixController = matrixController;
        this._sceneReactivePropertyes = SceneReactiveCommands
        this._uiReactive = UiReactive;
        this._connection = connectionService;
        this._gameStateManager = GameStateManager;
        this._parent = null;
        this._reelPrefab = null;
        this._reels = []
        this._additionalReel = null;
        this._horizontalLayoutGroup = null;
        this._topGradient = null;
        this._bottomGradient = null;
        this._spiningAudio = null;
        this._winConfig = null;
        this._prefabFactory = null;
        this._cancellationToken = null;//bool
        this._disposable = null;//IDisposable
        this._slowMode = null;
        this._initBonusScene = null;
        this._exitBonusScene = null;
        this._prevewFeakRotateState = null;
        this._assetsInGame = AssetsInGame;
        this._symbolData = SymbolData;
        this._parentContainer = ParentContainer;
        this._cancellationTokenSource = null;
        this.container = new PIXI.Container();
        this.ReelsContainer = new PIXI.Container();
        this.container.sortableChildren = true;
        this.ReelsContainer.sortableChildren = true;
        this.ReelsContainer.zIndex = 3
        this.container.zIndex = 3

        //CancellationTokenSource
    }


    Init() {

        this.InitReels();
        this.InitContainer()
        this.InitProperties();
    }
    async InitContainer(){
        this.container.sortableChildren = true;
        this.container.addChild(this.ReelsContainer);
        this._parentContainer.addChild(this.container);
        this.container.name = "ReelContainerView";
        this.frameTexture = await Assets.load('assets/sprites/Containers/Frame40586.png');
        this.image = new PIXI.Sprite(this.frameTexture);
        this.image.width = (config.reelsSpacing+config.symbolSize.width)*config.reelsCount + config.reelsSpacing*2;
        this.image.height = (config.symbolsSpacing+config.symbolSize.height)*config.visibleSymbolsCount + config.symbolsSpacing*2;
        this.container.addChild(this.image);
        this.container.position.x = screen.width / 2  -  this.image.width / 2;
        this.container.position.y = screen.height / 2  -  this.image.height / 2;
        const TempMaskGraphic = new PIXI.Graphics();

        TempMaskGraphic.beginFill(0xffffff);
        TempMaskGraphic.drawRect(0, 0, config.reelsCount*(config.symbolSize.width+config.reelsSpacing)-config.reelsSpacing*4, config.visibleSymbolsCount*(config.symbolsSpacing+config.symbolSize.height) - config.reelsSpacing*2);
        TempMaskGraphic.endFill();
        this.ReelsContainer.addChild(TempMaskGraphic)
        this.ReelsContainer.zIndex = 5
        TempMaskGraphic.position.x = config.reelsSpacing+20
        TempMaskGraphic.position.y = config.reelsSpacing+5
        //this.ReelsContainer.mask = TempMaskGraphic
    }
    InitProperties() {
        this._reactiveProperty.SpinningAudioPunch.subscribe(_ => {
            if (this._spiningAudio != null) {
                this._spiningAudio.pitch = _;
            }
        });
        // this._reactiveProperty.ForceStop.subscribe(_ => {
        //     if (!_) return;
        //     //this._reactiveProperty.SpinningAudioPunch.value = 1;
        //     if (this._slowMode) {
        //         if (this._reactiveProperty.TurboMode.value === 1) {
        //             this._reelsConfig.SetTimeScale2();
        //         } else if (this._reactiveProperty.TurboMode.value === 0.5) {
        //             this._reelsConfig.SetTimeScale1();
        //         }
        //     } else {
        //         if (this._reactiveProperty.TurboMode.value !== 3) {
        //             //Time.timeScale = 1;
        //             this._reelsConfig.SetTimeScale1();
        //         }
        //
        //     }
        // });
        this._reactiveProperty.ForceStop.subscribe(stop => {
            if (stop) {
                this.Skip();
            }
        });

        this._reactiveProperty.SkipWinAnimation.subscribe(_ => {
            if (_) {
                this.Skip();
            }
        });
        this._reactiveProperty.IsReelsRotate.asObservable().pipe(
            rxjs.operators.skip(1)
        ).subscribe(rotate => {
            if (rotate) {
                this.Rotate();
            } else {
                this.Stop();
            }
        });
    }

    Skip() {
        if (this._cancellationTokenSource != null) {
            // this._cancellationTokenSource.Cancel();//////////////////////////////////////////////////////////////////////////////////////
            // this._cancellationTokenSource.Dispose();
        }

        this._cancellationToken = true;
    }

    ShowWin(onlySpecial = false) {
        this._reactiveProperty.CurrentStateConfig.value = CurrentState.Show;
        if (this._reactiveProperty.TurboMode.value !== 3) {
            this._reelsConfig.SetTimeScale1();
        } else {
            this._reelsConfig.SetTimeScale2();
        }
        let reelsSymbolVisiblityDatas = [];
        reelsSymbolVisiblityDatas = this._matrixController.getVisibilitySymbols();
        let additionReelWinData = this._matrixController.getAdditionalSymbol();
        if (this._spiningAudio != null) {
            this._spiningAudio?.Stop();
        }


        this._reactiveProperty.SpinningAudioPunch.value = 1;

        for (let reelsSymbolData of reelsSymbolVisiblityDatas) {
            if (!reelsSymbolData.Visible) {
                this._reels[reelsSymbolData.X]
                    .SetSymbolsVisiblityByIndex(reelsSymbolData);
            }
        }

        if (this._additionalReel != null && additionReelWinData != null) {
            this._additionalReel.SetSymbolsVisiblityByIndex(additionReelWinData);
        }

        if (this._matrixController.HasWin || this._exitBonusScene || this._matrixController.HasScatterWin) {
            this._exitBonusScene = false;
            // Observable.Timer(TimeSpan.FromSeconds(this._reelsConfig.ShowWinPopupDuration)).subscribe(_ => {////////////////////////////////////////////////////////////////
            //     if (this._reactiveProperty.Bonus.value == BonusType.Jackpot) {
            //         this._reactiveProperty.OpenJackPot.next();
            //     }
            //
            //     if (this._winConfig.GetAnimIndexByWin(parseFloat(this._uiReactive.Win.value)  / parseFloat(this._uiReactive.Bet.value)) >= 0) {
            //         if (this._uiReactive.TotalWin.value > 0 && this._gameStateManager.State == GameState.Normal) {
            //             console.log("subscribe OpenBonusAfterBigWin");
            //             this._sceneReactivePropertyes.OpenBonusAfterBigWin += () => {
            //                 this._uiReactive.ShowTotalWin.value = true;
            //                 this._reactiveProperty.ShowWinsPopup?.next();
            //                 this._sceneReactivePropertyes.OpenBonusAfterBigWin = null;
            //             };
            //         }
            //
            //         this._reactiveProperty.ShowWinsPopup?.next();
            //     }
            //     else {
            //         if (this._uiReactive.TotalWin.value > 0 && this._gameStateManager.State == GameState.Normal) {
            //             this._uiReactive.ShowTotalWin.value = true;
            //             this._reactiveProperty.ShowWinsPopup?.next();
            //         }
            //     }
            // });
            // Observable.Timer(TimeSpan.FromSeconds(this._reactiveProperty.ForceStop.value///////////////////////////////////////////////////////
            //     ? this._reelsConfig.ShowWinDuration
            //     : this._reelsConfig.ShowWinDelay)).subscribe(_ => {
            //     this._reactiveProperty.CurrentStateConfig.value = CurrentState.None;
            // });
        } else {
            this._reactiveProperty.CurrentStateConfig.value = CurrentState.None;
        }

        if (this._initBonusScene) {
            this._initBonusScene = false;
            this._reactiveProperty.SpinLocked.value = true;
            if (this._winConfig.GetAnimIndexByWin(parseFloat(this._uiReactive.Win.value) / parseFloat(this._uiReactive.Bet.value) < 0)) {
                // Observable.Timer(TimeSpan.FromSeconds(2)).subscribe(_ => {//////////////////////////////////////////////////////////////////////////////
                //     this._reactiveProperty.OpenBonus?.next();
                // });
            } else {
                this._sceneReactivePropertyes.OpenBonusAfterBigWin += () => {
                    this._reactiveProperty.OpenBonus?.next();
                    this._sceneReactivePropertyes.OpenBonusAfterBigWin = null;
                };
                // this._reactiveProperty.ShowWinsPopup?.next();
            }
        } else {
            if (this._gameStateManager.State == GameState.Normal && this._uiReactive.MaintenanceSecond.value <= 0 &&
                this._uiReactive.IsOnMaintenance.value) {
                this._reactiveProperty.SpinLocked.value = true;
                if (this._winConfig.GetAnimIndexByWin(parseFloat(this._uiReactive.Win.value) / parseFloat(this._uiReactive.Bet.value) <= 0)) {
                    // Observable.Timer(TimeSpan.FromSeconds(2)).subscribe(_ => {//////////////////////////////////////////////////////////
                    //     this._gameStateManager.ReloadPlatform();
                    // });
                } else {
                    this._sceneReactivePropertyes.OpenBonusAfterBigWin += () => {
                        this._reactiveProperty.SpinLocked.value = true;
                        // Observable.Timer(TimeSpan.FromSeconds(3)).subscribe(_ => {///////////////////////////////////////////////////////////////////////////////////
                        //     this._gameStateManager.ReloadPlatform();
                        //     this._sceneReactivePropertyes.OpenBonusAfterBigWin = null;
                        // });
                    };
                }
            }
        }
    }

    Start() {
        //this.SoundManager.Instance.PlayBackgroundSound(volume: 0.5f, loop: true);//////////////////////////////////////////////////////////////////////////////////
        this._sceneReactivePropertyes.WinDone += WinDone;
    }


    Rotate() {
        this._cancellationToken = false;
        this._reactiveProperty.SkipWinAnimation.value = false;
        this._initBonusScene = false;
        this._exitBonusScene = false;
        this._uiReactive.GuaranteedWinPreviewState.value = this._uiReactive.GuaranteedWin.value;

        if (this._reactiveProperty.TurboMode.value) {
            //Time.timeScale = this._reactiveProperty.ForceSpeedvalue.value;
            if (this._reactiveProperty.TurboMode.value === 1) {
                this._reelsConfig.SetTimeScale1();
            } else if (this._reactiveProperty.TurboMode.value === 2) {
                this._reelsConfig.SetTimeScale2();
            } else if (this._reactiveProperty.TurboMode.value === 0.5) {
                this._reelsConfig.SetTimeScale0_5();
            }
        } else {
            if (this._reactiveProperty.TurboMode.value !== 3) {
                this._reelsConfig.SetTimeScale1();
            }

        }

        this.StartRotate();
    }

    async StartRotate() {
        if (this._cancellationTokenSource != null) {
            ///this._cancellationTokenSource.Dispose();////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }

        this._cancellationTokenSource = new CancellationTokenSource();
        //this.SoundManager.Instance.PlaySpinSound();///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for (let reel of this._reels) {
            reel.RotateReel();
            if (this._reactiveProperty.TurboMode.value !== 3) {
                if (this._reelsConfig.introSecondsBetweenReels > 0) {
                    await new Promise(resolve => setTimeout(resolve, this._reelsConfig.introSecondsBetweenReels*1000));
                }
            }
        }

        this._sceneReactivePropertyes.OpenBonusAfterBigWin = null;
        if (this._additionalReel != null) {
            this._additionalReel.RotateReel();
        }

        this._reactiveProperty.WinReadyToShow.value = false;
        this.SetReelGradientState(true);
        //this._connection.SendSpin();/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    SetReelGradientState(visibility) {////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //this._topGradient?.DOKill();
        //this._bottomGradient?.DOKill();
        //this._topGradient.DOFade(visibility ? 1f : 0,
        //        this._reelsConfig.IntroDuration);
        // this._bottomGradient.DOFade(visibility ? 1f : 0,
        //        this._reelsConfig.IntroDuration);
    }

    WinDone(hasWin) {
        this._reactiveProperty.WinReadyToShow.value = true;
    }

    Stop() {
        //this._matrixController.checkWin();
        if (this._reactiveProperty.Bonus.value !== BonusType.None && this._gameStateManager.State === GameState.Normal) {
            if (this._reactiveProperty.Bonus.value === BonusType.FreeSpin) {
                this._initBonusScene = true;
            }
        }

        if (this._gameStateManager.State === GameState.FreeSpins && this._reactiveProperty.Bonus.value === BonusType.None) {
            this._exitBonusScene = true;
        }

        this.StopReels();
    }


    async StopReels() {
        // /this._disposable?.Dispose();
        if (this._reactiveProperty.TurboMode.value !== 3) {
            this._reelsConfig.SetTimeScale1();
        }
        this._reactiveProperty.CurrentStateConfig.value = CurrentState.Wait;
        this._reactiveProperty.SkipWinAnimation.value = false;
        this.SetReelGradientState(false);
        let slowReelsStartIndex = this._matrixController.getFirstLowStopReelIndex();
        let slowReelsEndIndex = this._matrixController.getLastLowStopReelIndex();
        this._slowMode = false;
        for (let reel of this._reels) {
            reel.BlockRandomSymbol = true;
            reel.SetSymbols();
        }

        if (this._additionalReel != null) {
            this._additionalReel.BlockRandomSymbol = true;
            this._additionalReel.SetSymbols();
        }
        for (let i = 0; i < this._reels.length; i++) {

            //this._reels[i].Stop(this._reactiveProperty.ForceStop.value, this._slowMode);
            if (this._reactiveProperty.ForceStop.value) {
                this._reactiveProperty.SpinningAudioPunch.value = 1;
                this._reactiveProperty.SkipWinAnimation.value = false;
                if (this._reactiveProperty.TurboMode.value !== 3) {
                    this._reelsConfig.SetTimeScale1();
                }

                this._slowMode = false;
                this._cancellationToken = true;
                for (let k = 0; k < this._reels.Count; k++) {
                    if (!this._reels[k].reelStoped) {
                        //this._reels[k].WaitForStop(true, false);
                    }
                }

                break;
            }

            // if ((i < slowReelsEndIndex && slowReelsEndIndex > 0) || slowReelsEndIndex < 0) {
            //     if (i >= slowReelsStartIndex && slowReelsStartIndex > 0 && !this._reactiveProperty.ForceStop.value) {
            //         for (let j = 0; j < 6; j++) {
            //             try {
            //                 // if (!this._cancellationToken && !this._cancellationTokenSource.IsCancellationRequested)
            //                 //     // await UniTask.Delay(TimeSpan.FromSeconds(this._reelsConfig.StopDuration / 3),
            //                 //     //     delayType: DelayType.Realtime, cancellationToken: this._cancellationTokenSource.Token);////////////////////////////////////////////
            //             } catch (e) {
            //             }
            //
            //             if (this._reactiveProperty.ForceStop.value) {
            //                 this._slowMode = false;
            //                 this._reactiveProperty.SpinningAudioPunch.value = 1;
            //                 this._reactiveProperty.SkipWinAnimation.value = false;
            //                 if (this._reactiveProperty.TurboMode.value !== 3) {
            //                     this._reelsConfig.SetTimeScale1();
            //                 }
            //
            //                 break;
            //             }
            //         }
            //
            //
            //         if (!this._reactiveProperty.ForceStop.value) {
            //             this._slowMode = true;
            //             this._reactiveProperty.SpinningAudioPunch.value = 0.5;
            //             //Time.timeScale = 0.5f;
            //             this._reelsConfig.SetTimeScale0_5();
            //             this._reactiveProperty.SkipWinAnimation.value = false;
            //             for (let reel of this._reels) {
            //                 reel.SetNonBlurSymbols();
            //             }
            //
            //             this._uiReactive.ReelEffect?.next(i);
            //             if (i !== this._reels.Count - 1) {
            //                 try {
            //                     if (!this._cancellationToken) {
            //                     }
            //                     await new Promise(resolve => setTimeout(resolve, this._reelsConfig.specialSymbolReelDelay));
            //                     // await UniTask.Delay(TimeSpan.FromSeconds(),
            //                     //     delayType: DelayType.Realtime,
            //                     // cancellationToken: this._cancellationTokenSource.Token);///////////////////////////////////////////////////////////////////////
            //
            //
            //                 } catch (e) {
            //                 }
            //             }
            //         }
            //     }
            // }


            if (!this._reactiveProperty.ForceStop.value && (this._reactiveProperty.TurboMode.value !== 3)) {
                try {
                    if (!this._cancellationToken) {
                    }
                    const Delay = this._reactiveProperty.TurboMode.value === 3 ? this._reelsConfig.stopSecondsBetweenReels / 4 * 1000 : this._reelsConfig.stopSecondsBetweenReels *1000
                    await new Promise(resolve => {
                        setTimeout(resolve, Delay);
                    });

                } catch (e) {
                }
            }
        }

        if (this._additionalReel != null) {
            this._additionalReel.Stop(this._reactiveProperty.ForceStop.value,
                this._matrixController.HasFreeSpinWin || this._matrixController.FakeBonus);
        }

        if (!this._reactiveProperty.ForceStop.value) {
            try {
                if ((this._matrixController.HasFreeSpinWin || this._matrixController.IndexSpecialSymbol > 0) ||
                    this._matrixController.FakeBonus && !this._reactiveProperty.ForceStop.value) {
                    this._reelsConfig.SetTimeScale0_5();
                    // await UniTask.Delay(TimeSpan.FromSeconds(this._reelsConfig.StopSlowDuration),////////////////////////////////////////////////
                    //     delayType: DelayType.Realtime,
                    //     cancellationToken: this._cancellationTokenSource.Token);
                }
            } catch (e) {
            }
        }


        // await UniTask.Delay(TimeSpan.FromSeconds(this._reelsConfig.StopSecondsBetweenReels), delayType: DelayType.Realtime);
        this._uiReactive.HideReelsEffect?.next();
        // if (this._reactiveProperty.ForceStop.value) {
        //
        if (this._reactiveProperty.TurboMode.value === 3) {
            //Time.timeScale = 2;
            this._reelsConfig.SetTimeScale2();
            // await UniTask.Delay(
            //     TimeSpan.FromSeconds(this._reelsConfig.StopDuration /3), delayType: DelayType.Realtime);/////////////////////////////////////////////////////////////
        } else {
            //Time.timeScale = 1f;
            this._reelsConfig.SetTimeScale1();
            // await UniTask.Delay(
            //     TimeSpan.FromSeconds(this._reelsConfig.StopDuration *
            //         ((this._reactiveProperty.ForceStop.value && (this._matrixController.HasWin || this._matrixController.HasScatterWin ||////////////////////////////////////////////////////////////
            //             this._matrixController.IndexSpecialSymbol > 0))
            //             ? 2
            //             : 1) / 3),
            //     delayType: DelayType.Realtime);
        }

        // }

        // SoundManager.Instance.PlayRotateReelSound(false);
        this.CheckGamesState();
        if (this._matrixController.HasWildWin) {
            for (let i = 0; i < this._matrixController.ExpandingWild.length; i++) {
                if (this._matrixController.ExpandingWild[i] > 0) {
                    this._reels[i].ExpandWild();
                }
            }

            // this.SoundManager.Instance.PlayWildExpandSound();////////////////////////////////////////////////////////////////////////////////////////////////////
            // await UniTask.Delay(TimeSpan.FromSeconds(this._reelsConfig.WildSymbolSwitchDelay),
            //     delayType: DelayType.Realtime);
        }

        this.ShowWin();
        this._sceneReactivePropertyes.ShowWin?.next();
    }

    CheckGamesState() {
        //   this._gameStateManager.State = this._reactiveProperty.Bonus.value switch {////////////////////////////////////////////////////////////////////////
        //     BonusType.Bonus => GameState.BonusGame,
        //         BonusType.FreeSpin => GameState.FreeSpins,
        //         BonusType.None => GameState.Normal,
        //         null => GameState.Normal,
        //         _ => GameState.Normal
        // };
    }

    async InitReels() {
        this.container.size = this._reelsConfig.reelsContainerSize;

        for (let i = 0; i < this._reelsConfig.reelsCount; i++) {
            this._reels.push(new Reel(i, this.container, this._matrixController, this._symbolData, this._assetsInGame));
            this._reels[i].InitReelIndex(i);
            this.ReelsContainer.addChild(this._reels[i].container);
        }

        if (this._additionalReel != null) {
            this._additionalReel.InitReelIndex(this._reelsConfig.reelsCount);
        }

        // await UniTask.DelayFrame(1);////////////////////////////////////////////////////////
        //this._horizontalLayoutGroup.enabled = false;

        this._reactiveProperty.ReelsSpacing.value =
            -(this._reels[1].container.position.x - this._reels[0].container.position.x);
        this._reactiveProperty.IconsSpacing.value =
            this._reels[1].container.position.x - this._reels[0].container.position.x -
            this._reelsConfig.symbolSize.width;
        this.TurnOnLayout()
    }
    TurnOnLayout(){
        for (let i = 0 ; i < this._reels.length; i++){
            if(i == 0){
                this._reels[i].container.position.x = config.reelsSpacing +  config.reelsSpacing/2
                continue;
            }
            this._reels[i].container.position.x = config.reelsSpacing + this._reels[i].index*(config.reelsSpacing + config.symbolSize.width)
        }
    }

}