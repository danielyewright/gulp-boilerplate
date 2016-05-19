/* Plugins to load */
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var zip = require('gulp-zip');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var packageJSON = require('./package.json');

/* Lists all files that should be copied
 * to the 'dist' folder for build tasks
 */
var dist = [
  './assets/js/main.min.js',
  './assets/js/vendor/modernizr-2.8.3.min.js',
  './assets/css/normalize.css',
  './assets/css/main.min.css',
  './assets/images/',
  './assets/fonts/',
  './*.html',
  './*.+(png|jpg|txt|ico|pdf|md)'
];

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'assets/js/vendor/jquery-2.1.4.min.js',
    'assets/js/plugins.js'
  ])
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('assets/js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('assets/js'));
});

/* Sass task */
gulp.task('sass', function() {
  return gulp.src('assets/scss/main.scss')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sass({includePaths: ['assets/scss']}))
  .pipe(gulp.dest('assets/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(cleanCSS())
  .pipe(gulp.dest('assets/css'))
  /* Reload the browser CSS after every change */
  .pipe(reload({stream:true}));
});

/* Images task. Optimizes all PNG, JPG, and SVG images. */
gulp.task('images', function() {
  return gulp.src('assets/images/*')
  .pipe(imagemin({
    progressive: true,
    use: [pngquant()]
  }))
  .pipe(gulp.dest('assets/images'));
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
  browserSync.init(['assets/css/*.css', 'assets/js/*.js', '*.html'], {
    server: {
      baseDir: './'
    },
    open: false
  });
});

/* Reload task */
gulp.task('bs-reload', function() {
  browserSync.reload();
});

/* Deletes the entire 'dist' directory when running
 * the default task
 */
gulp.task('clean', function() {
  return del([
    'dist/'
  ]);
});

/* For production, deletes specific files from the
 * 'dist' directory. Also deletes the folder created
 * by the zipped file when unzipped
 */
gulp.task('clean:prod', function() {
  return del('dist/' + packageJSON.name + '-v' + packageJSON.version, [
    'dist/**/DS_Store',
    'dist/**/*.DS_Store'
  ]);
});

/* Adds all 'dist/dev' files to a zip file for distribution
 * If you want to change the zipped filename, you'll have
 * to change 'name' and 'version' in package.json
 */
gulp.task('zip', function() {
  return gulp.src('dist/dev/**/*')
  .pipe(zip(packageJSON.name + '-v' + packageJSON.version + '.zip'))
  .pipe(gulp.dest('dist'));
});

/* Build task for building the projet into a testable file structure */
gulp.task('build:dev', ['sass', 'images', 'scripts'], function() {
  gulp.src(dist, {base: './'})
  .pipe(gulp.dest('dist/dev'));
});

/* Build task for production that deletes unwanted files,
 * and zips them for distribution
 */
gulp.task('build:prod', ['sass', 'images', 'scripts', 'clean:prod', 'zip'], function() {
  gulp.src(dist, {base: './'});
});

/* Default task. Watches scss, js, and html files for changes.
 * On file change, browserSync reloads HTML pages
 */
gulp.task('default', ['sass', 'images', 'scripts', 'clean', 'browser-sync'], function() {
  /* Watch scss, run the sass task on change. */
  gulp.watch(['assets/scss/*.scss', 'assets/scss/**/*.scss'], ['sass'])
  /* Watch .js files, run the scripts task on change. */
  gulp.watch(['assets/js/*.js'], ['scripts'])
  /* Watch .jade files, run the bs-reload task on change. */
  gulp.watch(['*.html'], ['bs-reload']);
});
