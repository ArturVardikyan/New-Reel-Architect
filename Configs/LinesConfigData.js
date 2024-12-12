class LinesConfigData {
    Lines = []
    constructor () {
        for (let i = 1; i <= LinesConfig.LinesCount; i++) {
            const tempLine = new LinesData()
            this.Lines.push(tempLine)
        }
    }
}