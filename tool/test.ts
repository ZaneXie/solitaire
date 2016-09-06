/**
 * Created by xiezongjun on 2016-09-06.
 */

import lodash = require('lodash');

import {CardsStack} from "../src/core/core";
import {DealColumnNextStat} from "../src/core/define";
import {printStack} from "../src/core/debug";
let stack = new CardsStack();
stack.shuffle();

let oldStack = lodash.cloneDeep(stack);
while (true) {
    if (stack.moveDealToMain(stack.main.One)) {
        console.log('success');
        printStack(oldStack);
        printStack(stack);
        break;
    }
    let stat = stack.deal.next();
    if (stat !== DealColumnNextStat.SUCCESS) {
        stack.shuffle();
        oldStack = lodash.cloneDeep(stack);
    }
}