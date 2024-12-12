class SmallReel {
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


        //this.symbolsIndex = new int[_reelsConfig.VisibleSymbolsCount * _symbolsCountMultiplier];
        this.symbolsIndex = [];
        //this.symbolsData = new SymbolsData[_reelsConfig.VisibleSymbolsCount * _symbolsCountMultiplier];
        this.symbolsData = []
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
        //CustomEase.create("custom", "M0,0 C0,0 0.1,0.2 0.2,0.4 0.3,0.6 0.4,0.8 0.5,1 0.6,1.2 0.7,1.3 1,1 ")
        //CustomEase.create("custom", "M0,0 C0,0 0.1,0.2 0.2,0.4 0.3,0.6 0.4,0.8 0.5,1 0.6,1.2 0.55,1.287 1,1 ")
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
            this.SetRandomSymbolsOnLoopStartMode1()

        }
        else if (this.reactiveProperty.TurboMode.value === 2){
            pos0 = this.startPositionY - (config.visibleSymbolsCount-2)*(config.symbolSize.height + config.symbolsSpacing)
            pos = this.startPositionY + (config.visibleSymbolsCount-1)* (config.symbolSize.height + config.symbolsSpacing);
            duration = (config.speedDuration * 1000/9*5)
            this.SetRandomSymbolsOnLoopStartMode2()

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
                if(this.reactiveProperty.TurboMode.value !== 3){
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
                else if(this.reactiveProperty.TurboMode.value === 2){
                    await new Promise(resolve => setTimeout(resolve, 400))
                }
                if (!this.reactiveProperty.IsReelsRotate.value) {
                    this.Repeat();
                }
            },
            complete: () => {
                //    console.log("Animation complete");
            }
        });
        if (this.index === 4) {
            this.reactiveProperty.SpinLocked.value = false;
        }

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

    Repeat() {
        const { ForceStop, IsReelsRotate } = this.reactiveProperty;
        if (ForceStop.value) {
            this.ForceStop();
            return;
        }
        if (IsReelsRotate.value) {
            return;
        }
        const canStop = ReelsStops[this.index]
        if (canStop) {
            this.Stop();
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
            console.log(i);
        }
        // for (let i = config.symbolsCount-config.visibleSymbolsCount-1; i < config.symbolsCount-1; i++) {
        //     this.symbols[i].SetSymbolByIndex(symbolsVisible[i - config.visibleSymbolsCount-1])
        // }
        // for (let i = 2; i < 4; i++) {
        //     this.symbols[i].SetRandomSymbol()
        // }
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
    SetRandomSymbolsOnLoopMode2() {
        let symbolsVisible = []
        for (let i = 1; i < config.visibleSymbolsCount+1; i++) {
            symbolsVisible.push(this.symbols[i].index);

        }
        for (let i = config.symbolsCount - config.visibleSymbolsCount * 2 + 1; i < config.symbolsCount-config.visibleSymbolsCount + 1; i++) {
            this.symbols[i].SetSymbolByIndex(symbolsVisible[i - config.visibleSymbolsCount-1])}
        for (let i = 1; i < config.visibleSymbolsCount+1; i++) {
            this.symbols[i].SetRandomSymbol()
        }
    }
    Stop(force, slowStop = false) {

        if (this.stopReels) {
            if (force && this.reactiveProperty.TurboMode.value) {
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
            this.StopSecond(force)
        }

        this.stopReels = true;
    }

    StopSecond(force) {
        let duration = force ? config.stopDuration / 1.5 : config.stopDuration;
        this.animation.remove(this.container)
        let endPos = 0
        if (this.reactiveProperty.TurboMode.value === 1 ){
            endPos = this.startPositionY
        }
        else {
            endPos = this.startPositionY + (config.visibleSymbolsCount-1)* (config.symbolSize.height + config.symbolsSpacing);
        }
        this.animation = gsap.to(this.container, {
            y:endPos,
            duration: duration,
            ease: "custom",
            onStart: () => {
                if (this.index !== 4) {
                    ReelsStops[this.index + 1] = true;
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

    StopReel(force = false) {
        if (this.force) {
            this.ForceStop();
            console.log("ForceStop");
            return;
        }

        //this.NormalizationSymbols(false);
        let duration = force ? config.stopDuration / 1.5 : config.stopDuration;
        //this.ChangeSymbolsForStop()
        let posStart = this.startPositionY - config.visibleSymbolsCount * (config.symbolSize.height + config.symbolsSpacing)
        let nowPos = this.container.position.y
        let deference = posStart - nowPos
        console.log(deference)
        this.container.position.y = posStart;
        if (this.slowMode && !force) {
            duration = config.stopSlowDuration;
        }

        //SoundManager.Instance.PlayStopReelSound();
        if (this.hasWildSymbol) {
            //SoundManager.Instance.PlayWildSound();
        }

        if (this.hasJackpotSymbol) {
            //SoundManager.Instance.PlayJackpotSymbolSound();
        }

        if (this.hasScatterSymbol) {
            //SoundManager.Instance.PlayScatterSound();
        }

        if (gsap.getById("loop" + this.index)) {
            gsap.getById("loop" + this.index).kill()
        }


        let pos = this.startPositionY;
        let easeDuration = this.slowMode && this.additionalReel ? 2.5 : 1;
        if (this.index == 0) {
            this.animation = gsap.to(this.container, {
                y: pos,
                duration: duration,
                ease: "custom",
                onComplete: () => {
                    // console.log("complete")
                    this.ResetReelPosition();
                    this.stopReels = false;
                    this.reelStoped = true;
                    this.loops = []
                    //this.compositeDisposable?.Dispose();
                    //console.log(this.animation)
                    this.animation.kill();
                    //console.log(this.animation)
                    if (this.index + 1 == config.reelsCount) {
                        if (this.reactiveProperty.TurboMode.value !== 3) {
                            config.SetTimeScale1();
                        }
                    }

                }
            });
        }


    }

}
