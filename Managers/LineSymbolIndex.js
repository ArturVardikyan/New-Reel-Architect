class LineSymbolIndex {
    x = null
    y = null
    constructor() {
        for (let i  = 0; i < LinesConfig.Lines.length; i++) {
            for (let j = 0; j < LinesConfig.Lines[i].length; j++) {
                this.x = i * LinesConfig.Lines[i][j].x;
                this.y = j * LinesConfig.Lines[i][j].y;
            }
        }

    }
}