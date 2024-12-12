// Import necessary modules or dependencies
// Assuming you have equivalent modules or services for these
// import { AssetBundleManager } from './AssetBundleManager';
// import { ReelsConfig } from './ReelsConfig';
// import { SymbolsDataConfig } from './SymbolsDataConfig';
// import { WinSymbolsConfig } from './WinSymbolsConfig';
// import { LinesConfig } from './LinesConfig';
// import { SceneReactiveProperty } from './SceneReactiveProperty';
// import { this.gameStateManager, GameState } from './this.gameStateManager';

class MatrixController {
    constructor(
                    symbolsDataConfig,
                    winSymbolsConfig,
                    linesConfig,
                    GameStateManager
                ) {

        this._reelsConfig = config;
        this._symbolsDataConfig = symbolsDataConfig;
        this._winSymbolsConfig = winSymbolsConfig;
        this._linesConfig = linesConfig;
        this._reactiveProperty = SceneReactiveProperty;
        this.gameStateManager = GameStateManager

        this.FakeBonus = false;
        this._hasWildWin = false;
        this._isWild = false;
        this._hasWin = false;
        this._hasScatterWin = false;
        this._indexSpecialSymbol = 0;
        this._winData = [];
        this._linesData = [];
        this._winSymbolsOnReel = [];
        this._expandingWild = new Array(this._reelsConfig.reelsCount).fill(0);
        this._winSymbolsOnAdditionalReel = null;
        this._additionalSymbolIndex = 0;
        this._oddMulitplayer = 1;
        this._hasFreeSpinWin = false;
        this._fakeBonus = false;

        this.NoWinData = [];
        this.LastWinData = [];

        this._specialSymbolsCount = {};
        this._specialSymbolsReelsIndex = [];

    }
    setGameStateManager(gameStateManager) {
        this.gameStateManager = gameStateManager;
    }
    // Getters and Setters
    get FakeBonus() {
        return this._fakeBonus;
    }

    set FakeBonus(value) {
        this._fakeBonus = value;
    }

    get IndexSpecialSymbol() {
        return this._indexSpecialSymbol;
    }

    get HasWildWin() {
        return this._hasWildWin;
    }

    get HasWin() {
        return this._hasWin;
    }

    get HasScatterWin() {
        return this._hasScatterWin;
    }

    get HasFreeSpinWin() {
        return this._hasFreeSpinWin;
    }

    get OddMulitplayer() {
        return this._oddMulitplayer;
    }

    set OddMulitplayer(value) {
        this._oddMulitplayer = value;
        if (!this._hasFreeSpinWin) {
            this._additionalSymbolIndex = Math.floor(this._oddMulitplayer);
        }
    }

    get WinData() {
        return this._winData;
    }

    set WinData(value) {
        this._winData = value;
    }

    get LinesData() {
        return this._linesData;
    }

    set LinesData(value) {
        this._linesData = value;
    }

    get ExpandingWild() {
        return this._expandingWild;
    }

    set ExpandingWild(value) {
        this._expandingWild = value;
    }

    // Initialization method
    initialize() {
        this.resetValues();
        this.initProperties();
        this.downloadWinSymbols();
    }

    // Reset all relevant values
    resetValues() {

        this._symbolsDataConfig.HasJackpot = this._reactiveProperty.HasJackpot.value;
        this._winSymbolsOnReel = [];
        this._specialSymbolsCount = {};
        this._specialSymbolsReelsIndex = [];
        this._oddMulitplayer = 1;
        this._indexSpecialSymbol = 0;
        this._expandingWild = new Array(this._reelsConfig.reelsCount).fill(0);
        this._hasFreeSpinWin = false;
        this._hasWin = false;
        this._hasScatterWin = false;
        this._fakeBonus = false;
        this._hasWildWin = false;
        this._winSymbolsOnReel = [];

        for (let i = this._symbolsDataConfig.SpecialSymbolsFirsIndex; i < this._symbolsDataConfig.Symbols.length; i++) {
            const symbol = this._symbolsDataConfig.Symbols[i];
            this._specialSymbolsCount[symbol.index] = 0;
        }
    }

    // Initialize reactive properties
    initProperties() {
        this._reactiveProperty.Bonus.subscribe((count) => {
            if (

                this.gameStateManager.State !== GameState.FreeSpins &&
                this._reactiveProperty.Bonus.value !== 'None' &&
                this._reactiveProperty.Bonus.value === 'FreeSpin'
            ) {
                this._hasFreeSpinWin = true;
                this._additionalSymbolIndex = 200;
            } else {
                this._hasFreeSpinWin = false;
            }
        });
    }

    // Download win symbols asynchronously
    async downloadWinSymbols() {
        const promises = [];

        this._winSymbolsConfig._winSymbols.forEach(symbolData => {
            promises.push(this.symbolItemInit(symbolData));
        });

        this._winSymbolsConfig._winSymbolsAdditionalReel.forEach(symbolData => {
            promises.push(this.symbolItemInit(symbolData));
        });

        await Promise.all(promises);
    }


    async symbolItemInit(symbolsData) {
        //symbolsData.ItemGameObject = await AssetBundleManager.Instance.downloadBundle(symbolsData.ItemReference);
    }


    getWildIndex() {
        return this._symbolsDataConfig.WildIndex;
    }


    getSpriteByIndex(index) {
        return this._symbolsDataConfig.getSymbolByIndex(index);
    }


    getWinSymbolData(index, additionalReel = false) {
        if (additionalReel) {
            return this._winSymbolsConfig._winSymbolsAdditionalReel.find(data => data.index === index) || null;
        }
        return this._winSymbolsConfig._winSymbols.find(data => data.index === index) || null;
    }


    getWinSymbolsByIndexReel(index, additionalReel = false) {
        if (additionalReel) {
            const symbol = this._symbolsDataConfig.getSymbolByIndex(this._additionalSymbolIndex, additionalReel);
            return symbol ? [symbol] : [];
        }

        if (this._winData.length > 0) {
            return this._winData[index].map(symbolIndex => this._symbolsDataConfig.getSymbolByIndex(symbolIndex, additionalReel)).filter(Boolean);
        }

        return [];
    }


    getFirstLowStopReelIndex() {
        if (this._specialSymbolsReelsIndex.length > 1) {
            const sorted = [...this._specialSymbolsReelsIndex].sort((a, b) => a - b);
            return sorted[1];
        }
        return -1;
    }


    getLastLowStopReelIndex() {
        if (this._specialSymbolsReelsIndex.length > 2) {
            const sorted = [...this._specialSymbolsReelsIndex].sort((a, b) => a - b);
            return sorted[sorted.length - 1];
        }
        return -1;
    }


    getSymbolByIndex(index, isAdditional = false) {
        return this._symbolsDataConfig.getSymbolByIndex(index, isAdditional);
    }


    getVisibilitySymbols() {
        return this._winSymbolsOnReel;
    }


    getAdditionalSymbol() {
        return this._winSymbolsOnAdditionalReel;
    }


    checkWin() {
        let symbolIndex;
        this._winSymbolsOnAdditionalReel = null;
        this._specialSymbolsReelsIndex = [];
        const scatters = [];

        if (this._linesData) {
            this._linesData.forEach((lineData, i) => {
                if (lineData.Count > 0 && lineData.Line > 0) {
                    const symbols = this._linesConfig.Lines[lineData.Line - 1].symbolIndexes;
                    lineData.Count.forEach((_, j) => {
                        this._hasWin = true;
                        symbolIndex = this._winData[symbols[j].Y][symbols[j].X];
                        if (symbolIndex === this._symbolsDataConfig.WildIndex) {
                            this._hasWildWin = true;
                        }

                        if (!this._hasWildWin && this._expandingWild[symbols[j].Y] > 0) {
                            this._hasWildWin = true;
                        }

                        this._winSymbolsOnReel.push({
                            X: symbols[j].Y,
                            Y: symbols[j].X + 2,
                            Visible: false,
                            Special: true,
                            IndexSpecialSymbol: symbolIndex,
                            LineIndex: i,
                            IsExpanding: this._expandingWild[symbols[j].Y] > 0
                        });
                    });
                } else if (lineData.Line <= 0) {
                    if (!scatters.includes(lineData.Symbol)) {
                        scatters.push(lineData.Symbol);
                        this._hasScatterWin = true;
                    }
                }
            });
        }

        scatters.forEach(scatterIndex => {
            for (let i = 0; i < this._reelsConfig.reelsCount; i++) {
                for (let j = 0; j < this._reelsConfig.visibleSymbolsCount; j++) {
                    if (this._winData[i][j] === scatterIndex) {
                        this._winSymbolsOnReel.push({
                            X: i,
                            Y: j + 2,
                            Visible: false,
                            Special: true,
                            IndexSpecialSymbol: scatterIndex,
                            LineIndex: i,
                            IsExpanding: false,
                            IsScatter: true
                        });
                    }
                }
            }
        });

        for (let i = 0; i < this._reelsConfig.reelsCount; i++) {
            for (let j = 0; j < this._reelsConfig.visibleSymbolsCount; j++) {
                symbolIndex = this._winData[i][j];
                if (symbolIndex >= 400) {
                    this._winSymbolsOnReel.push({
                        X: i,
                        Y: j + 2,
                        Visible: false,
                        Special: true,
                        IndexSpecialSymbol: symbolIndex,
                        LineIndex: -1
                    });
                    this._specialSymbolsReelsIndex.push(i);
                    this._indexSpecialSymbol = symbolIndex;
                }
            }
        }

        if (this._specialSymbolsReelsIndex.length < 3 && this._indexSpecialSymbol !== 0) {
            this._winSymbolsOnReel = [];
        } else if (this._indexSpecialSymbol > 0) {
            this._hasWin = true;
        }

        if (this._hasFreeSpinWin) {
            this._hasWin = true;
        }

        if (!this._hasWin) {
            return;
        }

        if (this._additionalSymbolIndex !== 1) {
            this._winSymbolsOnAdditionalReel = {
                X: 0,
                Y: 2,
                Visible: false,
                Special: true,
                IndexSpecialSymbol: this._additionalSymbolIndex,
                LineIndex: -1
            };
        }
    }
}
