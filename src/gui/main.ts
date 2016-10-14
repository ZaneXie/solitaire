/**
 * Created by xiezj on 2016/9/6.
 */

import Phaser = require('phaser');
import {CardsStack} from "../core/core";
import Game = Phaser.Game;
import {Card} from "../core/define";
import lodash = require("lodash");

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

let card1: Phaser.Sprite, card2: Phaser.Sprite;
let text;
let cards: Phaser.Sprite[] = [];
export class Solitaire {

    private game: Game;
    private cardsStack: CardsStack;

    public constructor() {
    }

    preload() {
        this.game.load.atlasJSONHash('poker', 'images/cards/poker.png', 'images/cards/poker.json');
    }

    create() {
        const that = this;
        let game = this.game;
        this.cardsStack = new CardsStack();
        this.cardsStack.shuffle();

        function createCard(card: Card, pos: {x: number, y: number} = {x: 0, y: 0}): Phaser.Sprite {
            let ret = game.add.sprite(pos.x, pos.y, 'poker', card.getImageName());
            ret.scale.setTo(0.3, 0.3);
            ret.inputEnabled = true;
            ret.input.enableDrag();
            return ret;
        }

        function getDealPosition(num: number) {
            let x = 0;
            let y = 20 * num;
            return {x, y};
        }

        // let cards = [];
        for (let i in this.cardsStack.deal.cards) {
            // cards.push(createCard(this.cardsStack.deal.cards[i], getDealPosition(parseInt(i))));
        }
        card1 = createCard(this.cardsStack.deal.cards[0], getDealPosition(0));
        card2 = createCard(this.cardsStack.deal.cards[1], {x: 400, y: 0});

        let old: Phaser.Point;
        card2.events.onDragStart.add(()=> {
            card2.data.oldPosition = lodash.cloneDeep(card2.position);

        });

        card2.events.onDragStop.add(()=> {
            card2.x = card2.data.oldPosition.x;
            card2.y = card2.data.oldPosition.y;
        });

        game.physics.arcade.overlap(card1, card2, (c1, c2)=> {
            console.log(c1);
        }, null, this);

        text = game.add.text(16, 500, 'Drag the sprites. Overlapping: false', {fill: '#ffffff'});

        /*
         this.game.physics.arcade.enable(card);

         //  Player physics properties. Give the little guy a slight bounce.
         card.body.bounce.y = 0.2;
         card.body.gravity.y = 300;
         card.body.collideWorldBounds = true;
         */

    }

    update() {
        if (checkOverlap(card1, card2)) {
            text.text = 'Drag the sprites. Overlapping: true';
        }
        else {
            text.text = 'Drag the sprites. Overlapping: false';
        }
    }

    public start() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload: this.preload,
            create : this.create,
            update : this.update
        });

    }
}