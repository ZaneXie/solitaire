/**
 * Created by xiezj on 2016/10/15.
 */
import {DealColumn, Card, MainColumn} from "../../core/define";
import {Solitaire, checkOverlap, CardGui} from "./../main";
import {scaleSize} from "../common";

import lodash = require('lodash');

function getDealPosition(num:number) {
    let x = 0;
    let y = 20 * num;
    return {x, y};
}

export class DealGui {

    public solitaire:Solitaire;
    private deal:DealColumn;
    private background:Phaser.Sprite;

    public constructor(solitaire:Solitaire) {
        this.solitaire = solitaire;
    }

    public create() {
        this.deal = this.solitaire.cardsStack.deal;
        let pos = getDealPosition(0);
        this.background = this.solitaire.game.add.sprite(pos.x, pos.y, 'poker','card_back.png');
        this.background.scale.setTo(scaleSize, scaleSize);
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(()=> {
            this.onClick.apply(this)
        });
        for (let i in  this.deal.cards) {
            let card = this.solitaire.createCard(this.deal.cards[i], {x: 0, y: 0});
            this.deal.cards[i].sprite = card;
            card.visible = false;
            this.makeCardToDealCard(card);
        }
    }

    public onDragStart(card:CardGui) {
        card.data.recordOldPos();
    }

    public onDragStop(cardGui:CardGui) {
        let found = false;
        // 检查是否移动到主列
        this.solitaire.cardsStack.main.eachCard((c:Card)=> {
            if (!found && checkOverlap(cardGui, c.sprite)) {
                let targetColumn = <MainColumn>c.column;
                if (this.solitaire.cardsStack.moveDealToMain(targetColumn) > -1) {
                    let x = targetColumn.cards[1].sprite.x;
                    let y = targetColumn.cards[1].sprite.y;
                    found = true;
                    this.clearDealCard(cardGui);
                    cardGui.x = x;
                    cardGui.y = y + 20;
                    this.solitaire.mainGui.makeCardToMainCard(cardGui);
                    this.solitaire.game.world.bringToTop(cardGui);
                }
            }
        });
        // 检查是否移动到回收列
        if (!found) {
            lodash.each(this.solitaire.recycleGui.cards, (c, index)=> {
                if (!found && checkOverlap(cardGui, c)) {
                    let targetColumn = this.solitaire.cardsStack.recycle.columns[index];
                    if(this.solitaire.cardsStack.moveDealToRecycle(targetColumn) > -1){
                        found = true;
                        cardGui.x = c.x;
                        cardGui.y = c.y;
                        cardGui.data.card.column = targetColumn;
                        this.solitaire.game.world.bringToTop(cardGui);
                    }
                }
            });
        }
        if (!found) {
            cardGui.data.moveBack();
        }
    }

    public clearDealCard(card:CardGui) {
        card.events.onDragStart.remove(this.onDragStart, this);
        card.events.onDragStop.remove(this.onDragStop, this);
    }

    public makeCardToDealCard(card:CardGui) {
        card.events.onDragStart.add(this.onDragStart, this);
        card.events.onDragStop.add(this.onDragStop, this);
    }

    public onClick() {
        if (this.deal.current()) {
            this.deal.current().sprite.data.turnToBack();
            this.deal.current().sprite.visible = false;
        }
        this.deal.next();
        let pos = getDealPosition(5);
        if (this.deal.current()) {
            this.deal.current().sprite.data.turnToFront();
            this.deal.current().sprite.x = pos.x;
            this.deal.current().sprite.y = pos.y;
            this.deal.current().sprite.visible = true;
        }
    }

    public update() {
        /*
         for (let i in this.deal.cards) {
         this.deal.cards[i].sprite.visible = false;
         }
         let pos = getDealPosition(1);
         console.log(pos);
         console.log(this.deal);
         this.deal.cards[this.deal.pos].sprite.x = pos.x;
         this.deal.cards[this.deal.pos].sprite.y = pos.y;
         this.deal.cards[this.deal.pos].sprite.visible = true;
         */
    }
}