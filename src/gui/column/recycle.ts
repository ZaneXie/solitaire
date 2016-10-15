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
            let card = this.solitaire.game.add.sprite(pos.x, pos.y, name);
            card.scale.setTo(scaleSize, scaleSize);
            this.cards[index] = card;
        }
        c('poker.rec.diamond', CardType.Diamonds);
        c('poker.rec.spade', CardType.Spades);
        c('poker.rec.heart', CardType.Hearts);
        c('poker.rec.club', CardType.Clubs);
    }

    public update() {

    }
}