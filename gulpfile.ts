/**
 * Created by xiezongjun on 2016-09-06.
 */
"use strict";
import gulp = require('gulp');
const ts:any = require('gulp-typescript');
import del =require('del');
import mainBowerFiles = require( 'main-bower-files');
// import webserver = require('gulp-webserver');
import minify = require('gulp-uglify');
import path = require('path');
import browserSync = require('browser-sync');

gulp.task('ts-src', ['clean-ts'], function () {
    let project = ts.createProject('tsconfig.json');
    let tsResult = project.src()
        .pipe(project());

    return tsResult.js.pipe(gulp.dest('public/js/app'));
});

gulp.task('clean-ts', function (cb) {
    del([
        'public/js/app/**/*/*',
        '!public/js/app/.gitignore',
        'src/**/*.js',
        'test/**/*.js.map', 'test/**/*.js',
    ]).then(function () {
        cb();
    });
});
gulp.task('ts-tool', function () {
    var tsResult = gulp.src(['./tool/*.ts', 'typings/index.d.ts'])
        .pipe(ts({
            target: "es6",
            module: "commonjs",
        }));
    return tsResult.js.pipe(gulp.dest('tool'))
});
gulp.task('ts-src-test', function () {
   let tsResult = gulp.src(["src/**/*.ts", "typings/index.d.ts", "src/**/*.d.ts"])
        .pipe(ts({
            target: "es6",
            module: "commonjs",
        }));
    return tsResult.js.pipe(gulp.dest("src"));
});
gulp.task('ts-test', ['ts-src-test'], function () {
    var tsResult = gulp.src(["test/**/*.ts", "typings/index.d.ts", "src/**/*.d.ts"])
        .pipe(ts({
            target: "es6",
            module: "commonjs",
        }));
    return tsResult.js.pipe(gulp.dest("test"));
});

gulp.task("bower-files", function () {
    return gulp.src(mainBowerFiles())
        .pipe(minify())
        .pipe(gulp.dest('public/js/lib'));
});


let bs = browserSync.create();
gulp.task('webserver', function () {
    bs.init({
        logLevel: "silent",
        reloadDebounce: 300,
        open: false,
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./public/**/*', function () {
        bs.reload();
    })
});

gulp.task('ts', ['ts-test', 'ts-src']);

gulp.task('default', ['ts', 'bower-files', 'webserver'])
