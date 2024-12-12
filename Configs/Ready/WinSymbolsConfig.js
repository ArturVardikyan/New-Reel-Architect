class WinSymbolsConfig
{
        _winSymbols = [] ;
        _winSymbolsAdditionalReel = []

        OnValidate() {
            for (let winSymbol of this._winSymbols) {
                winSymbol.ItemGameObject = null;
            }
            for(let winSymbol of this._winSymbolsAdditionalReel) {
                winSymbol.ItemGameObject = null;
            }
        }
}
