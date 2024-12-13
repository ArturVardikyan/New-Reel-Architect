// No imports needed since RxJS is included via script tags

class ReactiveProperty {
    constructor(initialValue) {
        this._subject = new rxjs.BehaviorSubject(initialValue);
        this._observable = this._subject.asObservable().pipe(
            rxjs.operators.distinctUntilChanged()
        );
    }

    // Getter for the current value
    get value() {
        return this._subject.getValue();
    }

    // Setter for updating the value
    set value(newValue) {
        if (newValue !== this._subject.getValue()) {
            this._subject.next(newValue);
        }
    }

    // Subscribe to value changes
    subscribe(observer) {
        return this._observable.subscribe(observer);
    }

    // Convert to observable for advanced operations
    asObservable() {
        return this._observable;
    }

    // Clean up resources
    dispose() {
        this._subject.complete();
    }
}

// No export statement needed
