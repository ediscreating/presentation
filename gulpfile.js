const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpSass = require('gulp-sass');
const gulpPug = require('gulp-pug');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const connect = require('gulp-connect');
const mocha = require('gulp-mocha');
const js = require('./gulp-webpack');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');

const isProduction = process.env.NODE_ENV === 'production';

gulp.task(sass);
gulp.task(pug);
gulp.task('js', js);
gulp.task(assets);
gulp.task(test);

gulp.task('clean', () => {
  return gulp.src('./dist/**/*', { read: false })
             .pipe(clean());
});

gulp.task('watch:test', gulp.series(test, () => {
  gulp.watch('./src/test/**/*', test);
}));

gulp.task('watch:all', () => {
  gulp.watch('./src/assets/**/*', assets);
  gulp.watch('./src/**/*.js', js);
  gulp.watch('./src/**/*.pug', pug);
  gulp.watch('./src/**/*.scss', sass);
});

gulp.task('build', gulp.parallel('assets', 'sass', 'js', 'pug'));

gulp.task('dev-server', () => {
  connect.server({
    root: 'dist',
    livereload: true
  });

  gulp.watch('./dist/**/*').on('change', path => {
    return gulp.src(path, { read: false })
               .pipe(connect.reload());
  });
});

gulp.task('default', buildSeries(isProduction));

function buildSeries(production) {
  if (production) {
    return gulp.series('clean', 'build');
  }

  return gulp.series('clean', 'build', gulp.parallel('watch:all', 'dev-server'));
}

function pug() {
  return gulp.src('./src/index.pug')
             .pipe(rename('index.html'))
             .pipe(gulpPug({
               locals: {
                 stylesHref: 'style.css',
                 scriptSrc: 'bundle.js'
               },
               pretty: !isProduction
             }))
             .on('error', function(err) {
               console.log(err.message);
               this.end();
             })
             .pipe(gulp.dest('./dist'));
}

function sass() {
  return gulp.src('./src/index.scss')
             .pipe(gulpSass().on('error', gulpSass.logError))
             .pipe(rename('style.css'))
             .pipe(gulpIf(isProduction, csso()))
             .pipe(gulp.dest('./dist'));
}

function assets() {
  const imageExtname = ['.png', '.jpg'];

  return gulp.src('./src/assets/**/*', { since: gulp.lastRun('assets') })
             .pipe(gulpIf(function(file) {
               return isProduction && imageExtname.indexOf(file.extname) !== -1;
             }, imagemin()))
             .pipe(gulp.dest('./dist/assets'));
}

function test() {
  return gulp.src('./src/test/**/*.js')
             .pipe(mocha())
             .on('error', function() {
               this.end();
             });
}
