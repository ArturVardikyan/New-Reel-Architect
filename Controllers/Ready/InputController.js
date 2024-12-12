

class InputController  {
      Spin
      AutoplaySpin
      AnyKeyIsPressed
      EscapePressed
     constructor() {
         this.Spin = new rxjs.Subject()
         this.AnyKeyIsPressed = new rxjs.Subject()
         this.AutoplaySpin = new rxjs.Subject()
         this.EscapePressed = new rxjs.Subject()
         this.Init()
    }

    Init() {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.Spin?.next();
                setTimeout(() => {
                    if (!SceneReactiveProperty.ForceStop.value){
                        SceneReactiveProperty.IsReelsRotate.value = false
                    }

                }, config.speedDuration*1000*2);
            }
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.EscapePressed?.next();
            }
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'R') {
                window.location.reload(true);

            }
        });
    }
}
