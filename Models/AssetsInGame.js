class AssetsInGame {
    constructor(symbolData) {
        this.Symbols = []
        this.Init(symbolData)
    }
    async Init(symbolData){
        for (let i = 0; i < 9; i++) {
            let Texture =  await Assets.load(symbolData.Symbols[i].image);
            // console.log(Texture)
            // console.log("loaded")
            this.Symbols.push(Texture);
        }
    }
}