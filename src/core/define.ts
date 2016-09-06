/**
 * Created by xiezongjun on 2016-09-06.
 */
export enum CardType{
    Diamonds = 0,
    Spades = 1,
    Hearts = 2,
    Clubs = 3,
}

export const CardTypeMap = [CardType.Diamonds, CardType.Spades, CardType.Hearts, CardType.Clubs];

export class CardColumn {
    public cards: Card[] = [];
}
export class Card {
    public id: number;

    public type: CardType;
    public number: number;

    public constructor(number) {
        this.id = number;
        let t = Math.floor((this.id - 1) / 13);
        this.type = CardTypeMap[t];
        this.number = this.id - (t * 13);
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
}

export class MainColumn extends CardColumn {
    public pos: number = 0;
}
export class RecycleColumn extends CardColumn {
}