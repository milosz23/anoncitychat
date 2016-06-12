'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles:build', function() {
     return gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/'))
});

gulp.task('styles:watch',function() {
    return gulp.watch('sass/**/*.scss',['styles:build']);
});