// vars and includes
var babel = require('gulp-babel');
var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat-util');
var eslint = require('gulp-eslint');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var less = require('gulp-less');
var LessCleanCss = require('less-plugin-clean-css');
var minifyHtml = require("gulp-minify-html");
var ngAnnotate = require('gulp-ng-annotate');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var streamqueue = require('streamqueue');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var vinylPaths = require('vinyl-paths');

var defaults = require('./app.defaults');
var libPrefix = defaults.libPrefix;
var vendorNgJs = defaults.vendorNgJs;

// *** DEV ***
gulp.task('dev', ['dev:compile'], function() {
    gulp.watch(path.join(libPrefix.dev.path, 'less/**/*.less'), ['dev:lesstocss']);
    gulp.watch(path.join(libPrefix.dev.path, 'js/app/**/*.js'), ['dev:appjs', 'dev:karma']);
    gulp.watch(path.join(libPrefix.dev.path, 'js/app/**/*.html'), ['dev:appjs', 'dev:karma']);
});

gulp.task('dev:compile', ['dev:precompile', 'dev:templates', 'dev:lesstocss', 'dev:libjs', 'dev:appjs']);

gulp.task('dev:precompile', ['dev:clean']);

// deletes css and js/dist directories as well as all their contents
gulp.task('dev:clean', function() {
    var directories = [
        path.join(libPrefix.prod.path, 'css'),
        path.join(libPrefix.prod.path, 'js/dist')
    ];

    return gulp.src(directories, {read: false})
        .pipe(vinylPaths(del))
        .on('err', gutil.log);
});

// takes any HTML files and adds them as cached templates to an Angular module
gulp.task('dev:templates', function() {
    var srcPath = path.join(libPrefix.dev.path, 'js/app/**/*.html'),
        destPath = path.join(libPrefix.prod.path, 'js/dist');

    return gulp.src(srcPath)
        .pipe(templateCache({
            module: libPrefix.templates.name,
            standalone: true,
            base: function (templateFile) {
                return path.basename(templateFile.path);
            },
            filename: libPrefix.templates.name + '.tmpl'
        }))
        .pipe(gulp.dest(destPath));
});

// converts less files to CSS in the /css folder
gulp.task('dev:lesstocss', function () {
    var srcPath = path.join(libPrefix.dev.path, 'less/app.less'),
        destPath = path.join(libPrefix.prod.path, 'css');

    return gulp.src(srcPath)
        .pipe(less())
        .pipe(gulp.dest(destPath))
        .on('error', gutil.log);
});

gulp.task('dev:libjs', function() {
    var stream = streamqueue({ objectMode: true }),
        destPath = path.join(libPrefix.prod.path, 'js/dist');

    stream.queue(
        gulp.src(vendorNgJs).pipe(ngAnnotate())
    );

    return stream.done()
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destPath))
        .on('err', gutil.log);
});

// concats the JS source files into a single app.js file, including HTML template files. Performs JS linting and ES6->ES5 transpilation
gulp.task('dev:appjs', ['dev:templates'], function() {
    var appFiles = path.join(libPrefix.dev.path, 'js/app/**/*.js'),
        templateFiles = path.join(libPrefix.prod.path, 'js/dist/', libPrefix.templates.name + '.tmpl'),
        destPath = libPrefix.prod.path + 'js/dist',
        stream = streamqueue({ objectMode: true });

    stream.queue(
        gulp.src(appFiles).pipe(eslint()).pipe(eslint.format()),
        gulp.src(templateFiles)
    );

    return stream.done()
        .pipe(sourcemaps.init())
	.pipe(babel())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destPath))
});

gulp.task('dev:karma', ['test:karma']);


// *** PROD ***
gulp.task('prod', ['build', 'prod:clean', 'prod:appjs', 'prod:lesstocss', 'prod:libjs']);

gulp.task('prod:clean', function() {
    var directories = [
        path.join(libPrefix.dev.path, '/css'),
        path.join(libPrefix.dev.path, 'js/dist')
    ];

    return gulp.src(directories, {read: false})
        .pipe(vinylPaths(del));
});

gulp.task('prod:appjs', ['prod:templates'], function() {
    var appFiles = path.join(libPrefix.dev.path, 'js/app/**/*.js'),
        templateFiles = path.join(libPrefix.dev.path, 'js/dist/', libPrefix.templates.name + '.tmpl'),
        destPath = libPrefix.dev.path + 'js/dist',
        stream = streamqueue({ objectMode: true });

    stream.queue(
        gulp.src(appFiles).pipe(eslint()).pipe(eslint.format()),
        gulp.src(templateFiles)
    );

    return stream.done()
	.pipe(babel())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(destPath))
});

gulp.task('prod:templates', ['prod:clean'], function() {
    var srcPath = path.join(libPrefix.dev.path, 'js/app/**/*.html');
        destPath = path.join(libPrefix.dev.path, 'js/dist');

    return gulp.src(srcPath)
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(templateCache({
            module: libPrefix.templates.name,
            standalone: true,
            base: function (templateFile) {
                return path.basename(templateFile.path);
            },
            filename: libPrefix.templates.name + '.tmpl'
        }))
        .pipe(gulp.dest(destPath));
});

gulp.task('prod:lesstocss', ['prod:clean'], function () {
    var srcPath = path.join(libPrefix.dev.path + 'less/app.less'),
        destPath = path.join(libPrefix.dev.path + 'css'),
        cleancss = new LessCleanCss({ advanced: true });

    return gulp.src(srcPath)
        .pipe(less({
            plugins: [cleancss]
        }))
        .pipe(gulp.dest(destPath))
        .on('error', gutil.log);
});

gulp.task('prod:libjs', ['prod:clean'], function() {
    var stream = streamqueue({ objectMode: true }),
        destPath = path.join(libPrefix.dev.path, 'js/dist');

    stream.queue(
        gulp.src(vendorNgJs).pipe(ngAnnotate())
    );

    return stream.done()
        .pipe(uglify())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(destPath));
});



// *** BUILD ***
gulp.task('build', ['build:bootstrapless', 'build:csstolesslibcss', 'build:bootstrapglyphicons']);

gulp.task('build:bootstrapless', function() {
    var srcPath = path.join(libPrefix.bower.path, 'bootstrap/less/**/*.less'),
        destPath = path.join(libPrefix.dev.path, 'less/lib/bs3');

    return gulp.src(srcPath)
        .pipe(gulp.dest(destPath));
});

gulp.task('build:csstolesslibcss', function() {
    var files = [
        path.join(libPrefix.bower.path, 'angular-growl-v2/build/angular-growl.css')
    ];
    var destPath = path.join(libPrefix.dev.path, 'less/libcss');

    return gulp.src(files)
    .pipe(gulp.dest(destPath));
});

gulp.task('build:bootstrapglyphicons', function() {
    var srcPath = path.join(libPrefix.bower.path, 'bootstrap/fonts/*'),
        destPath = path.join(libPrefix.dev.path, 'fonts');

    return gulp.src(srcPath)
        .pipe(gulp.dest(destPath));
});


// *** TEST ***
gulp.task('test', ['test:karma']);

gulp.task('test:karma', function() {
    // Be sure to return the stream
    return gulp.src('./usekarmaconf')
        .pipe(karma({
            configFile: './karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            console.log(err);
        });
});

