
class WinSymbolsData {
    constructor(index, itemReference, itemGameObject = null) {
        this.index = index;
        this.itemReference = itemReference;
        this.itemGameObject = itemGameObject;
    }


    resetItemGameObject() {
        this.itemGameObject = null;
    }
}
