/**
 * Created by xiezongjun on 2016-09-06.
 */

import {CardColumn} from "./define";
import {CardsStack} from "./core";
export function printStack(stack: CardsStack) {
    function getColumnString(column: CardColumn) {
        let numbers = [];
        for (let card of column.cards) {
            numbers.push(card.name);
        }
        return numbers.join(',');
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
    console.log('Recycle Diamonds', getColumnString(stack.recycle.Diamonds));
    console.log('Recycle Hearts', getColumnString(stack.recycle.Hearts));
    console.log('Recycle Clubs', getColumnString(stack.recycle.Clubs));
    console.log('Recycle Spades', getColumnString(stack.recycle.Spades));
}