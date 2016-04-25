var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('compress', function() {
  gulp.src('src/ion-pullup.js')
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('example/www/js'))
    .pipe(uglify())  
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['compress']);