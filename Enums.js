const JackpotConst = Object.freeze({
    Club: 1,
    Diamond: 2,
    Heart: 3,
    Spade: 4
});

const JackpotPopUpConst = Object.freeze({
    Clubs: 1,
    Diamonds: 2,
    Hearts: 3,
    Spades: 4
});

const TurboMode = Object.freeze({
    Slow: 1,
    Normal: 2,
    Fast: 3
});

const ResponsiveObject = Object.freeze({
    ReelContainer: 1,
    UICanvas: 2,
    MobileUI: 3,
    DesktopUI: 4,
    DarkPanel: 5,
    AdditionalReelContainer: 6,
    InfosLayer: 7,
    BonusScene: 8
});

const AnimWinState = Object.freeze({
    _start: 1,
    _loop: 2,
    Start: 3,
    Loop: 4
});

const BonusCaseAnimConst = Object.freeze({
    Open: 1,
    Opened: 2,
    Close: 3,
    Closed: 4,
    Move: 5
});

// Раскомментируйте и исправьте при необходимости
/*
const TranslationConst = Object.freeze({
    GAME_NAME: 1,
    INTRODUCTION: 2,
    SYMBOL_PAYOUT: 3,
    WINNING_LINES: 4,
    WINNING_LINES_TEXT: 5,
    WILDS: 6,
    MULTIPLIERS: 7,
    BONUS_GAME_SLIDE: 8,
    JACKPOT: 9,
    GAME_RULES: 10,
    ABOUT_THE_GAME: 11,
    ABOUT_THE_GAME_P1: 12,
    GENERAL_INFORMATION: 13,
    QUICK_INFO_MATRIX_SIZE: 14,
    QUICK_INFO_PAY_LINE: 15,
    QUICK_INFO_RTP: 16,
    QUICK_INFO_VOLATILITY: 17,
    QUICK_INFO_MIN_BET: 18,
    QUICK_INFO_MAX_BET: 19,
    QUICK_INFO_MAX_ODD: 20,
    MAX_WIN: 21,
    GAME_INFO_HOW_TO_PLAY: 22,
    HOW_TO_PLAY_P1: 23,
    HOW_TO_PLAY_P2: 24,
    GAME_RULES_GAME_FEATURES: 25,
    WILD: 26,
    WILD_RULES_P1: 27,
    BONUS_GAME: 28,
    BONUS_GAME_P1: 29,
    BONUS_GAME_P2: 30,
    BONUS_GAME_P3: 31,
    BONUS_GAME_P4: 32,
    BONUS_GAME_P5: 33,
    MULTIPLIER: 34,
    MULTIPLIER_P1: 35,
    MULTIPLIER_P2: 36,
    AUTO_PLAY: 37,
    AUTO_SPIN_P1: 38,
    AUTO_SPIN_P2: 39,
    AUTO_SPIN_P3: 40,
    AUTO_SPIN_P4: 41,
    TURBO_MODE: 42,
    TURBO_MODE_P1: 43,
    CONNECTIVITY_MALFUNCTION: 44,
    MALFUNCTION: 45,
    INITIAL_STATE: 46,
    LOST_CONNECTION: 47,
    RECONNECTING: 48,
    INVALID_TOKEN: 49,
    SESSION_INACTIVITY: 50,
    TWO_DEVICE_ENTRANCE: 51,
    MAINTENANCE: 52,
    INSUFFICIENT_FUNDS: 53,
    TECHNICAL_ISSUES: 54,
    BET_NOT_ACCEPTED: 55,
    CONGRATULATIONS: 56,
    FREE_SPINS_LEFT: 57,
    TOTAL_WIN: 58,
    WIN: 59,
    LAST_WIN: 60,
    BALANCE: 61,
    HOME: 62,
    GAME_RULES_P1: 63,
    SETTINGS: 64,
    GAME_HISTORY: 65,
    PAYTABLE: 66,
    SOUNDS_EFFECTS: 67,
    AMBIENCE_SOUND: 68,
    QUICK_BETS: 69,
    REFRESH: 70,
    LARGEST_WINNER: 71,
    LAST_WINNER: 72,
    NUMBER_OF_WINNERS: 73,
    OK: 74,
    JACKPOT_SERVICE_UNAVAILABLE: 75,
    PLAY: 76
});
*/

const KeysValuesTranslation = Object.freeze({
    NONE: 1,
    MINIMUMBET: 2,
    MAXIMUMBET: 3,
    MAXODD: 4
});

const CurrentState = Object.freeze({
    None: 1,
    Show: 2,
    Wait: 3,
    Bonus: 4,
    DoorOpen: 5
});

const SpinButtonState = Object.freeze({
    Normal: 1,
    Play: 2,
    Pause: 3
});

const GameState = Object.freeze({
    Normal: 1,
    FreeSpins: 2,
    BonusGame: 3
});

const BonusType = Object.freeze({
    Bonus: 1,
    FreeSpin: 2,
    Jackpot: 3,
    None: 4
});

const MoneyType = Object.freeze({
    Real: 1,
    Freebet: 2,
    Bonus: 3,
    Jackpot: 4,
    CashBack: 5,
    FreeSpin: 6,
    PromoBonus: 7
});

const ValidationType = Object.freeze({
    INVALID_TOKEN: 0,
    INVALID_SPIN: 1,
    MONEY_TRANSACTION_ERROR: 2,
    NOT_ENOUGH_MONEY: 3,
    INVALID_OPERATION: 4,
    SPIN_NOTFOUND: 5,
    INVALID_SPIN_COUNT: 6,
    INVALID_QUICK_BET: 7,
    PLAYER_LIMIT_EXCEEDED: 8,
    PARTNER_NOT_FOUND: 9,
    SUCCESS: 10,
    INVALID_SPINDATA: 11,
    INVALID_GAMEID: 12,
    INVALID_TRANSACTION_OPERATION: 13,
    INVALID_PARTNER_GAME_LIMIT: 14,
    INVALID_CURRENCY_INFO: 15,
    JACKPOT_SERVICE_UNAVAILABLE: 16,
    INVALID_FREEBET_DATA: 17,
    INTERNET_CONNECTION_LOST: 18,
    CONNECTION_RECONNECTING: 19,
    GAME_OPEN: 20,
    SESSION_INACTIVE: 21,
    MAINTENANCE_NOTIFY: 22
});

const ValidationAction = Object.freeze({
    None: 1,
    Retry: 2,
    Break: 3,
    Show: 4,
    PopUp: 5
});

const SettingsPanelType = Object.freeze({
    Main: 1,
    Info: 2,
    Settings: 3,
    GameRules: 4,
    GameHistory: 5,
    Replay: 6,
    None: 7
});
const  ConnectionStates = Object.freeze(
{
    Initial:1,
    Authenticating:2,
    Negotiating:3,
    Redirected:4,
    Reconnecting:5,
    Connected:6,
    CloseInitiated:7,
    Closed:8,
})
