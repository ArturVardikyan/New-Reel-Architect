class GameStateManager {
    // [DllImport("__Internal")]
    //  static extern HideLoading();
    // [DllImport("__Internal")]
    //  static extern GameReady();
    //
    // [DllImport("__Internal")]
    //  static extern PostRequest();
    //
    // [DllImport("__Internal")]
    //  static extern ReloadApp();
    //
    // [DllImport("__Internal")]
    //  static extern Reload();


    constructor(ReloadAction) {

        // this.Instance = this;
        this._isDemo = true;
        this._accessToken = ""
        this._tournamentId = "";
        this.PartnerId = 4;
        this.GameId = 114;
        this.Currency = "Fun";
        this.Language = "en";
        this.Url = "https://pg-stage.rpd.cloud";
        this.Reload = ReloadAction;
        this._paramsIsValid = false;
        this._authIsValid = false;
        this.MobileDevice = false;
        this._isRunning = false;
        this._sceneReactiveCommands = SceneReactiveCommands

        this.IosDevice = new ReactiveProperty(false);
        this.IsMobile = new ReactiveProperty(false);
        this.FullScreen = new ReactiveProperty(false);
        this.MobileIsRotate = new ReactiveProperty(false);
        this.GameFreez = new ReactiveProperty(false);
        this.State = undefined

        this._state = new ReactiveProperty<GameState>(null);
        this._previewState = null;


        this.onStateChange = new rxjs.Subject();

        this._subscriptions = [];
        this._reactiveProperty = SceneReactiveProperty
    }
    SetConnectionService(connectionService) {
        this._connection = connectionService
        this.initialize()
    }
    initialize() {
        app.targetFrameRate = 60;
        this.IsMobile.value = Screen.width < Screen.height;
        console.log("GameStateManager Initialization");
        this._sceneReactiveCommands.Reconnect.subscribe(action => {
            this.Reconnecting()
        })
        if (true){
            this.Authenticated();
        }
        else {
            //this.PostRequest();
        }


        //this.StartSessionTimeDetection();
        //this.DontDestroyOnLoad(this);
        //GC.Collect();
        //Resources.UnloadUnusedAssets();
        //AtlasUtilities.ClearCache();
        //AssetBundle.UnloadAllAssetBundles(true);
        // SetResolution("1920/1080/2");
        // DetectScreenOrientation();
    }

    SetState(value) {
        if (value !== this._state) {
            this._previewState = this._state;
            console.log("GameState " + value);
            this._state = value;
            this._sceneReactiveCommands.OnActionChange?.next(this._state);
        }
    }

    GetState() {
        return this._state
    }

    OnApplicationQuit() {
        // AssetBundle.UnloadAllAssetBundles(true);
        // AtlasUtilities.ClearCache();
        // Resources.UnloadUnusedAssets();
        // GC.Collect();
        console.log("Quitting the Player");
    }

    Start() {
        // #if UNITY_EDITOR
        //      this._paramsIsValid = true;
        // Authenticated();
        // #else
        //
        // #endif
    }

    IOSDetected() {
        this.IosDevice.value = true;
    }

    Mute(mute) {
        AudioListener.pause = (mute === 1);
        if (AudioListener.pause) {
            this.GameFreez.value = true;
            this.StartSessionTimeDetection();
            // GameFreez.value = true;
            // _sessionOverStartTime = System.DateTime.Now;
        } else {
            this.EndSessionTimeDetection();
        }
    }

    StartSessionTimeDetection() {
       // this._sessionOverStartTime = System.DateTime.Now;////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    EndSessionTimeDetection() {
        // if ((System.DateTime.Now - _sessionOverStartTime).TotalMinutes >= 15) {/////////////////////////////////////////////////////////////////////////////////
        //     this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
        //     this._reactiveProperty.Validation.value = ValidationType.SESSION_INACTIVE;
        //     this.Disconnect();
        //     console.log("Disconnect");
        // } else {
        //     this.GameFreez.value = false;
        // }
    }


    Disconnect() {
        this._connection?.Disconnect();
        //this.JackpotsManager.Instance.CloseConnection();//////////////////////////////
    }

    SetResolution(data) {
        console.log(data);
        let values = data.Split('/');
        let width = parseInt(values[0]);
        let height = parseInt(values[1]);
        let ratio = parseInt(values[2]);
        Screen.SetResolution(width, height, false, ratio);
    }

    Reconnecting(action = null) {
        if (this._reactiveProperty.TWO_Device.value) {
            return;
        }
        if (action == null) {
            this.StopAllCoroutines();
            this.JackpotsManager.Instance.CloseConnection();
            return;
        }
        this.JackpotsManager.Instance.CloseConnection(() => {
            this.StartCoroutine(this.CheckInternetConnection(() => {
                action?.call();
            }));
        });
    }

    //   CheckInternetConnection( action) {
    //      let connected = false;
    //     const _echoServer = "https://www.google.com/";
    //     UnityWebRequest _request = UnityWebRequest.Head(_echoServer);
    //     var wait  = new WaitForSeconds(2);
    //     while (!connected) {
    //         yield return wait;
    //         _request = UnityWebRequest.Head(_echoServer);
    //         this._request.timeout = 5;
    //         yield return _request.SendWebRequest();
    //         connected = !_request.isNetworkError;
    //         if (Application.isEditor)
    //             console.log("Connecting " + connected);
    //     }
    //     action?.next();
    // }

    OrientationChange(angle) {
        if (this.MobileDevice) {
            this.MobileIsRotate.value = !(angle === 0 || angle === 180);
        }

        // IsMobile.value = angle is 0 or 180;
        this.AfterOrientationChange();
    }

    Authenticated() {
        this._authIsValid = true;
        this._paramsIsValid = true
        if (this._reactiveProperty.TWO_Device.value || !this._paramsIsValid) {
            return;
        }
        if (this.Language === "fa") {
            this.Language = "en";
        }


        if (this.Language === "ar") {
            this.Language = "en";
        }
        this._connection.Connect();
        this._sceneReactiveCommands.ConnectToTranslate?.next(() => {
            console.log("Connect")


        });
    }

    SetAccessToken(accessToken) {
        console.log("SetAccessToken() " + accessToken);
        this._accessToken = accessToken;
    }

    async AfterOrientationChange() {
        await this.WaitForNextFrame()
        await this.WaitForNextFrame()
        await this.WaitForNextFrame()
        await this.WaitForNextFrame()
        // this._sceneReactiveCommands.OnActionChange?.next(_state);
    }

    FullScreenChange() {
        this.FullScreen.value = !this.FullScreen.value;
    }

    ReloadScene() {
        // SceneManager.LoadScene(0);
        //
        // #if UNITY_EDITOR
        // SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        // #else
        // ReloadApp();
        // #endif
    }

    SetMobileState() {
        this.MobileDevice = true;
        this.IsMobile.value = MobileDevice;
    }

    SetQueryParams(queryParams) {
        let url = new URL(queryParams);
        let origin = `${url.protocol}//${url.host}`;
        if (origin) {
            this.Url = origin;
        }
        let queryParamsObj = new URLSearchParams(url.search);
        let mode = queryParamsObj.get("mode");
        let partnerId = queryParamsObj.get("partnerId");
        let gameId = queryParamsObj.get("gameId");
        let currency = queryParamsObj.get("currency");
        let language = queryParamsObj.get("lan");
        let tournamentId = queryParamsObj.get("tournamentId");
        if (!language) {
            language = queryParamsObj.get("language");
        }
        if (!language) {
            language = queryParamsObj.get("culture");
        }
        if (language) {
            this.Language = language;
        }
        if (tournamentId) {
            this._tournamentId = tournamentId;
        }
        if (mode) {
            this._isDemo = (mode !== "real");
        }

        if (partnerId) {
            const parsedPartnerId = parseInt(partnerId, 10);
            if (!isNaN(parsedPartnerId)) {
                this.PartnerId = parsedPartnerId;
            }
        }

        if (gameId) {
            const parsedGameId = parseInt(gameId, 10);
            if (!isNaN(parsedGameId)) {
                this.GameId = parsedGameId;
            }
        }

        if (currency) {
            this.Currency = currency;
        }

        if (this._isDemo) {
            this.Authenticated();
        }

        this._paramsIsValid = true;
        if (this._authIsValid) {
            this.Authenticated();
        }
        console.log(`GameMode= ${mode}   ${this._isDemo}`);
    }


    SetLayerSwitch(layer) {
        this._blackSwitchLayer = layer;
    }

    FadeIn(duration = 0.5) {
        //this._blackSwitchLayer.FadeIn(duration);
    }

    FadeOut(duration = 0.5) {
        this._blackSwitchLayer.FadeOut(duration);
        if (this._isRunning) return;
        // #if !UNITY_EDITOR
        // HideLoading();
        // GameReady();
        // #endif
        this._isRunning = true;
    }

    ReloadPlatform() {
        this.Reload();
    }

    WaitForNextFrame() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                resolve();  // Resolves when the next frame is rendered
            });
        });
    }

    SubscribeOnStateChange(action) {
        this._sceneReactiveCommands.OnActionChange.subscribe(_ => {
            action()
        });
    }
}