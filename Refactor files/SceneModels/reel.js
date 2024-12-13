class Reel {
    constructor(index, parentContainer, matrixController, symbolData, AssetsInGame) {

        this.additionalReel = false;
        this.symbols = [];
        this.symbolsIndex = [];
        this.stopReels = false;
        this.reelStoped = false;
        this.index = index;
        this.visibleSymbolCount = config.visibleSymbolsCount
        this.symbolCount = config.symbolCount
        this.blockRandomSymbol = false;
        this.symbolsConfig = symbolConfig
        this.symbolsCountMultiplier = config.visibleSymbolsCount;
        this.symbolDataConfig = symbolData
        this.startPositionY = 0;
        this.slowMode = false;
        this.offSetStartSymbol = 0;
        this.force = false;
        this.hasWildSymbol = false;
        this.hasJackPotSymbol = false;
        this.hasScatterSymbol = false;
        this.reactiveProperty = SceneReactiveProperty
        this.spacing = config.symbolsSpacing;
        this.container = new PIXI.Container();
        this.container.name = "Reel"
        this.container.sortableChildren = true;
        this.container.zIndex = 2
        this.parentContainer = parentContainer;
        parentContainer.addChild(this.container);
        this.matrixController = matrixController;
        //this.container.width = config.symbolSize.width;
        this.animation = 0;
        this.AssetsInGame = AssetsInGame
        this.Awake()
        this.compositeSubscription = new rxjs.Subscription();
        this.subscription = undefined;
        this.symbolHeight = config.symbolSize.height;
        this.loopEnded = false;
        this.WinReel = new PIXI.Container()
        this.WinReelSymobls = []
        this.parentContainer.addChild(this.WinReel);
        this.firstLoop = true
        // app.ticker.add(() => {
        //     console.log(this.container.width);
        //
        // });

    }

    Awake() {
        this.reactiveProperty.InitialState.subscribe(_ => {
            this.animation?.kill();
            this.blockRandomSymbol = false;
            this.stopReels = false;
            // this.InitElements(); // uncoment when connection service is done
            // console.log("hi");
        })
        this.InitElements();
        // console.log("Awake" + this.container.position.x);

    }

    InitReelIndex(index) {
        this.index = index;
        //console.log("InitReelIndex" + this.container.position.x);
    }

    SetNonBlurSymbols() {
        for (let i = 0; i < this.symbols.length; i++) {
            //this.symbols[i].image.sprite = this.symbolsData[i].image;
        }
        //console.log("SetNonBlurSymbols" + this.container.position.x);
    }

    // returnAllSymbolsVisibility(){
    //     for (let symbol of this.symbolsConfig){
    //         symbol.SetVisibilityState(true);
    //     }
    ////diposableexpanwilddelay.dispose
    // }
    // setSymbolVisibilityByIndex(symbolVisibilityData){
    //     this.symbols[symbolVisibilityData.y+this.offSetStartSymbol-2].setVisibilityState(symbolVisibilityData.Visible, symbolVisibilityData.Special,
    //         symbolVisibilityData.IndexSpecialSymbol, symbolVisibilityData.WildWinSymbol, _additionalReel,
    //         symbolVisibilityData.LineIndex, symbolVisibilityData.IsExpanding,symbolVisibilityData.IsScatter)
    // }
    ExpandWild() {
        let top = false;
        for (let i = 0; i < config.visibleSymbolsCount; i++) {
            if (symbolConfig[i + this.offSetStartSymbol] = this.matrixController.getWildIndex()) {
                if (i === 0) {
                    top = true;
                }
            }
        }
        let sequenceIndex = 1;
        for (let i = 0; i < config.visibleSymbolsCount; i++) {

            this.symbols[top ? i + this.offSetStartSymbol : (this.offSetStartSymbol + config.visibleSymbolsCount - 1) - i].IsExpandWild = true;
            // if (_symbolsData[top ? i + _offSetStartSymbol :   (_offSetStartSymbol +_reelsConfig.VisibleSymbolsCount-1)-i].Index !=
            //     _matrixController.GetWildIndex()) {
            // _symbolElems[top ? i + _offSetStartSymbol :    (_offSetStartSymbol +_reelsConfig.VisibleSymbolsCount-1)-i]
            //     .ExpandWild(_reelsConfig.ExpandWildDuration/2 * sequenceIndex);
            this.symbols[top ? i + this.offSetStartSymbol : (this.offSetStartSymbol + config.visibleSymbolsCount - 1) - i]
                .ExpandWild(config.expandWildDuration);
            sequenceIndex++;
            // }
            // else {
            // _symbolElems[top ? i + _offSetStartSymbol :    (_offSetStartSymbol +_reelsConfig.VisibleSymbolsCount-1)-i]
            //     .HighlightExpandWild(_reelsConfig.ExpandWildDuration/2 * sequenceIndex,top);
            // sequenceIndex++;
            // }
        }
        //console.log("ExpandWild" + this.container.position.x);
    }

    RefreshRandomSymbols() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].SetRandomSymbol();
        }

    }

    InitStartPosition() {
        //this.startPositionY = -((config.symbolSize.height+config.symbolsSpacing)*(config.visibleSymbolsCount+((this.index+1)*config.visibleSymbolsCount)))+config.symbolsSpacing-config.symbolSize.height;
        this.startPositionY = -((config.symbolSize.height + config.symbolsSpacing) * (config.visibleSymbolsCount) - config.symbolsSpacing)

        // console.log("InitStartPosition" + this.startPositionY,);
    }

    ResetReelPosition() {
        // if (this.animation) {
        //     this.animation?.kill();
        // }
        //console.log(this.startPositionY);
        this.container.position.y = this.startPositionY;
        //console.log("ResetReelPosition" + this.container.position.x);
    }

    ResetReelForStop() {
        // if (this.animation){
        //     this.animation.kill();
        // }
        // this.container.position.y = this.container.height/4;
        //console.log("ResetReelForStop" + this.container.position.x);
    }

    timerFrame(frames) {
        return rxjs.animationFrames().pipe(
            rxjs.operators.take(frames),
            rxjs.operators.last()
        );
    }

    TurnOnLayouts() {
        this.symbols.forEach((symbol, index) => {
            symbol.container.position.y = index * (config.symbolSize.height + config.symbolsSpacing);
        })
        this.TurnOffLayoutsAndReset();
    }

    TurnOffLayoutsAndReset() {
        this.subscription = this.timerFrame(2).subscribe(() => {
            //_verticalLayoutGroup.enabled = false;
            ///_contentSizeFitter.enabled = false;
            this.InitStartPosition();
            this.ResetReelPosition();
            this.compositeSubscription.add(this.subscription)
        });
        //console.log("TurnOffLayoutsAndReset" + this.container.position.x);
    }

    InitElements() {

        this.offSetStartSymbol = config.visibleSymbolsCount;
        //console.log("InitElements" + this.container.position.x);
        for (let i = 0; i < /*1+*/config.symbolsCount/*+((this.index+1)*config.visibleSymbolsCount)*/; i++) {
            const tempSymbol = new Symbol(this.matrixController, this.container, this.symbolDataConfig, this.AssetsInGame)
            this.symbols.push(tempSymbol);

            this.symbols[i].SetSymbolSize(config.symbolSize);
        }
        CustomEase.create("customStopNormal", "M0,0 C0,0 0,0 0.213,0.6 0.341,0.961 0.214,0.599 0.354,1 0.373,1.057 0.396,1.096 0.437,1.089 0.588,1.06 0.438,1.087 0.589,1.063 0.998,0.996 0.591,1.06 1,1 ")

        ///1 version ///////
        // CustomEase.create("customStopNormal1", "M0,0 C0,0 0,0 0.213,0.6 0.341,0.961 0.214,0.599 0.354,1 0.373,1.02 0.396,1.05 0.437,1.04 0.588,1.03 0.438,1.04 0.589,1.03 0.998,0.996 0.591,1.03 1,1");
        // CustomEase.create("customStopNormal2", "M0,0 C0,0 0,0 0.213,0.6 0.341,0.961 0.214,0.599 0.354,1 0.373,1.015 0.396,1.03 0.437,1.02 0.588,1.015 0.438,1.02 0.589,1.015 0.998,0.996 0.591,1.015 1,1");
        // CustomEase.create("customStopNormal3", "M0,0 C0,0 0,0 0.213,0.6 0.341,0.961 0.214,0.599 0.354,1 0.373,1.01 0.396,1.02 0.437,1.01 0.588,1.005 0.438,1.01 0.589,1.005 0.998,0.996 0.591,1.005 1,1");
        // CustomEase.create("customStopNormal4", "M0,0 C0,0 0,0 0.213,0.6 0.341,0.961 0.214,0.599 0.354,1 0.373,1.005 0.396,1.01 0.437,1.005 0.588,1.003 0.438,1.005 0.589,1.003 0.998,0.996 0.591,1.003 1,1");

        //2 version/////////
        CustomEase.create("customStopNormal0", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.05 C0.5,1.05,0.7,1.03,1,1");
        CustomEase.create("customStopNormal1", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.04 C0.5,1.04,0.7,1.02,1,1");
        CustomEase.create("customStopNormal2", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.03 C0.5,1.03,0.7,1.015,1,1");
        CustomEase.create("customStopNormal3", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.02 C0.5,1.02,0.7,1.01,1,1");
        CustomEase.create("customStopNormal4", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.01 C0.5,1.01,0.7,1.005,1,1");

        //3 version///////
        // CustomEase.create("customStopNormal0", "M0,0 C0.07,0.65 0.05,1.167 0.074,1.351 0.192,1.305 0.7,1.099 1,1   ");
        // CustomEase.create("customStopNormal1", "M0,0 C0.056,0.639 0.111,0.839 0.133,1.042 0.299,1.031 0.669,1.024 1,1       ");
        // CustomEase.create("customStopNormal2", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.03 C0.5,1.03,0.7,1.015,1,1");
        // CustomEase.create("customStopNormal3", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.02 C0.5,1.02,0.7,1.01,1,1");
        // CustomEase.create("customStopNormal4", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.01 C0.5,1.01,0.7,1.005,1,1");

        //4 version///////
        // CustomEase.create("customStopNormal0", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.06 C0.5,1.06,0.7,1.03,1,1");
        // CustomEase.create("customStopNormal1", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.05 C0.5,1.05,0.7,1.03,1,1");
        // CustomEase.create("customStopNormal2", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.03 C0.5,1.03,0.7,1.015,1,1");
        // CustomEase.create("customStopNormal3", "M0,0 C0.2,0.6,0.3,0.9,0.4,1.015 C0.5,1.015,0.7,1.0075,1,1");
        // CustomEase.create("customStopNormal4", "M0,0 C0.2,0.6,0.3,0.9,0.4,1 C0.5,1,0.7,1,1,1");



        CustomEase.create("customStopFast", "M0,0 C0,0 0,0 0.3,0.6 0.442,0.938 0.471,1 0.471,1 0.489,1 0.499,1.096 0.54,1.089 0.691,1.06 0.696,1.063 0.696,1.063 0.696,1.063 0.693,1.066 1,1 ")
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].SetRandomSymbol()
            this.symbolsIndex[i] = this.symbols[i].index;
        }

        if (this.matrixController.lastWinData != null) {
            this.matrixController.WinData = this.matrixController.lastWinData;
        } else {
            //this.matrixController.WinData = this.matrixController.NoWinData;
        }
        //this.SetSymbols();

        this.NormalizationSymbols();
        // Observable.TimerFrame(1).Subscribe(_ =>
        // {
        // 	_verticalLayoutGroup.enabled = false;
        // 	_contentSizeFitter.enabled = false;
        // 	_container.anchoredPosition = _container.anchoredPosition.SetY(0);
        // }).AddTo(_compositeDisposable);
        this.TurnOnLayouts()

    }

    NormalizationSymbols(isRandomSymbols = true, blured = false) {
        for (let i = 0; i < this.symbols.length; i++) {
            //this.symbols[i].image = blured ? this.symbolDataConfig.Symbols[i].bluredImage : this.symbolDataConfig.Symbols[i].image;
        }
        this.ChangeIconsHidden();
        //console.log("NormalizationSymbols" + this.container.position.x);
    }

    SetSymbols() {
        this.ChangeIconsHidden();
        //console.log("SetSymbols" + this.container.position);
        //List<SymbolsData> a = _matrixController.GetWinSymbolsByIndexReel(_index, _additionalReel);
        let a = this.matrixController.getWinSymbolsByIndexReel(this.index, this.additionalReel);
        if (a != null) {
            for (let i = 0; i < a.length; i++) {
                this.symbolsData[i + this.offSetStartSymbol] = a[i];
                this.symbolsIndex[i + this.offSetStartSymbol] = a[i].index;
                console.log(this.symbols[i + this.offSetStartSymbol]);
                this.symbols[i + this.offSetStartSymbol].image.sprite = a[i].image;
                if (a[i].index == this.symbolDataConfig.WildIndex) {
                    this.hasWildSymbol = true;
                } else if (a[i].index >= 400 && a[i].index <= 404) {
                    this.hasJackpotSymbol = true;
                } else if (this.symbolDataConfig.ScatterIndexes.includes(a[i].index)) {
                    this.hasScatterSymbol = true;
                }
            }

            if (this.additionalReel) {
                // if (Random.Range(0, 60) == 0 && GameStateManager.Instance.State == GameState.Normal) {
                //     //let symbolData = new SymbolsData();
                //     let symbolsData = this.matrixController.GetSymbolByIndex(200, true);
                //     this.symbolsData[this.offSetStartSymbol - 1] = symbolsData;
                //     this.symbolsIndex[this.offSetStartSymbol - 1] = symbolsData.index;
                //     this.symbols[this.offSetStartSymbol - 1].image.sprite = symbolsData.image;
                //     this.matrixController.FakeBonus = true;
                // }
            }
        }

        this.NormalizationSymbols(false, false);
    }

    RotateLoop() {
        let posStart, posEnd, duration;
        const visibleSymbolsCount = config.visibleSymbolsCount;
        const globalStartPosY = this.startPositionY
        const SymbolBlock = config.symbolSize.height + config.symbolsSpacing
        const{TurboMode ,IsReelsRotate } = this.reactiveProperty;

        const calcPosStart = globalStartPosY - visibleSymbolsCount * SymbolBlock;
        const calcPosEnd = globalStartPosY + visibleSymbolsCount * SymbolBlock;
        const containerPos = this.container.position

        if (TurboMode.value === 1 || TurboMode.value === 2) {
            posStart = calcPosStart;
            posEnd = calcPosEnd;
            duration = config.speedDuration * 1000;

            if (this.firstLoop) {
                this.SetRandomSymbolsOnLoopStartMode1();
            }
            containerPos.set(containerPos.x, posStart);

        } else if (TurboMode.value === 3) {
            posStart = globalStartPosY - visibleSymbolsCount * SymbolBlock;
            posEnd = globalStartPosY + visibleSymbolsCount * SymbolBlock;
            duration = (config.speedDuration * 1000 / 9 * 5); // эквивалент config.speedDuration * 1000 / 9 * 6
            this.SetRandomSymbolsOnLoopStartMode3()
            containerPos.set(containerPos.x, posStart);
        }
        let firstLoop2 = true
        let firstLoop = true
        this.animation = anime({
            targets: this.container,
            y: posEnd,
            duration: duration,
            easing: AnimationConfigs.loop,
            loop: -1,
            begin:async ()=>{
                if (TurboMode.value === 3){
                    this.animation.pause()
                    this.animation .seek(duration/2)
                    this.animation.play()
                    this.SetRandomSymbolsOnLoopStartMode3()
                }
            },
            loopBegin: async () => {
                if (!firstLoop) {
                    if (TurboMode.value === 1) {
                        this.SetRandomSymbolsOnLoopMode1()
                    }
                    if (TurboMode.value === 3) {
                        this.SetRandomSymbolsOnLoopMode3(3,6)
                    }
                }
                else{
                    if(TurboMode.value === 3 && !IsReelsRotate.value){
                        this.SetRandomSymbolsOnLoopMode3(3,6)
                    }
                }
                if (!IsReelsRotate.value) {
                    this.Stop();
                }
                firstLoop = false
            },
        });
        if (this.index === 4) {
            this.reactiveProperty.SpinLocked.value = false;
        }
        this.firstLoop = false
    }

    ChangeIconsHidden() {
        for (let i = 0; i < config.visibleSymbolsCount; i++) {
            this.symbols[this.symbols.length - config.visibleSymbolsCount + i]
                .image = this.symbols[i].sprite;
        }


    }

    RotateReel() {
        //console.log("RotateReel" + this.index);
        this.hasWildSymbol = false;
        this.hasJackpotSymbol = false;
        this.hasScatterSymbol = false;
        this.slowMode = false;
        this.force = false;
        this.reelStoped = false;
        this.RotateLoop();
    }

    async Stop() {
        const {ForceStop, IsReelsRotate} = this.reactiveProperty;
        if (ForceStop.value) {
            this.ForceStop();
            return;
        }
        if (IsReelsRotate.value) {
            return;
        }
        // const {CanCallStop} = this.reactiveProperty;
        // const {TurboMode} = this.reactiveProperty;
        this.StopDataManagement(this.force, this.slowMode)


    }

    NormalizeWinSymbols() {
        for (let i = 0; i < this.WinReelSymobls.length; i++) {
            this.WinReelSymobls[i].container.position.y = this.symbols[0].container.position.y - ((i + 1) * config.symbolSize.height);
        }
    }

    SetRandomSymbolsOnLoopStartMode1() {
        // let symbolsVisible = []
        // for (let i = config.visibleSymbolsCount; i < 2 * config.visibleSymbolsCount; i++) {
        //     symbolsVisible.push(this.symbols[i].index);
        // }
        // for (let i = config.symbolsCount - config.visibleSymbolsCount; i < config.symbolsCount; i++) {
        //     this.symbols[i].SetSymbolByIndex(symbolsVisible[i - 2 * config.visibleSymbolsCount])
        // }
        // for (let i = 0; i < config.symbolsCount - config.visibleSymbolsCount; i++) {
        //     this.symbols[i].SetRandomSymbol()
        // }

        const visibleCount = config.visibleSymbolsCount;
        const symbolCount = config.symbolsCount;
        const symbols = this.symbols;

        const symbolsVisible = new Array(visibleCount);
        for (let i = visibleCount; i < 2 * visibleCount; i++) {
            symbolsVisible[i - visibleCount] = symbols[i].index;
        }

        for (let i = symbolCount - visibleCount; i < symbolCount; i++) {
            symbols[i].SetSymbolByIndex(symbolsVisible[i - 2 * visibleCount]);
        }

        for (let i = 0; i < symbolCount - visibleCount; i++) {
            symbols[i].SetRandomSymbol();
        }
    }

    SetRandomSymbolsOnLoopStartMode3() {

        let symbolsVisible1 = []
        for (let i = config.visibleSymbolsCount; i < 2 * config.visibleSymbolsCount; i++) {
            symbolsVisible1.push(this.symbols[i].index);
        }
        for (let i = config.visibleSymbolsCount*2; i < config.symbolsCount; i++) {
            this.symbols[i].SetSymbolByIndex(symbolsVisible1[i-config.visibleSymbolsCount*2])
        }
        for (let i = 0; i < config.symbolsCount - config.visibleSymbolsCount; i++) {
            this.symbols[i].SetRandomSymbol()
        }
    }
    SetRandomSymbolsOnSecondLoopStartMode3(){
        // let symbolsVisible1 = []
        // for (let i = 0; i < config.visibleSymbolsCount; i++) {
        //     symbolsVisible1.push(this.symbols[i].index);
        // }
        // for (let i = config.symbolsCount - config.visibleSymbolsCount; i < config.symbolsCount; i++) {
        //     this.symbols[i].SetSymbolByIndex(symbolsVisible1[i - 2*config.visibleSymbolsCount])
        // }
        // for (let i = config.symbolsCount - 2*config.visibleSymbolsCount; i < config.symbolsCount; i++) {
        //     this.symbols[i].SetRandomSymbol()
        // }
        const visibleCount = config.visibleSymbolsCount;
        const symbolCount = config.symbolsCount;

        const symbolsVisible1 = new Array(visibleCount);
        for (let i = 0; i < visibleCount; i++) {
            symbolsVisible1[i] = this.symbols[i].index;
        }

        for (let i = symbolCount - visibleCount; i < symbolCount; i++) {
            const sourceIndex = i - 2 * visibleCount;
            this.symbols[i].SetSymbolByIndex(symbolsVisible1[sourceIndex]);
        }

        for (let i = symbolCount - 2 * visibleCount; i < symbolCount; i++) {
            this.symbols[i].SetRandomSymbol();
        }

    }
    SetRandomSymbolsOnLoopMode1() {
        const symbols = this.symbols
        const {symbolsCount, visibleSymbolsCount} = config;
        const symbolsTop = symbols.slice(0, visibleSymbolsCount).map(symbol => symbol.index);
        const repeatStartIndex = symbolsCount - visibleSymbolsCount;
        const offset = 2 * visibleSymbolsCount;
        for (let i = 0; i < symbolsCount; i++) {
            if (i >= repeatStartIndex) {
                const topIndex = i - offset;
                if (topIndex >= 0 && topIndex < symbolsTop.length) {
                    symbols[i].SetSymbolByIndex(symbolsTop[topIndex]);
                }
            } else {
                symbols[i].SetRandomSymbol();
            }
        }
    }

    SetRandomSymbolsOnLoopMode3(start, end) {
        // let vis = []
        // for (let i = start ; i < end ; i++){
        //     vis.push(this.symbols[i].index);
        //     this.symbols[i].SetRandomSymbol();
        // }
        // for (let i = end; i < config.symbolsCount;i++){
        //     this.symbols[i].SetSymbolByIndex(vis[i-config.visibleSymbolsCount*2]);
        // }

        const visibleCount = config.visibleSymbolsCount;
        const vis = new Array(visibleCount);

        for (let i = 0; i < visibleCount; i++) {
            const symbolIndex = start + i;
            vis[i] = this.symbols[symbolIndex].index;
            this.symbols[symbolIndex].SetRandomSymbol();
        }

        for (let i = end; i < config.symbolsCount; i++) {
            this.symbols[i].SetSymbolByIndex(vis[i - 2 * visibleCount]);
        }
    }

    StopDataManagement(force, slow = false) {
        if (force || this.reactiveProperty.TurboMode.value === 3) {
            this.ForceStop();
            return;
        }

        this.slowMode = slow;
        this.force = force;

        if (!slow) {
            const {CanCallStop,TurboMode} = this.reactiveProperty;
            const canCall = CanCallStop.value[this.index]
            if (canCall && TurboMode.value === 1) {
                this.StopNormal(force)
            } else if (canCall && TurboMode.value === 2) {
                this.StopFast(force)
            }
        }
        this.stopReels = true;
    }

    async StopNormal(force) {
        let duration = config.stopDuration
        let endPos = this.startPositionY
        await new Promise(resolve => setTimeout(resolve, 0))
        this.animation.remove(this.container)
        this.animation = gsap.to(this.container, {
            y: endPos,
            duration: duration,
            ease: AnimationConfigs.stopNormal,
            onStart: () => {
                if (this.index !== 4) {
                    this.reactiveProperty.CanCallStop.value[this.index + 1] = true;
                }
            },
            onComplete: async () => {
                if (this.reactiveProperty.TurboMode.value == 1) {
                    this.ResetReelPosition();
                }
                this.stopReels = false;
                this.reelStoped = true;
                if (this.index + 1 === config.reelsCount) {
                    if (this.reactiveProperty.TurboMode.value !== 3) {
                        config.SetTimeScale1();
                    }
                }
                if (this.index === 4) {
                    for (let i = 1; i < config.reelsCount; i++) {
                        this.reactiveProperty.CanCallStop.value[i] = false;
                    }
                }
            }
        });
    }
    async StopFast() {

        await new Promise(resolve => setTimeout(resolve, 0))

        if (this.index === 1){
            await new Promise(resolve => setTimeout(resolve , 30))
        }
        else if(this.index === 2){
            await new Promise(resolve => setTimeout(resolve , 60))
        }
        else if(this.index === 3){
            await new Promise(resolve => setTimeout(resolve , 90))
        }
        else if(this.index === 4){
            await new Promise(resolve => setTimeout(resolve , 120))
        }
        console.log(this.animation , this.index)
        this.animation.remove(this.container)
        let duration = config.speedDuration
        let endPos = this.startPositionY
        this.animation = gsap.to(this.container, {
            y: endPos,
            duration: 1,
            ease: "customStopNormal",
            onComplete: async () => {
                // if (this.index === 4) {
                //     for (let i = 1; i < config.reelsCount; i++) {
                //         this.reactiveProperty.CanCallStop.value[i] = false;
                //     }
                // }
            }
        });
    }
    async StopFastSecond() {
        const reelIndex = this.index
        const stopConfigDuration = config.speedDuration/1.7
        const globalStartPosY = this.startPositionY
        const visibleSymbols = config.visibleSymbolsCount
        const symbolBlock = config.symbolSize.height + config.symbolsSpacing
        let endPos ,duration
        if (reelIndex === 0){
            endPos = globalStartPosY - (visibleSymbols-1)*symbolBlock
            duration = stopConfigDuration
        }
        else if(reelIndex === 1){
            endPos = globalStartPosY - (visibleSymbols - reelIndex - 2)*symbolBlock
            duration = stopConfigDuration*(reelIndex+1)
        }
        else if(reelIndex === 2){
            endPos = globalStartPosY - (visibleSymbols - reelIndex - 2)*symbolBlock
            duration = stopConfigDuration*(reelIndex+1)
        }
        else if(reelIndex === 3){
            endPos = globalStartPosY - (visibleSymbols - reelIndex - 2)*symbolBlock
            duration = stopConfigDuration*(reelIndex+1)
        }
        else if(reelIndex === 4){
            endPos = globalStartPosY - (visibleSymbols - reelIndex - 2)*symbolBlock
            duration = stopConfigDuration*(reelIndex+1)
        }
        // endPos = globalStartPosY + (visibleSymbols - 1) * symbolBlock;
       // await new Promise(resolve => setTimeout(resolve, this.index !== 0 ? this.index * 50 : 0))

        await new Promise(resolve => setTimeout(resolve, 0))
        this.animation.remove(this.container)
        //this.container.position.y = endPos
        let ease = AnimationConfigs.stopNormal
        if (this.index == 1){
            ease = "customStopNormal1"
        }
        else if(this.index == 2){
            ease = "customStopNormal2"
        }
        else if(this.index == 3){
            ease = "customStopNormal3"
        }
        else if(this.index == 4) {
            ease = "customStopNormal4"
        }
        else if(this.index == 0){
            ease = "customStopNormal0"
        }

        this.animation = gsap.to(this.container, {
            y: endPos,
            duration: duration,
            ease: ease,
            onComplete: async () => {
                this.stopReels = false;
                this.reelStoped = true;
                if (this.index + 1 === config.reelsCount) {
                    if (this.reactiveProperty.TurboMode.value !== 3) {
                        config.SetTimeScale1();
                    }
                }
            }
        });
    }

    async StopTurbo() {
        this.animation.remove(this.container)
        this.container.position.set(this.container.position.x, this.startPositionY - config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing));
        let endPos = this.startPositionY //- (config.visibleSymbolsCount-1)*(config.symbolSize.height + config.symbolsSpacing)
        this.animation.remove(this.container)
        this.animation = gsap.to(this.container, {
            y: endPos,
            duration: config.stopDuration,
            ease: AnimationConfigs.stopNormal,
            onStart: () => {
            },
            onComplete: async () => {
                this.stopReels = false;
                this.reelStoped = true;
            }
        });

    }

    SetRamdomSymbolOnForceStop() {
        let vis = []
        for (let i = 0; i < config.visibleSymbolsCount; i++) {
            vis.push(this.symbols[i].index);
        }
        for (let i = 2 * config.visibleSymbolsCount; i < config.symbolsCount; i++) {

        }
    }

    async ForceStop() {
        await new Promise(resolve => setTimeout(resolve, 0))
        this.animation.remove(this.container)
        this.container.position.set(this.container.position.x, this.startPositionY - config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing));
        let pos = this.startPositionY;
        this.animation = gsap.to(this.container, {
            y: pos,
            duration: config.forceStopDuration,
            ease: AnimationConfigs.stopNormal,
        });
        this.stopReels = true;
        this.reelStoped = true;
    }


}
