/**
 * Created by xiezongjun on 2016-09-06.
 */

import lodash = require('lodash');

import {CardsStack} from "../src/core/core";
import {DealColumnNextStat} from "../src/core/define";
import {printStack, printStackNumbers} from "../src/debug/debug";

let mock = [
    35, 52, 51, 50, 2,
    44, 34, 39, 23, 13,
    36, 15, 40, 47, 27,
    37, 19, 3, 41, 20,
    8, 9, 21, 12, 1,
    43, 5, 24, 6, 29,
    30, 28, 14, 22, 33, 17, 4, 10, 32, 26, 16, 18, 42, 25, 11, 7, 46, 38, 45, 31, 49, 48
];
for (let i = 1; i <= 52; i++) {
    mock[i - 1] = i;
}
let stack = new CardsStack();
stack.shuffle(mock);

printStack(stack);


let oldStack = lodash.cloneDeep(stack);
let count = 100;
while (count > 0) {
    let result = stack.moveMainToRecycle(stack.main.One);
    if (result >= 0) {
        console.log('success', result);
        printStackNumbers(oldStack);
        printStack(oldStack);
        printStack(stack);
        break;
    }
    let stat = stack.deal.next();
    if (stat !== DealColumnNextStat.SUCCESS) {
        console.log("shuffle");
        stack.shuffle();
        count--;
        oldStack = lodash.cloneDeep(stack);
    }
}