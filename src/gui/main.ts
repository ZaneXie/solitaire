/**
 * Created by xiezj on 2016/9/6.
 */

import Phaser = require('phaser');
import {CardsStack} from "../core/core";
import Game = Phaser.Game;
import {Card} from "../core/define";
import lodash = require("lodash");
import {DealGui} from "./column/deal";
import {Point, scaleSize, LabelButton} from "./common";
import {MainGui} from "./column/main";
import {printStack, printStackNumbers} from "../debug/debug";
import {RecycleGui} from "./column/recycle";
import {cardsTexture} from "./resource/texture";

export function checkOverlap(spriteA: Phaser.Sprite, spriteB: Phaser.Sprite): boolean {
    if (spriteA === spriteB) {
        return false;
    }

    let boundsA: any = spriteA.getBounds();
    let boundsB: any = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

// let card1: Phaser.Sprite, card2: Phaser.Sprite;
let text;
let cards: Phaser.Sprite[] = [];


export class CardGui extends Phaser.Sprite {
    data: {
        card: Card;
        oldPos: {x: number,y: number};
        turnToBack: ()=>void;
        turnToFront: ()=>void;
        moveBack: ()=>void;
        recordPosition: ()=>void;
    };
}

export class Solitaire {

    public game: Game;
    public cardsStack: CardsStack;
    public dealGui: DealGui;
    public mainGui: MainGui;
    public recycleGui: RecycleGui;
    public numbers: number[] = null;

    public constructor() {
        this.dealGui = new DealGui(this);
        this.mainGui = new MainGui(this);
        this.recycleGui = new RecycleGui(this);
    }

    preload() {
        this.game.load.atlasJSONHash('poker', 'images/cards.png', null, cardsTexture);
        // this.game.load.image('poker.empty.png', 'images/cards/empty.png');
    }


    public createCard(card: Card, pos: {x: number, y: number} = {x: 0, y: 0}): CardGui {
        let ret: CardGui = this.game.add.sprite(pos.x, pos.y, 'poker', 'card_back.png');//, card.getImageName());
        ret.data.card = card;
        ret.scale.setTo(scaleSize, scaleSize);
        ret.inputEnabled = true;
        ret.input.enableDrag();
        ret.events.onInputDown.add(()=> {
            console.log(ret.getBounds());
        })
        ret.data.turnToBack = ()=> {
            ret.loadTexture('poker', 'card_back.png');
        };
        ret.data.turnToFront = ()=> {
            ret.loadTexture('poker', card.getImageName());
        };
        ret.data.moveBack = ()=> {
            ret.x = ret.data.oldPos.x;
            ret.y = ret.data.oldPos.y;
        };
        ret.data.recordPosition = ()=> {
            ret.data.oldPos = {
                x: ret.x,
                y: ret.y,
            };
        }
        return ret;
    }

    create() {
        const that = this;
        let game = this.game;
        this.cardsStack = new CardsStack();
        this.cardsStack.shuffle(this.numbers);
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        game.add.button(400, 500, 'button', ()=> {
            let string = window.localStorage.getItem('old');
            this.numbers = JSON.parse(string);
            this.game.destroy();
            this.start();
        }, this);
        /*
         let button1 = new LabelButton(this.game, 400, 500, 'poker.empty.png', '读取记录', ()=> {
         let string = window.localStorage.getItem('old');
         this.numbers = JSON.parse(string);
         this.game.destroy();
         this.start();
         }, this, 1, 0, 2);
         */

        game.add.button(200, 500, 'button', ()=> {
            let string = JSON.stringify(this.cardsStack.numbers);
            window.localStorage.setItem('old', string)
        }, this);
        game.add.button(0, 500, 'button', ()=> {
            printStack(this.cardsStack)
        }, this);
        game.add.button(600, 500, 'button', ()=> {
            if (game.scale.isFullScreen)
            {
                game.scale.stopFullScreen();
            }
            else
            {
                game.scale.startFullScreen(false);
            }
        }, this);
        this.dealGui.create();
        this.mainGui.create();
        this.recycleGui.create();
        // let cards = [];

        // card1 = createCard(this.cardsStack.deal.cards[0], getDealPosition(0));
        // card2 = createCard(this.cardsStack.deal.cards[1], {x: 400, y: 0});

        // card2.events.onDragStart.add(()=> {
        //     card2.data.oldPosition = lodash.cloneDeep(card2.position);
        //
        // });

        // card2.events.onDragStop.add(()=> {
        //     card2.x = card2.data.oldPosition.x;
        //     card2.y = card2.data.oldPosition.y;
        // });

        // game.physics.arcade.overlap(card1, card2, (c1, c2)=> {
        //     console.log(c1);
        // }, null, this);

        // text = game.add.text(16, 500, 'Drag the sprites. Overlapping: false', {fill: '#ffffff'});

        /*
         this.game.physics.arcade.enable(card);

         //  Player physics properties. Give the little guy a slight bounce.
         card.body.bounce.y = 0.2;
         card.body.gravity.y = 300;
         card.body.collideWorldBounds = true;
         */

    }

    update() {
        this.dealGui.update();
        /*
         if (checkOverlap(card1, card2)) {
         text.text = 'Drag the sprites. Overlapping: true';
         }
         else {
         text.text = 'Drag the sprites. Overlapping: false';
         }*/
    }

    public start() {
        this.game = new Phaser.Game(1200, 900, Phaser.AUTO, '', {
            preload: ()=> {
                this.preload.apply(this);
            },
            create: ()=> {
                this.create.apply(this);
            },
            update: ()=> {
                this.update.apply(this);
            },
        });

    }
}