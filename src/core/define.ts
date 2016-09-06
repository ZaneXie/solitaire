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
}

export class MainColumn extends CardColumn {
    public pos: number = 0;
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
        return true;
    }
}