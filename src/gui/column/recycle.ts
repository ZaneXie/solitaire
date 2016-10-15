/**
 * Created by xiezj on 2016/10/15.
 */

import {Solitaire} from "../main";
import {Point, cardWidth, cardHeight, scaleSize} from "../common";
import {CardType} from "../../core/define";

function getRecyclePosition(index:number):Point {
    return {
        x: (cardWidth + 30) * 8,
        y: (cardHeight + 20) * index
    };
}

export class RecycleGui {
    public solitaire:Solitaire;
    public cards:Phaser.Sprite[] = [];

    public constructor(solitaire:Solitaire) {
        this.solitaire = solitaire;
    }

    public create() {
        let c = (name:string, index:number) => {
            let pos = getRecyclePosition(index);
            let card = this.solitaire.game.add.sprite(pos.x, pos.y, 'poker', name);
            card.scale.setTo(scaleSize, scaleSize);
            this.cards[index] = card;
        }
        c('rec_diamond.png', CardType.Diamonds);
        c('rec_spade.png', CardType.Spades);
        c('rec_heart.png', CardType.Hearts);
        c('rec_club.png', CardType.Clubs);
    }

    public update() {

    }
}