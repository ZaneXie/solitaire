/**
 * Created by xiezongjun on 2016-09-06.
 */
import {Card, DealColumn, MainColumns, RecycleColumns, CardColumn, MainColumn, DealColumnNextStat} from "./define";

function canMove(from: Card, to: Card): boolean {
    // 判断花色，不是相邻花色返回false。依赖CardType定义值
    if (Math.abs(from.type - to.type) !== 1) {
        return false;
    }
    // 判断目标卡片是否比当前卡片大1
    return from.number + 1 === to.number;
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

    public moveDealToMain(mainColumn: MainColumn): boolean {
        if (this.deal.pos < 0) {
            return false;
        }

        // 从deal取一张卡片
        let from: Card = this.deal.cards[this.deal.pos];

        // 移动到空列
        if (mainColumn.cards.length == 0) {

        }

        // 目的地卡片
        let to: Card = mainColumn.cards[0];

        // 判断是否可移动
        if (!canMove(from, to)) {
            return false;
        }

        // 可移动，从Deal删除并加入Main
        this.deal.cards.splice(this.deal.pos, 1);
        this.deal.pos--;

        mainColumn.cards.unshift(from);
        mainColumn.pos++;

        return true;
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

