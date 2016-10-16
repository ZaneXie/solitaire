/**
 * Created by xiezj on 2016/10/15.
 */

import Phaser = require('phaser');
export interface Point {
    x: number;
    y: number;
}

export const scaleSize: number = 1;
export const cardWidth: number = 84;
export const cardHeight: number = 122;

export class LabelButton extends Phaser.Button {
    private label;
    private style;
    constructor(game, x, y, key, label, callback?, callbackContext?, overFrame?, outFrame?, downFrame?, upFrame?) {
        super(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
//Style how you wish...
        this.style = {'font': '15px Arial', 'fill': 'black'};
        this.anchor.setTo(0.5, 0.5);
        this.label = new Phaser.Text(game, 0, 0, label, this.style);
//puts the label in the center of the button
        this.label.anchor.setTo(0.5, 0.5);
        this.addChild(this.label);
        this.setLabel(label);
//adds button to game
        game.add.existing(this);
    }

    setLabel(label) {
        this.label.setText(label);
    }
}
