const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();
const  concat = require("gulp-concat");
// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

// Scripts

const scripts = () => {
  return gulp.src("source/js/**/*.js")
  // .pipe(concat("script.min.js"))
    .pipe(terser())
    .pipe(rename((path) => {
      path.basename += ".min";
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Optimizer

const optimizeImages = ()=>{
return gulp.src("source/img/**/*{jpg,png,svg}")
.pipe(imagemin([
  imagemin.optipng({optimizationLevel: 3 }),
  imagemin.mozjpeg({progressive:true}),
  imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}
exports.images = optimizeImages;

const copyImages = () =>{
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(gulp.dest("build/img"))
}
exports.images = copyImages;

//WebP

const createWebp = () => {
return gulp.src("source/img/**/*.{jpg,png}")
.pipe(webp({quality: 90}))
.pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

//Sprite check

const sprite = () => {
return gulp.src("source/img/**/icon-*.svg")
.pipe(svgstore())
.pipe(rename("sprite.svg"))
.pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

//Copy check

const copy = (done) =>{

  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
  ],{
    base: "source"
  })
  .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;
// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

//Build

const build = gulp.series(
 clean,
 copy,
 optimizeImages,
 gulp.parallel(
  styles,
  html,
  scripts,
  sprite,
  createWebp
 ),
);

exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
