/**
 * Created by xiezj on 2016/10/15.
 */

import through = require('through2');
export function jsonCompressor() {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            return callback();
        }

        try {
            file.contents = new Buffer(JSON.stringify(JSON.parse(file.contents.toString())));
        } catch (err) {
        }

        file.path = file.path.replace('.src', '');
        this.push(file);
        callback();
    });
}