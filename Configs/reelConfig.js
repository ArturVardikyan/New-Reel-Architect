const config = {
    reelsCount: 5,
    reelsSpacing:10,
    visibleSymbolsCount: 3,
    symbolsCount: 9,
    reelsContainerSize: { x: 1920, y: 1080 },
    topSymbolsSpacing: 50,
    symbolsSpacing: 5,
    introDuration: 1,
    symbolSize: { width: 50, height:  50 },
    speedDuration: 2,
    forceStopDuration: 0.25,
    stopDuration: 0.5,
    stopSecondsBetweenReels: 0.1,
    introSecondsBetweenReels: 0.05,
    stopSlowDuration: 0.5,
    showWinDuration: 3.0,
    showWinDelay: 0.5,
    showWinPopupDuration: 2.0,
    stopDelay: 0.3,
    wildSymbolDetectionDelay: 0.4,
    wildSymbolSwitchDelay: 0.6,
    specialSymbolReelDelay: 0.7,
    expandWildDuration: 1.0,
    stopFastDuration: 0,
    speedFastDuration: 0,
    SetTimeScale1: ()=>{
        config.introDuration = 0;
        config.introSecondsBetweenReels = 0;
        config.speedDuration = 0.32;
        config.forceStoptopDuration = 0.1;
        config.stopDuration = config.speedDuration*1.2;
        config.stopSecondsBetweenReels = 0;
        config.stopSlowDuration = 0.5;
        config.stopDelay = 0.3;
        config.stopSlowDuration = 0.5;
        config.expandWildDuration = 1;
        config.showWinDelay = 0.5;
        config.showWinPopupDuration = 2.0;
        config.showWinDuration = 3.0;
        config.wildSymbolDetectionDelay = 0.4;
        config.wildSymbolSwitchDelay = 0.6;
        config.wildSymbolReelDelay = 0.7;

    },
    SetTimeScale2: ()=>{
        config.introDuration = 0.1;
        config.introSecondsBetweenReels = 0;
        config.speedDuration = 0.32//config.speedDuration;///9*5;
        config.forceStoptopDuration = 0.05;
        config.stopDuration = config.speedDuration/100;
        config.stopSecondsBetweenReels = 0.05;
        config.stopSlowDuration = 0.25;
        config.stopDelay = 0.15;
        config.stopSlowDuration = 0.25;
        config.expandWildDuration = 0.5;
        config.showWinDelay = 0.25;
        config.showWinPopupDuration = 1;
        config.showWinDuration = 1.5;
        config.wildSymbolDetectionDelay = 0.2;
        config.wildSymbolSwitchDelay = 0.3;
        config.wildSymbolReelDelay = 0.35;
    },
    SetTimeScale3: ()=>{
        config.introDuration = 0;
        config.introSecondsBetweenReels = 0;
        config.speedDuration = 0.32//9*6;
        config.forceStoptopDuration = 0.1;
        config.stopDuration = 0.112;
        config.stopSecondsBetweenReels = 0;
        config.stopSlowDuration = 0.5;
        config.stopDelay = 0.3;
        config.stopSlowDuration = 0.5;
        config.expandWildDuration = 1;
        config.showWinDelay = 0.5;
        config.showWinPopupDuration = 2.0;
        config.showWinDuration = 3.0;
        config.wildSymbolDetectionDelay = 0.4;
        config.wildSymbolSwitchDelay = 0.6;
        config.wildSymbolReelDelay = 0.7;
    },
    SetTimeScale0_5: ()=>{
        config.introDuration = 0.4;
        config.introSecondsBetweenReels = 0.4;
        config.speedDuration = 4;
        config.forceStoptopDuration = 0.2;
        config.stopDuration = 1;
        config.stopSecondsBetweenReels = 0.2;
        config.stopSlowDuration = 1;
        config.stopDelay = 0.6;
        config.stopSlowDuration = 1;
        config.expandWildDuration = 2;
        config.showWinDelay = 1;
        config.showWinPopupDuration = 4;
        config.showWinDuration = 6;
        config.wildSymbolDetectionDelay = 0.8;
        config.wildSymbolSwitchDelay = 1.2;
        config.wildSymbolReelDelay = 1.4;
    },
};
