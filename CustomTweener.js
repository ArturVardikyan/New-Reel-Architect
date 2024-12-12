class CustomTweener {
    constructor({
                    container,
                    fromY,
                    toY,
                    duration,
                    ease,
                    repeat = 0,
                    onRepeat,
                    onUpdate,
                    onComplete
                }) {
        this.container = container;
        this.fromY = fromY;
        this.toY = toY;
        this.duration = duration;
        this.ease = ease;
        this.repeat = repeat;
        this.onRepeat = onRepeat;
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;

        this._currentRepeat = 0;
        this._startTime = null;
        this._isRunning = false;
    }

    start() {
        this._isRunning = true;
        this._startTime = performance.now();
        this._animate();
    }

    stop() {
        this._isRunning = false;
    }

    _animate() {
        if (!this._isRunning) return;
        const now = performance.now();
        const elapsed = now - this._startTime;
        let progress = elapsed / (this.duration * 1000);
        if (progress > 1) progress = 1;

        const easedProgress = this.ease ? this.ease(progress) : progress;
        const currentY = this.fromY + (this.toY - this.fromY) * easedProgress;

        if (this.onUpdate) {
            this.onUpdate(currentY, progress);
        }

        //this.container.style.transform = `translateY(${currentY}px)`;

        if (progress < 1) {
            requestAnimationFrame(this._animate.bind(this));
        } else {
            // Окончание одного цикла
            if (this.repeat === -1 || this._currentRepeat < this.repeat) {
                // Запускаем заново
                this._currentRepeat++;
                if (this.onRepeat) {
                    this.onRepeat();
                }
                // Перезапустить анимацию с нуля
                this._startTime = performance.now();
                requestAnimationFrame(this._animate.bind(this));
            } else {
                // Анимация завершена
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }
    }
}


// Пример использования:



