class CancellationTokenSource {
    constructor() {
        this.isCancellationRequested = false;
        this.listeners = [];
    }

    cancel() {
        this.isCancellationRequested = true;
        this.listeners.forEach((callback) => callback());
    }

    isCancellationRequested() {
        return this.isCancellationRequested;
    }

    onCancellationRequested(callback) {
        if (this.isCancellationRequested) {
            callback();
        } else {
            this.listeners.push(callback);
        }
    }
}