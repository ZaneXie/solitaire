/**
 * Created by xiezongjun on 2016-09-06.
 */
"use strict";
import gulp = require('gulp');
const ts:any = require('gulp-typescript');
import del =require('del');
import mainBowerFiles = require( 'main-bower-files');
// import webserver = require('gulp-webserver');
// import minify = require('gulp-minify');
import path = require('path');

gulp.task('ts_new', function () {
    let project = ts.createProject('tsconfig.json');
    let tsResult = project.src()
        .pipe(project);

    return tsResult.js.pipe(gulp.dest('release'));
});

gulp.task('clean-ts', function (cb) {
    del([
        'public/js/app/**/*/*',
        '!public/js/app/.gitignore',
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
gulp.task('ts-src', ['clean-ts'], function () {
    var tsResult = gulp.src(["src/**/*.ts", "typings/index.d.ts"])
        .pipe(ts({
            target: "es6",
            module: "amd",
            // sourceMap: false,
            // out: 'main.js',
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
        /*
         .pipe(minify({
         ext: {
         src: '-debug.js',
         min: '.js',
         }
         }))
         */
        .pipe(gulp.dest('public/js/lib'));
});

gulp.task('webserver', function () {
    /*
     gulp.src('./')
     .pipe(webserver({
     livereload: {
     enable: true,
     filter: function (filename) {
     var relative = path.relative(__dirname, filename);
     if (relative.startsWith('public')) {
     }
     return false;
     }
     },
     // directoryListing: true,
     }));*/
});
gulp.task('ts', ['ts-test', 'ts-src']);

gulp.task('default', ['ts', 'bower-files', 'webserver'])
