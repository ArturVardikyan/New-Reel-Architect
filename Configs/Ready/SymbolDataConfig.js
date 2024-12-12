class SymbolDataConfig {
    constructor() {
        this.Symbols = []
        for (let i = 0; i < 9; i++) {
            let tempSymbol = new SymbolData(i,symbolConfig[i],symbolConfig[i])
            this.Symbols.push(tempSymbol)
        }
        this.AdditionalSymbols = []
        this.SpecialSymbolsFirsIndex = 10;
        this.SymbolStartIndex = 0;
        this.WildIndex = 9;
        this.ScatterIndexes = [10,11]
        this.HasJackPot = false;
    }
    GetSymbolByIndex(index, additional = false) {
        const targetArray = additional ? this.AdditionalSymbols : this.Symbols;
        for (let i = 0; i < targetArray.length; i++) {
            if (targetArray.index === index){
                return this.Symbols[i]
            }


        }
        return null
    }
    GetRandomSymbol(additional = false) {
        const targetArray = additional ? this.AdditionalSymbols : this.Symbols;
        const startIndex = this.SymbolStartIndex;
        const endIndex = additional
            ? targetArray.length
            : this.HasJackPot
                ? targetArray.length
                : targetArray.length - 4;

        const randomIndex = Math.floor(Math.random() * (endIndex - startIndex)) + startIndex;

        return targetArray[randomIndex];
    }
}