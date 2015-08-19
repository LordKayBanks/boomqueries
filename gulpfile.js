// Load Plugins
var pkg          = require('./package.json'),
    gulp         = require("gulp"),
    uglify       = require("gulp-uglify"),
    rename       = require("gulp-rename"),
    jshint       = require("gulp-jshint"),
    merge        = require("merge-stream"),
    header       = require("gulp-header"),
    autoprefixer = require("gulp-autoprefixer"),
    ghpages      = require("gulp-gh-pages"),
    less         = require('gulp-less'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

// Used for copyright headers
var banner = "/*! <%= pkg.title %> <%= pkg.version %> | <%= pkg.homepage %> | (c) 2015 BoomTown | MIT License */\n";

// Styles
gulp.task('styles', function() {
  return gulp.src(["src/less/app.less"])
    .pipe(less({ compress: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions','ie 9'], cascade: false }))
    .pipe(gulp.dest("dist/css/"))
    .pipe(reload({stream:true}));
});

// JS Hint
gulp.task("jshint", function() {
  return gulp.src("src/*.js")
    .pipe(jshint({
      "boss": true,
      "sub": true,
      "evil": true,
      "browser": true,
      "multistr": true,
      "globals": {
        "module": false,
        "require": true
      }
    }))
    .pipe(jshint.reporter("jshint-stylish"));
});

// Scripts
gulp.task("scripts", function() {
  var uncompressed = gulp.src("src/js/*.js")
    .pipe(header(banner, { pkg : pkg }))
    .pipe(gulp.dest("dist/js/"))
    .pipe(reload({stream:true}));

  var compressed = gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("dist/js/"))
    .pipe(reload({stream:true}));

  return merge(uncompressed, compressed);
});

// Watch
gulp.task("watch", function () {
  gulp.watch("src/less/*.less", ["styles"]);
  gulp.watch("src/js/*.js", ["jshint", "scripts"]);
});

// Browser Sync
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
});

// Website
gulp.task('website', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});

// Server
gulp.task('server', ['watch', 'browser-sync'], function () {
    gulp.watch("dist/*.html", reload);
});

// Default task
gulp.task("default", ["styles", "jshint", "scripts"]);