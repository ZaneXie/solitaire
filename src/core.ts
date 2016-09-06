/**
 * Created by xiezongjun on 2016-09-06.
 */
import {getLogger} from "log4js";

const Diamonds = 0;
const Hearts = 2;
const Spades = 1;
const Clubs = 3;
const logger = getLogger("core");

export class CardColumn {
    public cards: Card[] = [];
}
export class Card {
    public number: number;

    public constructor(number) {
        this.number = number;
    }

    public getName() {
        let type = Math.floor((this.number - 1) / 13);
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
}

export class RecycleColumns {
    public Diamonds: RecycleColumn;
    public Hearts: RecycleColumn;
    public Spades: RecycleColumn;
    public Clubs: RecycleColumn;

    public constructor() {
        this.Diamonds = new RecycleColumn();
        this.Hearts = new RecycleColumn();
        this.Spades = new RecycleColumn();
        this.Clubs = new RecycleColumn();
    }
}

export class DealColumn extends CardColumn {
    public pos: number = -1;
}

export class MainColumn extends CardColumn {
    public pos: number = 0;
}
export class RecycleColumn extends CardColumn {
}

export class CardsStack {

    public deal: DealColumn;
    public main: MainColumns;
    public recycle: RecycleColumns;

    public constructor() {
        this.deal = new DealColumn();
        this.main = new MainColumns();
        this.recycle = new RecycleColumns();
    }

    public shuffle() {
        let numbers = this.getRandomNumbers();
        let pos = 0;
        for (let i = 0; i < 24; i++) {
            this.deal.cards.push(new Card(numbers[pos]));
            pos++;
        }

        function put(target: CardColumn, count: number) {
            for (let i = 0; i < count; i++) {
                target.cards.push(new Card(numbers[pos]));
                pos++;
            }
        }

        put(this.main.One, 1);
        put(this.main.Two, 2);
        put(this.main.Three, 3);
        put(this.main.Four, 4);
        put(this.main.Five, 5);
        put(this.main.Six, 6);
        put(this.main.Seven, 7);
    }

    public moveDealToMain(mainColumn: MainColumn) {
        if (this.deal.pos < 0) {
            return;
        }
    }

    private getRandomNumbers(): number[] {
        let ret = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];

        function swap(i: number, k: number) {
            let tmp: number = ret[i];
            ret[i] = ret[k];
            ret[k] = tmp;
        }

        for (let i = 0; i < 52; i++) {
            let pos = Math.floor(Math.random() * (52 - i));
            swap(i, pos);
        }
        return ret;
    }

    public debug() {
        function getColumnString(column: CardColumn) {
            let numbers = [];
            for (let card of column.cards) {
                numbers.push(card.number);
            }
            return numbers.join(',');
        }

        function logSeperator() {
            console.log('===============================================================')
        }

        logSeperator();
        console.log('deal', getColumnString(this.deal));

        logSeperator();
        console.log('One', getColumnString(this.main.One));
        console.log('Two', getColumnString(this.main.Two));
        console.log('Three', getColumnString(this.main.Three));
        console.log('Four', getColumnString(this.main.Four));
        console.log('Five', getColumnString(this.main.Five));
        console.log('Six', getColumnString(this.main.Six));
        console.log('Seven', getColumnString(this.main.Seven));

        logSeperator();
        console.log('Recycle Diamonds', getColumnString(this.recycle.Diamonds));
        console.log('Recycle Hearts', getColumnString(this.recycle.Hearts));
        console.log('Recycle Clubs', getColumnString(this.recycle.Clubs));
        console.log('Recycle Spades', getColumnString(this.recycle.Spades));
    }
}

let stack = new CardsStack();
stack.shuffle();
stack.debug();