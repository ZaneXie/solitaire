/**
 * Created by xiezj on 2016/9/6.
 */
define(["require", "exports", "./gui/main"], function (require, exports, main) {
    "use strict";
    let game = new main.Solitaire();
    game.start();
});
