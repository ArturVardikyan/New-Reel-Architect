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

        console.log("InitStartPosition" + this.startPositionY,);
    }

    ResetReelPosition() {
        if (this.animation) {
            this.animation?.kill();
        }
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
        //this.SetRandomSymbolsOnLoop()
        // if (gsap.getById("loop" + this.index)){
        //     gsap.getById("loop" + this.index).kill()
        // }
        let pos0 = 0
        let pos = 0
        let duration = 0
        //pos0 = this.startPositionY - config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing)
        if(this.reactiveProperty.TurboMode.value === 1){
            pos0 = this.startPositionY - config.visibleSymbolsCount*(config.symbolSize.height + config.symbolsSpacing)
            pos = this.startPositionY + config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing);
             duration = (config.speedDuration * 1000)
            if (this.firstLoop == true){
                this.SetRandomSymbolsOnLoopStartMode1()
            }


        }
        else if (this.reactiveProperty.TurboMode.value === 2){
            pos0 = this.startPositionY - (config.visibleSymbolsCount-2)*(config.symbolSize.height + config.symbolsSpacing)
            pos = this.startPositionY + (config.visibleSymbolsCount-1)* (config.symbolSize.height + config.symbolsSpacing);
            duration = (config.speedFastDuration * 1000)
            console.log("first loop = " + this.firstLoop)
            if (this.firstLoop == true){
                this.SetRandomSymbolsOnLoopStartMode2()
            }

        }

        else if (this.reactiveProperty.TurboMode.value === 3){
            // pos0 = this.startPositionY - config.visibleSymbolsCount*(config.symbolSize.height + config.symbolsSpacing)
            // pos = this.startPositionY + config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing);
            // duration = (config.speedDuration * 1000)
            // this.SetRandomSymbolsOnLoopStartMode1()
        }


        this.container.position.set(this.container.position.x, pos0);

        // let pos = this.startPositionY + config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing);
        let currentDuration = config.speedDuration;


        let firstLoop = true
        let self = this;
        this.animation = anime({
            targets: this.container,
            y: pos,
            duration: duration,
            easing: AnimationConfigs.loop,
            loop: -1,
            loopBegin: async () => {
                if (!firstLoop) {
                    if (this.reactiveProperty.TurboMode.value === 1 ){
                        this.SetRandomSymbolsOnLoopMode1()
                    }
                    else if(this.reactiveProperty.TurboMode.value === 2){
                        this.SetRandomSymbolsOnLoopMode2()
                    }
                }
                firstLoop = false
                if (!this.reactiveProperty.IsReelsRotate.value) {
                    this.StopCheck();
                }
            },
            complete: () => {
                //    console.log("Animation complete");
            }
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
        console.log("RotateReel" + this.index);
        this.hasWildSymbol = false;
        this.hasJackpotSymbol = false;
        this.hasScatterSymbol = false;
        this.slowMode = false;
        this.force = false;
        this.reelStoped = false;
        this.RotateLoop();
    }

    async StopCheck() {
        const { ForceStop, IsReelsRotate} = this.reactiveProperty;
        if (ForceStop.value) {
            this.ForceStop();
            return;
        }
        if (IsReelsRotate.value) {
            return;
        }

        const canStop = ReelsStops[this.index]
        const {TurboMode} = this.reactiveProperty;
        if (canStop && TurboMode.value === 1) {
            this.StopNormalDataManagment();
        }
        else if(TurboMode.value === 2){
           // if(this.index === 0){
               this.StopFast()
           //}
           // else if(this.index === 1){
           //     await new Promise(resolve => setTimeout(resolve, 0))
           //     this.animation.remove(this.container)
           //     this.StopFast()
           // }
           // else if(this.index === 2){
           //     await new Promise(resolve => setTimeout(resolve, 20))
           //     this.animation.remove(this.container)
           //
           //     this.StopFast()
           // }
           // else if(this.index === 3){
           //     await new Promise(resolve => setTimeout(resolve, 30))
           //     this.animation.remove(this.container)
           //
           //     this.StopFast()
           // }
           // else if(this.index === 4){
           //     await new Promise(resolve => setTimeout(resolve, 40))
           //     this.animation.remove(this.container)
           //
           //     this.StopFast()
           // }

        }

    }

    NormalizeWinSymbols() {
        for (let i = 0; i < this.WinReelSymobls.length; i++) {
            this.WinReelSymobls[i].container.position.y = this.symbols[0].container.position.y - ((i + 1) * config.symbolSize.height);
        }
    }


    SetRandomSymbolsOnLoopStartMode2() {
        let symbolsVisible = []
        for (let i = config.visibleSymbolsCount; i < config.visibleSymbolsCount*2; i++) {
            symbolsVisible.push(this.symbols[i].index);

        }
        for (let i = config.symbolsCount-config.visibleSymbolsCount*2+1; i < config.symbolsCount-config.visibleSymbolsCount+1; i++) {
            this.symbols[i].SetSymbolByIndex(symbolsVisible[i - config.visibleSymbolsCount-1])
        }
        for (let i = 0; i < 4; i++) {
            this.symbols[i].SetRandomSymbol()
        }
    }
    SetRandomSymbolsOnLoopStartMode1() {
        let symbolsVisible = []
        for (let i = config.visibleSymbolsCount; i < 2 * config.visibleSymbolsCount; i++) {
            symbolsVisible.push(this.symbols[i].index);
        }
        for (let i = config.symbolsCount - config.visibleSymbolsCount; i < config.symbolsCount; i++) {
            this.symbols[i].SetSymbolByIndex(symbolsVisible[i - 2 * config.visibleSymbolsCount])
        }
        for (let i = 0; i < config.symbolsCount - config.visibleSymbolsCount; i++) {
            this.symbols[i].SetRandomSymbol()
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
    SetRandomSymbolsOnLoopMode2(/*visibleStartIndex,visibleEndIndex*/) {
        let symbolsVisible = []

        for (let i = 1; i < config.visibleSymbolsCount+1; i++) {
            symbolsVisible.push(this.symbols[i].index);

        }
        for (let i = config.symbolsCount - config.visibleSymbolsCount * 2+1; i < config.symbolsCount-config.visibleSymbolsCount+1 ; i++) {
            this.symbols[i].SetSymbolByIndex(symbolsVisible[i - config.visibleSymbolsCount-1])
        }
        for (let i = 0; i < config.visibleSymbolsCount; i++) {
            this.symbols[i].SetRandomSymbol()
        }
    }
    StopNormalDataManagment(force, slowStop = false) {

        if (this.stopReels) {
            if (force && this.reactiveProperty.TurboMode.value === 3) {
                this.ForceStop();
            }
            return;
        }

        this.slowMode = slowStop;
        this.force = force;

        if (force) {
            this.ForceStop();
            console.log("FORCE STOP")
            return;
        }

        if (!slowStop) {
            this.StopNormal(force)
        }

        this.stopReels = true;
    }

   async StopNormal(force) {
        //let duration = force ? config.stopDuration / 1.5 : config.stopDuration;
        let   duration = config.stopDuration
        let endPos= this.startPositionY
        await new Promise(resolve => setTimeout(resolve, 0))
        this.animation.remove(this.container)
        this.animation = gsap.to(this.container, {
            y:endPos,
            duration: duration,
            ease: AnimationConfigs.stopNormal,
            onStart: () => {
                if (this.reactiveProperty.TurboMode.value === 1){
                    if (this.index !== 4) {
                        ReelsStops[this.index + 1] = true;
                    }
                }
            },
            onComplete: async () => {
                if (this.reactiveProperty.TurboMode.value == 1){
                    this.ResetReelPosition();
                }
                //
                this.stopReels = false;
                this.reelStoped = true;
                if (this.index + 1 === config.reelsCount) {
                    if (this.reactiveProperty.TurboMode.value !== 3) {
                        config.SetTimeScale1();
                    }
                }
                if (this.index === 4) {
                    for (let i = 1; i < config.reelsCount; i++) {
                        ReelsStops[i] = false;
                    }
                }
                //this.StopEasing()
            }
        });
    }
    async StopFast(){
        let duration = config.stopFastDuration
         let endPos = this.startPositionY + (config.visibleSymbolsCount-1)* (config.symbolSize.height + config.symbolsSpacing);
        // let start

        //this.container.position.y = endPos;
        await new Promise(resolve => setTimeout(resolve, this.index !== 0? this.index*50 : 0))
        this.animation.remove(this.container)
        this.animation = gsap.to(this.container, {
            y:endPos,
            duration: duration,
            ease: AnimationConfigs.stopFast,
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
    ForceStop() {
        if (this.animation) {
            this.animation?.kill();
        }

        console.log("force")

        //this.container.position.y = this.startPositionY-config.visibleSymbolsCount*(config.symbolSize.height+config.symbolsSpacing);
        //this.container.position.y = ( this.startPositionY + config.symbolSize.y * 2);
        if (gsap.getById("introSecond" + this.index)) {
            gsap.getById("introSecond" + this.index).kill()
        }
        if (gsap.getById("intro" + this.index)) {
            gsap.getById("intro" + this.index).kill()
        }
        if (gsap.getById("loop" + this.index)) {
            gsap.getById("loop" + this.index).kill()
        }
        let pos = this.startPositionY;
        this.animation = gsap.to(this.container, {
            y: pos,
            duration: config.forceStopDuration,
            ease: AnimationConfigs.forceStop,
            onComplete: () => {
                if (this.index == 4) {
                    for (let i = 1; i < config.reelsCount; i++) {
                        this.reactiveProperty.CanCallStop.value[i] = false;
                    }
                }

            }
        });
        this.stopReels = true;
        this.reelStoped = true;
        if (this.hasWildSymbol) {
            //SoundManager.Instance.PlayWildSound();
        }
        if (this.hasScatterSymbol) {
            //SoundManager.Instance.PlayScatterSound();
        }
        //SoundManager.Instance.PlayStopReelSound();
    }


}
