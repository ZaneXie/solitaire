/**
 * Created by xiezongjun on 2016-09-06.
 */

import {assert} from "chai";
import {CardsStack} from "../../src/core/core";

describe("#moveDealToMain", function () {
    it("从发牌堆移动到中间列", function () {
        // 这是一组可移动的排列
        const mock1 = [
            35, 52, 51, 50, 2, 44, 34, 39, 1, 13, 36, 15, 40, 47, 27, 37, 19, 3, 41, 20, 8, 9, 21, 12, 23, 43, 5, 24, 6, 29, 30, 28, 14, 22, 33, 17, 4, 10, 32, 26, 16, 18, 42, 25, 11, 7, 46, 38, 45, 31, 49, 48
        ];
        let stack = new CardsStack();
        stack.shuffle(mock1);
        stack.deal.next();
        assert.equal(stack.moveDealToMain(stack.main.One), 0);

        let stack1 = new CardsStack();
        stack1.shuffle(mock1);
        for (let i = 0; i < 17; i++) {
            stack1.deal.next();
        }
        assert.equal(stack1.moveDealToMain(stack1.main.Five), 16);
    })
    
    it("从发牌堆移动到回收列", function(){
        // 这是一组可移动的排列
        const mock1 = [
            52,51,44,9,46,1,18,40,43,33,38,19,17,12,31,6,32,4,7,15,27,13,34,26,28,21,25,2,45,5,24,23,30,14,29,20,11,22,41,37,8,10,16,35,39,36,3,47,42,49,50,48
        ];
        let stack = new CardsStack();
        stack.shuffle(mock1);
        for (let i = 0; i <= 5; i++) {
            stack.deal.next();
        }
        assert.equal(stack.moveDealToRecycle(), 5);
    })
    
    it("从中间列移动到回收列", function(){
        const mock1 = [
            35,52,51,50,2,44,34,39,23,13,36,15,40,47,27,37,19,3,41,20,8,9,21,12,1,43,5,24,6,29,30,28,14,22,33,17,4,10,32,26,16,18,42,25,11,7,46,38,45,31,49,48 
        ];
        let stack = new CardsStack();
        stack.shuffle(mock1);
        assert.equal(stack.moveMainToRecycle(stack.main.One), 0);
    })
});