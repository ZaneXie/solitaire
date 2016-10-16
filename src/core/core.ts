/**
 * Created by xiezongjun on 2016-09-06.
 */
import {
    Card, DealColumn, MainColumns, RecycleColumns, CardColumn, MainColumn,
    RecycleColumn,
} from "./define";

function canMove(from: Card, to: Card): boolean {
    if (!from || !to) {
        return false;
    }
    console.log('try to move' + from.name + ' to ' + to.name);
    // 判断花色，不是相邻花色返回false。依赖CardType定义值
    let sub = Math.abs(from.type - to.type);
    if (sub !== 1 && sub !== 3) {
        return false;
    }
    // 判断目标卡片是否比当前卡片大1
    return from.number + 1 === to.number;
}

export class CardsStack {

    public deal: DealColumn;
    public main: MainColumns;
    public recycle: RecycleColumns;

    public numbers: number[];

    public constructor() {
        this.deal = new DealColumn();
        this.main = new MainColumns();
        this.recycle = new RecycleColumns();
    }

    public shuffle(numbers: number[] = null) {
        if (numbers === null) {
            numbers = this.getRandomNumbers();
        }
        this.numbers = numbers;
        let pos = 0;
        for (let i = 0; i < 24; i++) {
            this.deal.cards.push(new Card(numbers[pos], this.deal));
            pos++;
        }

        function put(target: CardColumn, count: number) {
            for (let i = 0; i < count; i++) {
                target.cards.push(new Card(numbers[pos], target));
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

    // 从from列的pos位置开始，移动到to下
    public moveMainToMain(fromColumn: MainColumn, pos: number, toColumn: MainColumn): number {

        //@todo:单测
        let from = fromColumn.cards[pos];

        let canDo = false;
        if (toColumn.pos < 0) {
            if (from.number == 13) {
                canDo = true;
            } else {
                canDo = false;
            }
        } else {
            let to = toColumn.cards[0];
            canDo = canMove(from, to);
        }

        if (canDo) {
            let cards = fromColumn.cards.splice(0, pos + 1);
            fromColumn.pos -= pos;
            if (fromColumn.cards.length == 0) {
                fromColumn.pos = -1;
            }
            for (let i = cards.length - 1; i >= 0; i--) {
                cards[i].column = toColumn;
                toColumn.cards.unshift(cards[i]);
            }
            toColumn.pos += (pos + 1);
            return pos + 1;
        }
        return -1;
    }

    public moveMainToRecycle(fromColumn: MainColumn, recycle: RecycleColumn = null): number {
        let card = fromColumn.cards[0];
        if (recycle == null) {
            recycle = this.recycle.getColumn(card.type);
        }
        if (recycle.doRecycle(card)) {
            fromColumn.cards.splice(0, 1);
            if (fromColumn.cards.length == 0) {
                fromColumn.pos = -1;
            }
            return 0;
        }
        return -1;
    }

    public moveDealToRecycle(recycle: RecycleColumn = null): number {
        if (this.deal.pos < 0) {
            return -1;
        }
        // 从deal取一张卡片
        let card: Card = this.deal.cards[this.deal.pos];

        // 如果没有设置目的地列，根据from卡牌选择
        if (recycle == null) {
            recycle = this.recycle.getColumn(card.type)
        }
        // 成功移动卡牌
        if (recycle.doRecycle(card)) {
            this.deal.cards.splice(this.deal.pos, 1);
            this.deal.pos--;
            return this.deal.pos + 1;
        }
        return -1;
    }

    // 将发牌堆的第一张牌放置到目的列
    public moveDealToMain(mainColumn: MainColumn): number {
        if (this.deal.pos < 0) {
            return -1;
        }

        // 从deal取一张卡片
        let from: Card = this.deal.cards[this.deal.pos];

        let canDo = false;
        // 移动到空列
        if (mainColumn.cards.length == 0) {
            if(from.number === 13){
                canDo = true;
            }
        }else{
            // 目的地卡片
            let to: Card = mainColumn.cards[0];
            canDo = canMove(from, to);
        }

        // 判断是否可移动
        if (!canDo){
            return -1;
        }

        // 可移动，从Deal删除并加入Main
        this.deal.cards.splice(this.deal.pos, 1);
        this.deal.pos--;

        mainColumn.cards.unshift(from);
        from.column = mainColumn;
        mainColumn.pos++;

        return this.deal.pos + 1;
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
}

