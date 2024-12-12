class SignalRController {
    constructor() {
        this._hubConnection = null;
        this._onConnect = null;
        this.OnErrorReceive = null;
    }


    Init(url, hub, token = null) {
        try {
            let fullUrl = `${url}${hub}`;
            let uri = new URL(fullUrl);

            if (token) {
                uri.searchParams.append('access_token', token);
            }

            // Создаем экземпляр HubConnection
            this._hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(uri.toString(), {
                    accessTokenFactory: () => token || ''
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            console.log(`HubConnection init: ${uri.toString()}`);

            this._hubConnection.onclose(this.OnConnectionClosed.bind(this));
            this._hubConnection.onreconnected(this.OnReconnected.bind(this));
            this._hubConnection.onreconnecting(this.OnReconnecting.bind(this));
        } catch (error) {
            console.error("Error init HubConnection:", error);
            if (this.OnErrorReceive) {
                this.OnErrorReceive(error.toString());
            }
        }
    }

    Connect() {
        if (!this._hubConnection) {
            console.error("HubConnection not initialized. call Init before.");
            return;
        }

        // Запускаем подключение
        this._hubConnection.start()
            .then(() => {
                console.log("Successfully connected to HUB.");
                if (this._onConnect) {
                    this._onConnect(this._hubConnection);
                }
            })
            .catch(err => {
                console.error("Error connecting to HUB", err);
                if (this.OnErrorReceive) {
                    this.OnErrorReceive(err.toString());
                }
            });
    }

    SetConnectionListener(action) {
        this._onConnect = action;
    }

    AddListener(method, action) {
        if (this._hubConnection) {
            this._hubConnection.on(method, action);
        } else {
            console.error("HubConnection not initialized. call Init before.");
        }
    }

    OnConnectionClosed(error) {
        if (error) {
            console.error("Connection closed with error:", error);
            if (this.OnErrorReceive) {
                this.OnErrorReceive(error.toString());
            }
        } else {
            console.log("Connection Closed.");
        }
    }

    OnReconnected(connectionId) {
        console.log(`Repeat connection with ID : ${connectionId}`);
    }

    OnReconnecting(error) {
        if (error) {
            console.warn("Start next connection with error:", error);
            if (this.OnErrorReceive) {
                this.OnErrorReceive(error.toString());
            }
        } else {
            console.log("Next connection started  ...");
        }
    }

    CloseConnection() {
        if (this._hubConnection) {
            this._hubConnection.stop()
                .then(() => console.log("Connection with HUB closed."))
                .catch(err => console.error("Error on closing connection with HUB:", err));
        } else {
            console.warn("HubConnection not initialized.");
        }
    }

    Send(method, obj) {
        if (this._hubConnection) {
            console.log("Sending:", JSON.stringify(obj));
            this._hubConnection.invoke(method, obj)
                .catch(err => console.error(`Error on sending action ${method}:`, err));
        } else {
            console.error("HubConnection not initialized. Call Init before.");
        }
    }
}
