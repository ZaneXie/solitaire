/**
 * Created by xiezj on 2016/10/15.
 */

import {Solitaire, CardGui, checkOverlap} from "../main";
import {Point, cardWidth} from "../common";
import {DealColumn, MainColumns, MainColumn, Card} from "../../core/define";
import lodash = require('lodash');
function getPosition(column: number, row: number) {
    let x = 30 + (cardWidth + 10) * column;
    let y = 20 * row;
    return {x, y}
}

function syncColumnGui(cardGui: CardGui) {
    let card = cardGui.data.card;
    let column = cardGui.data.card.column;
    let index = column.cards.indexOf(card);
    for (let i = 0; i < index; i++) {
        column.cards[i].sprite.x = cardGui.x;
        column.cards[i].sprite.y = cardGui.y + 20 * (i + 1);
    }
}

function syncDraggable(column: MainColumn) {
    let i = column.cards.length - 1;
    for (; i > column.pos; i--) {
        let cardGui = column.cards[i].sprite;
        cardGui.input.disableDrag();
    }
    for (; i >= 0; i--) {
        column.cards[i].sprite.input.enableDrag();
    }
}

function calcMainColumnBounds(mainColumn: MainColumn): Phaser.Rectangle {
    let ret: any = mainColumn.cards[mainColumn.pos].sprite.getBounds();
    console.log(ret);
    return ret;
}
export class MainGui {
    private solitaire: Solitaire;
    private mainColumns: MainColumns;

    public constructor(solitaire: Solitaire) {
        this.solitaire = solitaire;
    }


    public create() {
        this.mainColumns = this.solitaire.cardsStack.main;

        let createColumn = (column: MainColumn, index: number) => {
            let size = column.cards.length;
            for (let i = size - 1; i >= 0; i--) {
                let card = this.solitaire.createCard(column.cards[i], getPosition(index, size - 1 - i));
                column.cards[i].sprite = card;
                if (i <= column.pos) {
                    column.cards[i].sprite.data.turnToFront();
                }
                this.makeCardToMainCard(card);
            }
            syncDraggable(column);
        }

        createColumn(this.mainColumns.One, 1);
        createColumn(this.mainColumns.Two, 2);
        createColumn(this.mainColumns.Three, 3);
        createColumn(this.mainColumns.Four, 4);
        createColumn(this.mainColumns.Five, 5);
        createColumn(this.mainColumns.Six, 6);
        createColumn(this.mainColumns.Seven, 7);
    }

    public checkOverlap(cardGui: CardGui, cb: (column: MainColumn)=>any) {
        let cardBounds: any = cardGui.getBounds();
        let func = (column: MainColumn)=> {
            let bound = calcMainColumnBounds(column);
            if (Phaser.Rectangle.intersects(bound, cardBounds)) {
                cb(column);
            }
        }

        func(this.mainColumns.One);
        func(this.mainColumns.Two);
        func(this.mainColumns.Three);
        func(this.mainColumns.Four);
        func(this.mainColumns.Five);
        func(this.mainColumns.Six);
        func(this.mainColumns.Seven);
    }

    public onDragStop(cardGui: CardGui) {
        let found = false;
        let card = cardGui.data.card;
        let pos = card.column.cards.indexOf(card);

        let doWhenMoveOut = (column: MainColumn) => {
            if (column.pos >= 0) {
                column.cards[column.pos].sprite.data.turnToFront();
            } else {

            }
        }
        this.solitaire.cardsStack.main.eachCard((c: Card)=> {
            if (!found && checkOverlap(cardGui, c.sprite)) {
                let originColumn = <MainColumn>card.column;
                let targetColumn = <MainColumn>c.column;
                if (originColumn === targetColumn) {
                    return;
                }
                let moveCount = this.solitaire.cardsStack.moveMainToMain(originColumn, pos, targetColumn);
                if (moveCount > -1) {
                    let x = targetColumn.cards[moveCount].sprite.x;
                    let y = targetColumn.cards[moveCount].sprite.y;
                    this.solitaire.game.world.bringToTop(cardGui);
                    found = true;
                    cardGui.x = x;
                    cardGui.y = y + 20;

                    doWhenMoveOut(originColumn);
                    syncDraggable(originColumn);
                    syncDraggable(targetColumn);
                }
            }
        });
        // 检查是否移动到回收列
        if (!found) {
            lodash.each(this.solitaire.recycleGui.cards, (c, index)=> {
                if (!found && checkOverlap(cardGui, c)) {
                    let targetColumn = this.solitaire.cardsStack.recycle.columns[index];
                    let originColumn = <MainColumn>cardGui.data.card.column;
                    if (this.solitaire.cardsStack.moveMainToRecycle(originColumn, targetColumn) > -1) {
                        found = true;
                        cardGui.x = c.x;
                        cardGui.y = c.y;
                        cardGui.data.card.column = targetColumn;
                        cardGui.input.disableDrag();
                        this.solitaire.game.world.bringToTop(cardGui);
                        doWhenMoveOut(originColumn);
                        this.clearMainCard(cardGui);
                        syncDraggable(originColumn);
                    }
                }
            });
        }

        if (!found) {
            cardGui.data.moveBack();
        }
        syncColumnGui(cardGui);
    }

    public onDragStart(cardGui: CardGui) {
        cardGui.data.recordPosition();
    }

    public onDragUpdate(cardGui: CardGui) {
        syncColumnGui(cardGui);
    }

    public makeCardToMainCard(card: CardGui) {
        card.events.onDragStart.add(this.onDragStart, this);
        card.events.onDragUpdate.add(this.onDragUpdate, this);
        card.events.onDragStop.add(this.onDragStop, this);
    }

    public clearMainCard(card: CardGui) {
        card.events.onDragStart.remove(this.onDragStart, this);
        card.events.onDragUpdate.remove(this.onDragUpdate, this);
        card.events.onDragStop.remove(this.onDragStop, this);
    }

    public update() {

    }
}