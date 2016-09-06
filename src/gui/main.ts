/**
 * Created by xiezj on 2016/9/6.
 */

import Phaser = require('phaser');
import {CardsStack} from "../core/core";
import Game = Phaser.Game;
import {Card} from "../core/define";

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

let card1, card2;
let text;
export class Solitaire {

    private game:Game;
    private cardsStack:CardsStack;

    public constructor() {
    }

    preload() {
        for (let i = 1; i < 53; i++) {
            let card = new Card(i);
            this.game.load.image(card.name, 'images/cards/SVG-cards-1.3/' + card.getImageName());
        }
    }

    create() {
        const that = this;
        let game = this.game;
        this.cardsStack = new CardsStack();
        this.cardsStack.shuffle();

        function createCard(card:Card, x:number = 0, y:number = 0) {
            let ret = game.add.sprite(x, y, card.name);
            ret.scale.setTo(0.3, 0.3);
            ret.inputEnabled = true;
            ret.input.enableDrag();
            return ret;
        }

        card1 = createCard(this.cardsStack.deal.cards[0]);
        card2 = createCard(this.cardsStack.deal.cards[1], 400);

        card2.events.onDragStart.add(()=>{return false});

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
            create: this.create,
            update: this.update
        });

    }
}