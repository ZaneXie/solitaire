/**
 * Created by xiezongjun on 2016-09-06.
 */

import {CardColumn, Card, CardType, DealColumn, RecycleColumn, MainColumn} from "../core/define";
import {CardsStack} from "../core/core";

export function printStackNumbers(stack: CardsStack) {
    console.log('all', stack.numbers.join(","));
}
export function printStack(stack: CardsStack,
                           cb: (card: Card) =>string = (card: Card)=>card.name) {

    function getColumnString(column: DealColumn|MainColumn|RecycleColumn) {
        let numbers = [];
        for (let card of column.cards) {
            numbers.push(cb(card));
        }

        let ret = numbers.join(',');

        return ret + "," + column.pos;
    }

    function logSeparator() {
        console.log('===============================================================')
    }

    logSeparator();
    console.log('deal', getColumnString(stack.deal));

    logSeparator();
    console.log('One', getColumnString(stack.main.One));
    console.log('Two', getColumnString(stack.main.Two));
    console.log('Three', getColumnString(stack.main.Three));
    console.log('Four', getColumnString(stack.main.Four));
    console.log('Five', getColumnString(stack.main.Five));
    console.log('Six', getColumnString(stack.main.Six));
    console.log('Seven', getColumnString(stack.main.Seven));

    logSeparator();
    console.log('Recycle Diamonds', getColumnString(stack.recycle.getColumn(CardType.Diamonds)));
    console.log('Recycle Hearts', getColumnString(stack.recycle.getColumn(CardType.Hearts)));
    console.log('Recycle Clubs', getColumnString(stack.recycle.getColumn(CardType.Clubs)));
    console.log('Recycle Spades', getColumnString(stack.recycle.getColumn(CardType.Spades)));
}