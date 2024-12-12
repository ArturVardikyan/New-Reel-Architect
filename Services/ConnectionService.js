class ConnectionService {
    constructor(matrixController) {
        this._serverConfig = ServerConfig;
        this._uiReactive = UiReactive;
        this._matrixController = matrixController;
        this._reactiveProperty = SceneReactiveProperty;
        this._gameStateManager = null;
        this._sceneReactiveCommands = SceneReactiveCommands;

        this._signalR = null;
        this._tryToReconnect = false;
        this._disposableReconnect = null;
        this._disposableGetBalance = null;
        this._win = 0;
        this._onConnectAction = null;
        this._actionBonusSpinResponse = null;
        this._actionBonusPickResult = null;
    }

    Initialize() {
        // Инициализация при необходимости
    }
    setGameStateManager(gameStateManager) {
        this._gameStateManager = gameStateManager;
    }
    disconnect() {
        if (this._signalR && this._signalR.HubConnection) {
            this._signalR.HubConnection.stop().catch(err => console.error('Ошибка при отключении:', err));
        }
    }

    Connect(actionOnConnect = null) {
        if (this._signalR) {
            if (this._signalR.HubConnection.state === 'Connected') {
                console.log("Попытка подключения, уже подключено.");
                return;
            }
        }

        // console.log("Подключение с токеном " + this._gameStateManager._accessToken);

        setTimeout(() => {
            // Очистка подписок
            if (this._disposableReconnect) {
                this._disposableReconnect.unsubscribe();
                this._disposableReconnect = null;
            }
            if (this._disposableGetBalance) {
                this._disposableGetBalance.unsubscribe();
                this._disposableGetBalance = null;
            }

            this._serverConfig.IsDemo = this._gameStateManager.IsDemo;

            // Инициализация SignalR
            this._signalR = new signalR.HubConnectionBuilder()
                .withUrl(this._gameStateManager.Url + this._serverConfig.ServerURL, {
                    accessTokenFactory: () => this._gameStateManager._accessToken
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.registerListeners();

            this._onConnectAction = actionOnConnect;

            this._signalR.onreconnected(this.Reconnected.bind(this));
            this._signalR.onreconnecting(this.OnReconnecting.bind(this));
            this._signalR.onclose(this.OnConnectionClosed.bind(this));

            this._signalR.start()
                .then(() => {
                    this.OnConnect();
                })
                .catch(err => console.error('Ошибка подключения:', err));
        }, 0);
    }

    registerListeners() {
        if (this._serverConfig.IsDemo) {
            this._signalR.on("DemoInitialStateResult", this.OnDemoInitialState.bind(this));
            this._signalR.on("DemoSpinResult", this.OnDemoSpinResponse.bind(this));
            this._signalR.on("DemoBonusSpinResult", this.OnDemoBonusSpinResponse.bind(this));
            this._signalR.on("DemoBonusGameResult", this.OnDemoBonusPickResult.bind(this));
        } else {
            this._signalR.on("InitialStateResult", this.OnInitialState.bind(this));
            this._signalR.on("SpinResult", this.OnSpinResponse.bind(this));
            this._signalR.on("BonusSpinResult", this.OnBonusSpinResponse.bind(this));
            this._signalR.on("GetBalanceResult", this.OnGetBalanceResponse.bind(this));
            this._signalR.on("BonusGameResult", this.OnDemoBonusPickResult.bind(this));
            this._signalR.on("FreeBetAwarded", this.OnFreeBetAwarded.bind(this));
            this._signalR.on("JackpotSceneItemResult", this.OnJackpotSceneItemResult.bind(this));
            this._signalR.on("JackpotSceneResult", this.OnJackpotSceneResult.bind(this));
            this._signalR.on("GameOpen", this.GameOpen.bind(this));

            this._disposableGetBalance = this._reactiveProperty.CurrentStateConfig.subscribe(_ => {
                if (_ === CurrentState.Show && this._win > 0 && this._gameStateManager.State === GameState.Normal && this._reactiveProperty.Validation.value === ValidationType.SUCCESS) {
                    this.GetBalance();
                }

                if (_ === CurrentState.None && this._uiReactive.QuickBets.value != null &&
                    this._gameStateManager.TournamentId && this._gameStateManager.TournamentType === MoneyType.Real && this._reactiveProperty.Validation.value === ValidationType.SUCCESS) {
                    this.CheckTournamentBalance();
                }
            });
        }

        this._signalR.on("MaintenanceNotify", this.OnMaintenanceNotify.bind(this));
    }

    OnFreeBetAwarded(result) {
        const Result = { ...result }; // Предполагается, что result уже является объектом
        if (Result.GameId !== this._gameStateManager.GameId) {
            return;
        }

        this._reactiveProperty.UserFreeBets.value = Result.FreeBets;
    }

    OnMaintenanceNotify(result) {
        const Result = { ...result };
        if (Result.GameId !== this._gameStateManager.GameId) {
            return;
        }

        const now = new Date();
        const startDate = new Date(Result.StartDate);
        const diffSeconds = (now - startDate) / 1000;

        if (diffSeconds > -Result.NotifySeconds) {
            this._reactiveProperty.MaintenanceData.value = Result;
            this._uiReactive.MaintenanceSecond.value = Math.floor(-diffSeconds);
            this._uiReactive.IsOnMaintenance.value = true;
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.PopUp;
            this._reactiveProperty.Validation.value = ValidationType.MAINTENANCE_NOTIFY;
        }
    }

    OnConnectionClosed(error) {
        this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
        this._reactiveProperty.Validation.value = ValidationType.SESSION_INACTIVE;
    }

    OnConnectionLost(connection, message) {
        console.log("OnConnectionLost " + message);
        console.log("OnConnectionLost State: " + connection.state);

        if (connection.state === 'Disconnected') {
            this._tryToReconnect = true;
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
            this._reactiveProperty.Validation.value = ValidationType.CONNECTION_RECONNECTING;

            if (this._sceneReactiveCommands.Reconnect) {
                this._sceneReactiveCommands.Reconnect.next(() => {
                    this.Connect();
                });
            }

            this._disposableReconnect = setTimeout(() => {
                this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
                this._reactiveProperty.Validation.value = ValidationType.INTERNET_CONNECTION_LOST;
                if (this._sceneReactiveCommands.Reconnect) {
                    this._sceneReactiveCommands.Reconnect.next(null);
                }
            }, 4000); // Задержка 4 секунды
        } else {
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
            this._reactiveProperty.Validation.value = ValidationType.INVALID_TOKEN;
        }
    }

    OnReconnecting(error) {
        console.log("OnReconnecting " + error.message);
        this._tryToReconnect = true;
        this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
        this._reactiveProperty.Validation.value = ValidationType.CONNECTION_RECONNECTING;
    }

    Reconnected(connectionId) {
        console.log("Reconnected ");
        this._reactiveProperty.ValidationActionConfig.value = ValidationAction.None;
        this._reactiveProperty.Validation.value = ValidationType.SUCCESS;
    }

    GameOpen(response) {
        const Response = { ...response };
        if (Response.ConnectionId !== this._signalR.connectionId && Response.GameId === this._serverConfig.GameId) {
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
            this._reactiveProperty.Validation.value = ValidationType.GAME_OPEN;
        }
    }

    OnConnect() {
        if (this._tryToReconnect) {
            this._gameStateManager.ReloadScene();
        }

        console.log("ConnectionService OnConnect");

        if (this._serverConfig.GameId !== this._gameStateManager.GameId) {
            return;
        }

        let plainObject = null;
        if (this._serverConfig.IsDemo) {
            const initialState = {
                GameId: this._serverConfig.GameId,
                PartnerId: this._gameStateManager.PartnerId
            };
            plainObject = initialState;
            console.log("GetDemoInitialState ", plainObject);

            this._signalR.send("GetDemoInitialState", plainObject).catch(err => console.error(err));
        } else {
            if (!this._gameStateManager.TournamentId) {
                const initialState = {
                    GameId: this._serverConfig.GameId,
                    PartnerId: this._gameStateManager.PartnerId
                };
                this._signalR.send("GetInitialState", initialState).catch(err => console.error(err));
            } else {
                console.log("TournamentId: " + this._gameStateManager.TournamentId);
                const initialState = {
                    GameId: this._serverConfig.GameId,
                    PartnerId: this._gameStateManager.PartnerId,
                    TournamentId: this._gameStateManager.TournamentId
                };
                this._signalR.send("GetInitialState", initialState).catch(err => console.error(err));
            }
        }
    }

    OnInitialState(result) {
        this._onConnectAction?.();

        console.log("OnInitialState ", JSON.stringify(result));

        this.Validation(result.Validation);
        if (result.Validation !== ValidationType.SUCCESS) {
            this._reactiveProperty.Validation.value = result.Validation;
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
            return;
        }

        this._uiReactive.SymbolOdds.value = result.OddsInfo;

        if (result.TournamentInfo) {
            this._gameStateManager.TournamentType = result.TournamentInfo.MoneyType;
            if (result.TournamentInfo.MoneyType === MoneyType.Real) {
                this._uiReactive.CurrencyCode.value = "PGCOIN";
                if (result.TournamentInfo.PgCoinBalance != null)
                    this._uiReactive.Balance.value = parseFloat(result.TournamentInfo.PgCoinBalance);
            } else if (result.TournamentInfo.MoneyType === MoneyType.Freebet) {
                this._uiReactive.CurrencyCode.value = result.CurrencyCode;
                if (result.TournamentInfo.FreeBetPGCoinAmount != null) {
                    this._uiReactive.Bet.value = parseFloat(result.TournamentInfo.FreeBetPGCoinAmount);
                    let userFreeBetsModel = {
                        Count: parseInt(result.TournamentInfo.FreeBetCount),
                        RemainingCount: parseInt(result.TournamentInfo.FreeBetCount),
                        Id: -1,
                        PartnerId: this._gameStateManager.PartnerId,
                        TotalWin: 0
                    };

                    let awardedResponse = {
                        GameId: this._gameStateManager.GameId,
                        FreeBets: [userFreeBetsModel]
                    };
                    this.OnFreeBetAwarded(awardedResponse);
                }
            }
        } else {
            this._gameStateManager.TournamentId = "";
            this._uiReactive.CurrencyCode.value = result.CurrencyCode;
            this._uiReactive.Balance.value = result.Balance;
        }

        this._uiReactive.QuickBets.value = result.QuickBets;
        this._matrixController.LinesData = null;
        this._matrixController.NoWinData = result.Matrix;

        if (result.LastSpinResult) {
            this._matrixController.LastWinData = result.LastSpinResult.Matrix;
            this._uiReactive.LastWin.value = result.LastSpinResult.WinAmount;
            if (result.LastSpinResult.Additional) {
                let lastWinAdditionalModel = result.LastSpinResult.Additional;
                if (lastWinAdditionalModel.BonusType === BonusType.Jackpot && !lastWinAdditionalModel.OpenByPlayer) {
                    this._reactiveProperty.ShowJackpotWinWithoutOpening?.(lastWinAdditionalModel.JackpotCard);
                }
            }
        }

        this._matrixController.OddMulitplayer = 1;
        this._uiReactive.Rate.value = result.Rate;
        this._uiReactive.MaxOdd.value = result.MaxOdd;

        if (result.BonusSpinInfo) {
            this._uiReactive.GuaranteedWin.value = false;
            this._uiReactive.Bet.value = result.SpinInfo.Amount;
            this._reactiveProperty.FreeSpinsLeft.value = result.BonusSpinInfo.RemainingSpinCount;

            if (result.BonusSpinInfo.BonusType === BonusType.Jackpot) {
                this._reactiveProperty.Bonus.value = BonusType.Jackpot;
                this._reactiveProperty.SpinLocked.value = true;
                this._reactiveProperty.JackpotReconnectInfo.value = result.BonusSpinInfo.BonusData;
                this._reactiveProperty.OpenJackPot.next();
            } else {
                this._reactiveProperty.BonusReconnectInfo.value = result.BonusSpinInfo.BonusData;
                this._uiReactive.TotalWin.value = result.SpinInfo.WinAmount;
                this._reactiveProperty.ReturnFromInitialState.value = true;
                this._reactiveProperty.FreeSpinsLeft.value = result.BonusSpinInfo.RemainingSpinCount;
                this._reactiveProperty.Bonus.value = BonusType.FreeSpin;
                this._gameStateManager.State = GameState.FreeSpins;
                this._reactiveProperty.CurrentStateConfig.value = CurrentState.Bonus;
                this._reactiveProperty.SpinLocked.value = true;

                // Использование setTimeout для имитации следующего кадра
                setTimeout(() => {
                    this._reactiveProperty.CurrentStateConfig.value = CurrentState.None;
                    this._reactiveProperty.OpenBonus?.();
                }, 0);
            }
        } else {
            if (this._gameStateManager.TournamentType !== MoneyType.Freebet) {
                let defaultIndex = 4;
                if (result.DefaultBetAmount !== 0) {
                    defaultIndex = this._uiReactive.QuickBets.value.findIndex(x => x === result.DefaultBetAmount);
                }
                this._uiReactive.Bet.value = this._uiReactive.QuickBets.value[defaultIndex];
            }

            // this._gameStateManager.FadeOut();
        }

        if (!this._tryToReconnect) {
            this._reactiveProperty.InitialState.next();
        } else {
            this._sceneReactiveCommands.WinDone?.next(false);
        }

        if (!this._gameStateManager.TournamentId)
            this._reactiveProperty.UserFreeBets.value = result.UserFreebets;
        this._reactiveProperty.HasJackpot.value = result.HasJackpot;
        this._reactiveProperty.ConnectToJackpot.next(result.HasJackpot);

        if (result.UnderMaintenance) {
            this.OnMaintenanceNotify(result.UnderMaintenance);
        }
    }

    OnSpinResponse(result) {
        this.OnDemoSpinResponse(result);
    }

    OnBonusSpinResponse(doBonusSpinResultModel) {
        this.OnDemoBonusSpinResponse(doBonusSpinResultModel);
    }

    // Демонстрационные методы
    OnDemoSpinResponse(result) {
        this._reactiveProperty.ReturnFromInitialState.value = false;
        console.log("OnDemoSpinResponse ", JSON.stringify(result));

        if (this.Validation(result.Validation) === ValidationAction.Break) {
            return;
        }

        if (result.Validation !== ValidationType.SUCCESS) {
            this._matrixController.WinData = this._matrixController.NoWinData;
            this._matrixController.OddMulitplayer = 1;
            this._matrixController.LinesData = null;
        } else {
            this._matrixController.WinData = result.Result.Matrix;
            if (result.Result.Additional) {
                this._matrixController.LinesData = result.Result.Additional.Wins;
                this._matrixController.ExpandingWild = result.Result.Additional.ExpandingWild;
            } else {
                this._matrixController.LinesData = [];
                this._matrixController.ExpandingWild = [];
            }
        }

        this._reactiveProperty.MaxWin.value = result.MaxWin;
        this._win = parseFloat(result.WinAmount);

        if (result.FreeBetInfo) {
            this._reactiveProperty.FreeBetsLeft.value = result.FreeBetInfo.ReminingSpinCount;
            this._uiReactive.TotalWinFreeBet.value = result.FreeBetInfo.TotalWin;
        }

        this._uiReactive.Win.value = result.WinAmount;
        this._uiReactive.WinOdd.value = result.Odd;

        this._reactiveProperty.FreeSpinsLeft.value = result.FreeSpinCount;
        this._matrixController.OddMulitplayer = result.OddMultiplayer === 0 ? 1 : parseFloat(result.OddMultiplayer);

        this._sceneReactiveCommands.WinDone?.next(result.WinAmount > 0);

        if (this._gameStateManager.TournamentId && this._gameStateManager.TournamentType === MoneyType.Freebet) {
            if (result.TournamentInfo)
                this._reactiveProperty.FreeBetsLeft.value = result.TournamentInfo.CurrentFreeBetCount;
            this._uiReactive.TotalWinFreeBet.value += result.WinAmount;
        }

        if (this._gameStateManager.State === GameState.Normal || result.FreeSpinCount <= 0) {
            if (!this._serverConfig.IsDemo && this._gameStateManager.State === GameState.Normal) {
                if (!this._reactiveProperty.IsFreeBets.value) {
                    if (this.Validation(result.Validation) === ValidationAction.None) {
                        this._uiReactive.Balance.value = result.Balance;
                    }
                }
            }
            this._reactiveProperty.Bonus.value = result.BonusType || BonusType.None;
        }

        if (result.MaxWin) {
            this._reactiveProperty.Bonus.value = BonusType.None;
        }
    }

    OnDemoBonusSpinResponse(doBonusSpinResultModel) {
        if (this.Validation(doBonusSpinResultModel.Validation) === ValidationAction.Break) {
            return;
        }

        console.log("OnDemoBonusSpinResponse ", JSON.stringify(doBonusSpinResultModel));

        if (doBonusSpinResultModel.BonusType === BonusType.FreeSpin) {
            let response = {
                Validation: doBonusSpinResultModel.Validation,
                WinAmount: doBonusSpinResultModel.WinAmount,
                Result: {
                    Matrix: doBonusSpinResultModel.BonusInfo.Matrix,
                    Additional: doBonusSpinResultModel.BonusInfo.Additional
                },
                FreeSpinCount: doBonusSpinResultModel.RemainingSpinCount,
                BonusType: doBonusSpinResultModel.RemainingSpinCount > 0 ? doBonusSpinResultModel.BonusType : null,
                OddMultiplayer: doBonusSpinResultModel.OddMultiplayer,
                MaxWin: doBonusSpinResultModel.MaxWin
            };

            this._uiReactive.TotalWin.value = doBonusSpinResultModel.TotalWinAmount;
            this.OnDemoSpinResponse(response);
        }
    }

    OnDemoInitialState(result) {
        const Result = { ...result };
        this.Validation(Result.Validation);

        if (Result.Validation !== ValidationType.SUCCESS) {
            this._reactiveProperty.Validation.value = Result.Validation;
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
            return;
        }

        this._onConnectAction?.();

        console.log("OnDemoInitialState ", result);

        this._matrixController.WinData = Result.Matrix;
        this._matrixController.LinesData = null;
        this._matrixController.NoWinData = Result.Matrix;
        this._uiReactive.MaxOdd.value = Result.MaxOdd;
        this._uiReactive.Rate.value = Result.Rate;
        this._matrixController.OddMulitplayer = 1;

        if (!this._tryToReconnect) {
            this._reactiveProperty.InitialState?.next();
        } else {
            this._matrixController.WinData = this._matrixController.NoWinData;
            this._matrixController.LinesData = null;
            this._sceneReactiveCommands.WinDone?.next(false);
        }

        this._uiReactive.SymbolOdds.value = Result.OddsInfo;
        this._uiReactive.Balance.value = 100000;
        this._uiReactive.CurrencyCode.value = result.CurrencyCode;
        this._uiReactive.QuickBets.value = result.QuickBets;

        let defaultIndex = 4;
        if (Result.DefaultBetAmount !== 0) {
            defaultIndex = this._uiReactive.QuickBets.value.findIndex(x => x === Result.DefaultBetAmount);
        }
        this._uiReactive.Bet.value = this._uiReactive.QuickBets.value[defaultIndex];

        this._reactiveProperty.HasJackpot.value = Result.HasJackpot;
        this._reactiveProperty.ConnectToJackpot.next(Result.HasJackpot);

        if (Result.UnderMaintenance) {
            this.OnMaintenanceNotify(Result.UnderMaintenance);
        }
    }

    async SendSpin() {
        if (this._signalR.HubConnection.state === 'Disconnected') {
            this._tryToReconnect = true;
            this._reactiveProperty.ValidationActionConfig.value = ValidationAction.Show;
            this._reactiveProperty.Validation.value = ValidationType.INTERNET_CONNECTION_LOST;
            this._sceneReactiveCommands.Reconnect?.next(() => {
                this.Connect();
            });
            return;
        }

        // Задержка 4 секунды
        await new Promise(resolve => setTimeout(resolve, 4000));

        if (this._serverConfig.IsDemo) {
            if (this._reactiveProperty.FreeSpinsLeft.value <= 0) {
                let tempBet = this._uiReactive.GuaranteedWin.value
                    ? this._uiReactive.Bet.value * 10
                    : this._uiReactive.Bet.value;
                if (this._uiReactive.Balance.value >= tempBet) {
                    this._uiReactive.Balance.value -= tempBet;
                } else {
                    this.Validation(ValidationType.NOT_ENOUGH_MONEY);
                    this._sceneReactiveCommands.WinDone?.next(this._uiReactive.Win.value > 0);
                    return;
                }
            }

            if (this._gameStateManager.State === GameState.FreeSpins) {
                this._actionBonusSpinResponse = null;
                const bonusSpinData = {
                    BonusSpinData: 0,
                    GameId: this._gameStateManager.GameId,
                    PartnerId: this._gameStateManager.PartnerId
                };
                this._signalR.send("DemoBonusSpin", bonusSpinData).catch(err => console.error(err));
            } else {
                const spinData = {
                    SpinData: this._uiReactive.GuaranteedWin.value,
                    Amount: this._uiReactive.Bet.value,
                    GameId: this._serverConfig.GameId,
                    PartnerId: this._gameStateManager.PartnerId
                };
                this._signalR.send("DemoSpin", spinData).catch(err => console.error(err));
            }
        } else {
            if (this._gameStateManager.State === GameState.FreeSpins) {
                this._actionBonusSpinResponse = null;
                const bonusSpinData = {
                    BonusSpinData: 0,
                    GameId: this._gameStateManager.GameId,
                    PartnerId: this._gameStateManager.PartnerId
                };
                this._signalR.send("BonusSpin", bonusSpinData).catch(err => console.error(err));
            } else {
                let spinData;
                if (!this._gameStateManager.TournamentId) {
                    spinData = {
                        SpinData: this._uiReactive.GuaranteedWin.value,
                        Amount: this._uiReactive.Bet.value,
                        GameId: this._serverConfig.GameId,
                        PartnerId: this._gameStateManager.PartnerId,
                        FreeBetId: this._reactiveProperty.IsFreeBets.value ? this._reactiveProperty.FreeBetsID.value : null
                    };
                } else {
                    spinData = {
                        SpinData: this._uiReactive.GuaranteedWin.value,
                        Amount: this._uiReactive.Bet.value,
                        GameId: this._serverConfig.GameId,
                        PartnerId: this._gameStateManager.PartnerId,
                        TournamentId: this._gameStateManager.TournamentId
                    };
                }

                this._signalR.send("Spin", spinData)
                    .then(() => {
                        console.log("Отправлено Spin:", JSON.stringify(spinData));
                    })
                    .catch(err => console.error(err));
            }
        }
    }

    SendBonusSpin(x, y, action) {
        this._actionBonusPickResult = action;
        const bonusGameData = {
            GameId: this._gameStateManager.GameId,
            X: x,
            Y: y
        };
        const methodName = this._serverConfig.IsDemo ? "DemoBonusGame" : "BonusGame";
        this._signalR.send(methodName, bonusGameData).catch(err => console.error(err));
    }

    OnDemoBonusPickResult(result) {
        if (this.Validation(result.Validation) === ValidationAction.Break) {
            return;
        }

        this._actionBonusPickResult?.(result);
    }

    // Валидация и получение баланса
    Validation(type) {
        let validationAction;
        if (this._reactiveProperty.Validation.value === ValidationType.GAME_OPEN) {
            validationAction = ValidationAction.Break;
            return validationAction;
        }

        switch (type) {
            case ValidationType.SUCCESS:
                validationAction = ValidationAction.None;
                break;
            case ValidationType.INVALID_TOKEN:
                validationAction = ValidationAction.Break;
                break;
            case ValidationType.INVALID_SPIN:
            case ValidationType.MONEY_TRANSACTION_ERROR:
            case ValidationType.INVALID_OPERATION:
            case ValidationType.INVALID_TRANSACTION_OPERATION:
            case ValidationType.SPIN_NOTFOUND:
            case ValidationType.INVALID_SPIN_COUNT:
            case ValidationType.PARTNER_NOT_FOUND:
            case ValidationType.INVALID_SPINDATA:
            case ValidationType.INVALID_GAMEID:
            case ValidationType.INVALID_QUICK_BET:
            case ValidationType.PLAYER_LIMIT_EXCEEDED:
            case ValidationType.INVALID_PARTNER_GAME_LIMIT:
            case ValidationType.INVALID_CURRENCY_INFO:
            case ValidationType.INVALID_FREEBET_DATA:
                validationAction = ValidationAction.PopUp;
                break;
            case ValidationType.NOT_ENOUGH_MONEY:
            case ValidationType.JACKPOT_SERVICE_UNAVAILABLE:
                validationAction = ValidationAction.Show;
                break;
            default:
                validationAction = ValidationAction.Break;
                break;
        }

        this._reactiveProperty.ValidationActionConfig.value = validationAction;
        this._reactiveProperty.Validation.value = type;
        return validationAction;
    }

    OnGetBalanceResponse(result) {
        if (this.Validation(result.Validation) === ValidationAction.Break) {
            return;
        }

        this._uiReactive.Balance.value = result.Balance;
    }

    GetBalance() {
        if (!this._gameStateManager.TournamentId) {
            console.log("GetBalance");
            this._signalR.send("GetBalance").catch(err => console.error(err));
        }
    }

    // Проверка баланса турнира
    CheckTournamentBalance() {
        console.log("CheckTournamentBalance");
        if (this._gameStateManager.TournamentId) {
            if (this._uiReactive.QuickBets.value[0] > this._uiReactive.Balance.value) {
                const pgModel = {
                    Name: ""
                };
                SendPostMessage(JSON.stringify(pgModel));
                return false;
            }
        }

        return true;
    }

    // Jackpot
    SendJackpotCase(action, index = 1) {
        this._actionByJackpotSceneResult = action;

        console.log("SendJackpotCase " + index);
        this._signalR.send("OpenJackpotSceneItem", { Index: index })
            .catch(err => console.error(err));
    }

    OpenJackpot(action) {
        this._actionByJackpotSceneFinalResult = action;
        console.log("SendOpenJackpotScene");
        this._signalR.send("OpenJackpotScene")
            .catch(err => console.error(err));
    }

    OnJackpotSceneItemResult(result) {
        console.log("OnJackpotSceneItemResult ", JSON.stringify(result));
        if (this.Validation(result.Validation) === ValidationAction.Break) {
            return;
        }

        this._actionByJackpotSceneResult?.(result.JackpotSceneItemInfo, result.JackpotSceneItemInfos, result.Validation === ValidationType.SUCCESS);
    }

    OnJackpotSceneResult(result) {
        console.log("OnJackpotSceneResult ", JSON.stringify(result));
        if (this.Validation(result.Validation) === ValidationAction.Break) {
            return;
        }

        this._actionByJackpotSceneFinalResult?.(result.JackpotSceneItemInfo);
    }
}
