//const {Assets} = PIXI;
class Symbol {
    constructor(matrixController,container,symbolData,AssetsInGame,winSymbol = false) {
        // Injected dependencies
        this.symbolsData = symbolData;
        this.matrixController = matrixController;
        this.reelsConfig = config;
        this.reactiveProperty = SceneReactiveProperty;
        this.index = 0;
        // Create containers and sprites
        this.container = new PIXI.Container();
        this.canvasMainLayer = new PIXI.Container();
        this.canvasLayer = new PIXI.Container();
        this.canvasGroupAnimation = new PIXI.Container();
        this.sprite = undefined;
        if (!winSymbol){
            container.addChild(this.container)

        }
        this.container.zIndex = 5
        this.AssetsInGame = AssetsInGame;
        // Set up the hierarchy
        // this.container.addChild(this.canvasMainLayer);
        // this.canvasMainLayer.addChild(this.canvasLayer);
        // this.canvasLayer.addChild(this.canvasGroupAnimation);
        // this.canvasGroupAnimation.addChild(this.sprite);

        // Properties
        this.rectTransform = this.container;
        //this.image = this.sprite; // Alias for convenience
        this.animatedObject = null;
        this.lineIndex = [];
        this.isExpandWild = false;
        this.isScatter = false;
        this.container.name = "Symbol";

        // Initialize the symbol
        this.init();
    }
    SetRandomSymbol()
    {
        const {symbolsCount} = config
        const randomIndex = Math.floor(Math.random() * this.AssetsInGame.Symbols.length);
        this.index = randomIndex;
        const newTexture = this.AssetsInGame.Symbols[randomIndex];

        if (this.sprite) {
            if (this.sprite.texture !== newTexture) {
                this.sprite.texture = newTexture;
            }
        } else {
            this.sprite = new PIXI.Sprite(newTexture);
            this.sprite.width = config.symbolSize.width;
            this.sprite.height = config.symbolSize.height;
            this.container.addChild(this.sprite);
        }

    }
    SetSymbolByIndex(index){
        const { Symbols } = this.AssetsInGame;

        if (this.index === index) {
            return;
        }

        if (index < 0 || index >= Symbols.length) {
            return;
        }

        const newTexture = Symbols[index];
        if (this.sprite.texture !== newTexture) {
            this.sprite.texture = newTexture;
            this.index = index;
        }
    }
    init() {
        this.reactiveProperty.LineHighLight.subscribe((index) => {
            if (this.animatedObject == null || this.isScatter) {
                return;
            }

            if (index === -1 || this.lineIndex.includes(-1) || this.lineIndex.includes(index)) {
                this.canvasGroupAnimation.alpha = 1;
                //this.image.visible = false;
            } else {
                this.canvasGroupAnimation.alpha = 0;
                //this.image.visible = true;
            }

            if (this.lineIndex.length <= 0) {
                this.canvasGroupAnimation.alpha = 0;
                //this.image.visible = true;
                this.container.visible = false;
            }
        });
    }

    SetSymbolSize(size) {
        this.container.width = size.width;
        this.container.height = size.height;
    }

    ResetSymbol() {
        //this.image.visible = true;
        this.animatedObject = null;
        this.isExpandWild = false;
        this.isScatter = false;
        this.canvasGroupAnimation.alpha = 1;
        this.lineIndex = [];
        this.container.visible = true;
        //Reset sorting order if needed
        this.canvasLayer.zIndex = 2;
    }

    SetVisibilityState(isVisible, special = false, indexSpecial = 0, wildWinSymbol = 0,
                       additionalReelSymbol = false, indexLine = 0, isExpanding = false, isScatter = false) {
        this.isScatter = isScatter;
        if (special) {
            this.lineIndex.push(indexLine);
        }

        this.isExpandWild = isExpanding;

        // if (!special) {
        //     // Kill any ongoing tweens on image and canvas
        //     gsap.killTweensOf(this.image);
        //     gsap.killTweensOf(this.canvasGroupAnimation);
        //
        //     // Reset image color to white
        //     this.image.tint = 0xFFFFFF;
        //
        //     // Fade the canvas group
        //     gsap.to(this.canvasGroupAnimation, {
        //         alpha: isVisible ? 1 : 0,
        //         duration: 0.1,
        //     });
        // }

        if (special && !isVisible) {
            this.image.visible = false;
            this.setAnimatedSymbolId(indexSpecial, wildWinSymbol, additionalReelSymbol);
        } else if (isVisible && !special) {
            // Kill any ongoing tweens on image
            gsap.killTweensOf(this.image);

            // Reset image color to white and make it visible
            this.image.tint = 0xFFFFFF;
            this.image.visible = true;
        }
    }

    ExpandWild(duration) {
        this.canvasMainLayer.zIndex = 1000; // Arbitrary high value for sorting

        // Kill any ongoing tweens on image
        gsap.killTweensOf(this.image);

        // Animate the scale down
        gsap.to(this.image.scale, {
            x: 0,
            y: 0,
            duration: duration / 2,
            ease: 'back.in',
            onComplete: () => {
                this.image.scale.set(0, 0);

                // Change the sprite to the wild symbol
                const wildSpriteData = this.matrixController.getSpriteByIndex(
                    this.matrixController.getWildIndex()
                );
                this.image.texture = wildSpriteData.image.texture;

                // Animate the scale back up
                gsap.to(this.image.scale, {
                    x: 1,
                    y: 1,
                    duration: duration / 2,
                    ease: 'back.out',
                    onComplete: () => {
                        // Reset the canvasMainLayer sorting order if needed
                        this.canvasMainLayer.zIndex = 0;
                    },
                });
            },
        });
    }

    HighlightExpandWild(duration, top = false) {
        // Wait for the specified duration
        setTimeout(() => {
            // Bring the canvasMainLayer to the front if needed
            this.canvasMainLayer.zIndex = 1000;

            // Kill any ongoing tweens on image
            gsap.killTweensOf(this.image);

            // Animate the scale up
            gsap.to(this.image.scale, {
                x: 1.5,
                y: 1.5,
                duration: this.reelsConfig.expandWildDuration / 2,
                ease: 'back.out',
                onComplete: () => {
                    // Change the sprite to the wild symbol
                    const wildSpriteData = this.matrixController.getSpriteByIndex(
                        this.matrixController.getWildIndex()
                    );
                    this.image.texture = wildSpriteData.image.texture;

                    // Animate the scale back down
                    gsap.to(this.image.scale, {
                        x: 1,
                        y: 1,
                        duration: this.reelsConfig.expandWildDuration / 2,
                        ease: 'back.in',
                        onComplete: () => {
                            // Reset the canvasMainLayer sorting order if needed
                            this.canvasMainLayer.zIndex = 0;
                        },
                    });
                },
            });
        }, duration * 1000);
    }

    setAnimatedSymbolId(id, wildWinSymbol, additionalReelSymbol) {
        let symbolData;

        if (this.isExpandWild) {
            symbolData = this.matrixController.getWinSymbolData(
                this.matrixController.getWildIndex(),
                additionalReelSymbol
            );
        } else {
            symbolData = this.matrixController.getWinSymbolData(id, additionalReelSymbol);
        }

        if (!symbolData) {
            return;
        }

        if (this.animatedObject) {
            return;
        }

        if (!symbolData.itemGameObject) {
            this.image.visible = true;
            return;
        }

        // Create the animated object using the factory
        this.animatedObject = this.factory.create(
            symbolData.itemGameObject,
            this.container
        );

        // Set position to zero
        this.animatedObject.position.set(0, 0);

        // Uncomment and implement this block if needed
        // if (id === this.symbolsData.wildIndex && wildWinSymbol >= 0) {
        //     setTimeout(() => {
        //         gsap.killTweensOf(this.canvasGroupAnimation);
        //         gsap.killTweensOf(this.image);
        //         this.animatedObject = null;
        //         this.image.tint = 0xFFFFFF;
        //         this.image.alpha = 0;
        //         this.image.visible = true;
        //         this.image.texture = this.symbolsData.getSymbolByIndex(
        //             wildWinSymbol,
        //             additionalReelSymbol
        //         ).image.texture;
        //         gsap.to(this.image, {
        //             alpha: 1,
        //             duration: this.reelsConfig.wildSymbolSwitchDelay,
        //         });
        //     }, this.reelsConfig.wildSymbolDetectionDelay * 1000);
        // }
    }
}
