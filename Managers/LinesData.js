class LinesData {
    symbolIndexes = []
    constructor() {
        for (let i = 0; i < config.reelsCount; i++) {
            const tempSymbolIndex = new LineSymbolIndex(i)
            this.symbolIndexes.push(tempSymbolIndex)
        }
    }
}