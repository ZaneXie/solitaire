/**
 * Created by xiezj on 2016/9/6.
 */

import Phaser = require('phaser');
import {CardsStack} from "../core/core";
import Game = Phaser.Game;
import {Card} from "../core/define";
import lodash = require("lodash");
import {DealGui} from "./column/deal";
import {Point, scaleSize} from "./common";
import {MainGui} from "./column/main";
import {printStack} from "../debug/debug";
import {RecycleGui} from "./column/recycle";

export function checkOverlap(spriteA:Phaser.Sprite, spriteB:Phaser.Sprite):boolean {
    if (spriteA === spriteB) {
        return false;
    }

    let boundsA:any = spriteA.getBounds();
    let boundsB:any = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

// let card1: Phaser.Sprite, card2: Phaser.Sprite;
let text;
let cards:Phaser.Sprite[] = [];


export class CardGui extends Phaser.Sprite {
    data:{
        card:Card;
        oldPos:{x:number,y:number};
        turnToBack:()=>void;
        turnToFront:()=>void;
        moveBack:()=>void;
        recordOldPos:()=>void;
    };
}

export class Solitaire {

    public game:Game;
    public cardsStack:CardsStack;
    public dealGui:DealGui;
    public mainGui:MainGui;
    public recycleGui:RecycleGui;

    public constructor() {
        this.dealGui = new DealGui(this);
        this.mainGui = new MainGui(this);
        this.recycleGui = new RecycleGui(this);
    }

    preload() {
        this.game.load.atlasJSONHash('poker', 'images/cards/poker.png', 'images/cards/poker.json');
        this.game.load.image('poker.background', 'images/cards/back.png');
        this.game.load.image('poker.rec.diamond', 'images/cards/rec_diamond.png');
        this.game.load.image('poker.rec.heart', 'images/cards/rec_heart.png');
        this.game.load.image('poker.rec.club', 'images/cards/rec_club.png');
        this.game.load.image('poker.rec.spade', 'images/cards/rec_spade.png');
    }


    public createCard(card:Card, pos:{x:number, y:number} = {x: 0, y: 0}):CardGui {
        let ret:CardGui = this.game.add.sprite(pos.x, pos.y, 'poker.background');//, card.getImageName());
        ret.data.card = card;
        ret.scale.setTo(scaleSize, scaleSize);
        ret.inputEnabled = true;
        ret.input.enableDrag();
        ret.data.turnToBack = ()=> {
            ret.loadTexture('poker.background');
        };
        ret.data.turnToFront = ()=> {
            ret.loadTexture('poker', card.getImageName());
        };
        ret.data.moveBack = ()=> {
            ret.x = ret.data.oldPos.x;
            ret.y = ret.data.oldPos.y;
        };
        ret.data.recordOldPos = ()=> {
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
        this.cardsStack.shuffle();

        game.add.button(0, 500, 'button', ()=> {
            printStack(this.cardsStack)
        }, this);

        this.dealGui.create();
        this.mainGui.create();
        this.recycleGui.create();
        // let cards = [];

        // card1 = createCard(this.cardsStack.deal.cards[0], getDealPosition(0));
        // card2 = createCard(this.cardsStack.deal.cards[1], {x: 400, y: 0});

        let old:Phaser.Point;
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