/**
 * Created by xiezongjun on 2016-09-06.
 */
"use strict";
const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const mainBowerFiles = require('main-bower-files');
const webserver = require('gulp-webserver');
const minify = require('gulp-minify');
const dep = require('./tool/dep');

gulp.task('clean-ts', function (cb) {
    del([
        'public/js/app/*.js',
        '!public/js/app/main.js',
        'test/**/*.js.map', 'test/**/*.js',
    ]).then(function () {
        cb();
    });
});
gulp.task('ts-tool', function () {
    var tsResult = gulp.src(['./tool/*.ts','typings/index.d.ts'])
        .pipe(ts({
            target: "es6",
            module: "commonjs",
        }));
    return tsResult.js.pipe(gulp.dest('tool'))
});
gulp.task('compile-resource',['ts-tool'], function () {
    gulp.src('public/images/cards/poker.src.json')
        .pipe(dep.jsonCompressor())
        .pipe(gulp.dest('public/images/cards'))
});
gulp.task('ts-src', ['clean-ts'], function () {
    var tsResult = gulp.src(["src/**/*.ts", "typings/index.d.ts"])
        .pipe(ts({
            target: "es6",
            module: "amd",
            sourceMap: false,
            out: 'main.js',
        }))
        ;
    return tsResult.js
        // .pipe(minify())
        .pipe(gulp.dest("public/js/app/src"));
});
gulp.task('ts-test', ['ts-src'], function () {
    var tsResult = gulp.src(["test/**/*.ts", "typings/index.d.ts", "src/**/*.d.ts"])
        .pipe(ts({
            target: "es6",
            module: "commonjs",
        }));
    return tsResult.js.pipe(gulp.dest("test"));
});

gulp.task("bower-files", function () {
    return gulp.src(mainBowerFiles())
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js',
            }
        }))
        .pipe(gulp.dest('public/js/lib'));
});

gulp.task('webserver', function () {
    gulp.src('./public')
        .pipe(webserver({
            livereload: true,
            // directoryListing: true,
        }));
});
gulp.task('ts', ['ts-test', 'ts-src']);

gulp.task('default', ['ts', 'bower-files', 'webserver'])
