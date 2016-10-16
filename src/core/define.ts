/**
 * Created by xiezongjun on 2016-09-06.
 */
import {CardGui} from "../gui/main";
import lodash = require('lodash');
export enum CardType{
    Diamonds = 0,
    Spades = 1,
    Hearts = 2,
    Clubs = 3,
}

export const CardTypeMap = [CardType.Diamonds, CardType.Spades, CardType.Hearts, CardType.Clubs];

export class CardColumn {
    public pos: number = -1;
    public cards: Card[] = [];
}
export class Card {
    public id: number;

    public type: CardType;
    public number: number;

    public sprite: CardGui;

    public column: CardColumn;

    public constructor(number, column) {
        this.id = number;
        let t = Math.floor((this.id - 1) / 13);
        this.type = CardTypeMap[t];
        this.number = this.id - (t * 13);
        this.column = column;
    }

    public getImageName(postFix: string = ".svg"): string {
        let n = "" + this.number;
        switch (this.number) {
            case 1:
                n = "ace";
                break;
            case 11:
                n = "jack";
                break;
            case 12:
                n = "queen";
                break;
            case 13:
                n = "king";
                break;
        }
        return n + "_of_" + CardType[this.type].toLowerCase() + postFix;
    }

    public get name(): string {
        return CardType[this.type] + ' ' + this.number;
    }
}

export class MainColumns {
    public One: MainColumn;
    public Two: MainColumn;
    public Three: MainColumn;
    public Four: MainColumn;
    public Five: MainColumn;
    public Six: MainColumn;
    public Seven: MainColumn;

    public constructor() {
        this.One = new MainColumn();
        this.Two = new MainColumn();
        this.Three = new MainColumn();
        this.Four = new MainColumn();
        this.Five = new MainColumn();
        this.Six = new MainColumn();
        this.Seven = new MainColumn();
    }

    public eachCard(cb: (card: Card, index?: any)=>any) {
        let func = (column: MainColumn)=> {
            lodash.each(column.cards, cb);
        }
        func(this.One);
        func(this.Two);
        func(this.Three);
        func(this.Four);
        func(this.Five);
        func(this.Six);
        func(this.Seven);
    }
}

export class RecycleColumns {
    // public Diamonds: RecycleColumn;
    // public Hearts: RecycleColumn;
    // public Spades: RecycleColumn;
    // public Clubs: RecycleColumn;

    public columns: RecycleColumn[] = [];

    public constructor() {
        this.columns[CardType.Diamonds] = new RecycleColumn(CardType.Diamonds);
        this.columns[CardType.Hearts] = new RecycleColumn(CardType.Hearts);
        this.columns[CardType.Spades] = new RecycleColumn(CardType.Spades);
        this.columns[CardType.Clubs] = new RecycleColumn(CardType.Clubs);
    }

    public getColumn(type: CardType) {
        return this.columns[type];
    }
}

export enum DealColumnNextStat{
    SUCCESS, FAIL, LOOP
}
export class DealColumn extends CardColumn {
    public pos: number = -1;

    public next(): DealColumnNextStat {
        if (this.cards.length === 0) {
            return DealColumnNextStat.FAIL;
        }
        if (this.pos === this.cards.length - 1) {
            this.pos = -1;
            return DealColumnNextStat.LOOP;
        } else {
            this.pos++;
            return DealColumnNextStat.SUCCESS;
        }
    }

    public current(): Card {
        return this.cards[this.pos];
    }
}

export class MainColumn extends CardColumn {
    public pos: number = 0;
    public columns: MainColumns;
}
export class RecycleColumn extends CardColumn {
    public type: CardType;

    public constructor(type: CardType) {
        super();
        this.type = type;
    }

    public canRecycle(card: Card): boolean {
        if (this.type != card.type) {
            return false;
        }
        if (this.cards.length === 0) {
            if (card.number == 1) {
                return true;
            } else {
                return false;
            }
        }
        let top = this.cards[this.cards.length - 1];
        return top.number + 1 === card.number;
    }

    public doRecycle(card: Card): boolean {
        if (!this.canRecycle(card)) {
            return false;
        }
        this.cards.push(card);
        this.pos++;
        return true;
    }
}