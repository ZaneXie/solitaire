/**
 * Created by xiezj on 2016/10/15.
 */

import {Solitaire, CardGui, checkOverlap} from "../main";
import {Point, cardWidth, cardHeight} from "../common";
import {DealColumn, MainColumns, MainColumn, Card} from "../../core/define";
import lodash = require('lodash');
import {printStack} from "../../debug/debug";
export function getMainPosition(column: number, row: number): Point {
    let x = 30 + (cardWidth + 10) * column;
    let y = 20 * row;
    return {x, y}
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

function calcMainColumnBounds(mainColumn: MainColumn, index: number): Phaser.Rectangle {
    if (mainColumn.pos >= 0) {
        let ret: any = mainColumn.cards[mainColumn.pos].sprite.getBounds();
        return ret;
    } else {
        // @todo: 放置一张真实卡背，须与实际卡片大小相同
        let pos = getMainPosition(index, 0);
        return new Phaser.Rectangle(pos.x, pos.y, cardWidth, cardHeight);
    }
}
export class MainGui {
    private solitaire: Solitaire;
    private mainColumns: MainColumns;

    public constructor(solitaire: Solitaire) {
        this.solitaire = solitaire;
    }


    public syncColumnGui(cardGui: CardGui) {
        let card = cardGui.data.card;
        let column = cardGui.data.card.column;
        // 只同步主列的样式
        if (!(column instanceof MainColumn)) {
            return;
        }
        let index = column.cards.indexOf(card);
        for (let i = index - 1; i >= 0; i--) {
            column.cards[i].sprite.x = cardGui.x;
            column.cards[i].sprite.y = cardGui.y + 20 * (i + 1);
            this.solitaire.game.world.bringToTop(column.cards[i].sprite);
        }
    }

    public create() {
        this.mainColumns = this.solitaire.cardsStack.main;

        let createColumn = (column: MainColumn, index: number) => {
            let size = column.cards.length;
            for (let i = size - 1; i >= 0; i--) {
                let card = this.solitaire.createCard(column.cards[i], getMainPosition(index, size - 1 - i));
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

    public checkOverlap(cardGui: CardGui, cb: (column: MainColumn, index?:number)=>any) {
        let found = false;
        let cardBounds: any = cardGui.getBounds();
        let func = (column: MainColumn, index: number)=> {
            if (found || cardGui.data.card.column === column) {
                return;
            }
            let bound = calcMainColumnBounds(column, index);
            if (Phaser.Rectangle.intersects(bound, cardBounds)) {
                found = true;
                cb(column, index);
            }
        }

        func(this.mainColumns.One, 1);
        func(this.mainColumns.Two, 2);
        func(this.mainColumns.Three, 3);
        func(this.mainColumns.Four, 4);
        func(this.mainColumns.Five, 5);
        func(this.mainColumns.Six, 6);
        func(this.mainColumns.Seven, 7);
    }

    public onDragStop(cardGui: CardGui) {
        let found = false;
        let card = cardGui.data.card;
        let pos = card.column.cards.indexOf(card);

        let doWhenMoveOut = (column: MainColumn) => {
            if (column.pos >= 0) {
                console.log(column.pos);
                console.log(column.cards);
                console.log(column.cards[column.pos]);
                console.log(!column.cards[column.pos]);
                if (!column.cards[column.pos]) {
                    printStack(this.solitaire.cardsStack);
                }
                column.cards[column.pos].sprite.data.turnToFront();
            } else {

            }
        }
        this.checkOverlap(cardGui, (targetColumn: MainColumn, index:number)=> {
            let originColumn = <MainColumn>card.column;
            if (originColumn === targetColumn) {
                return;
            }
            let moveCount = this.solitaire.cardsStack.moveMainToMain(originColumn, pos, targetColumn);
            if (moveCount > -1) {
                found = true;
                let x, y;
                if (moveCount > targetColumn.cards.length - 1) {
                    let pos = getMainPosition(index, 0);
                    x = pos.x;
                    y = pos.y;
                } else {
                    x = targetColumn.cards[moveCount].sprite.x;
                    y = targetColumn.cards[moveCount].sprite.y + 20;
                }
                cardGui.x = x;
                cardGui.y = y;
                this.solitaire.game.world.bringToTop(cardGui);

                doWhenMoveOut(originColumn);
                syncDraggable(originColumn);
                syncDraggable(targetColumn);
            }
        })
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
        this.syncColumnGui(cardGui);
    }

    public onDragStart(cardGui: CardGui) {
        cardGui.data.recordPosition();
    }

    public onDragUpdate(cardGui: CardGui) {
        this.syncColumnGui(cardGui);
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