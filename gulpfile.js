var gulp = require("gulp");
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');


gulp.task('default', function () {
    console.log("default task created");
});

gulp.task("inject-vendor-scripts", function () {

    var wiredep = require("wiredep").stream;

    var wiredOptions = {
        bowerJson: require("./bower.json"),
        directory: "./src/client/lib",
        ignorePath: "../"
    };

    return gulp.src("./src/client/main/*.html")
        // .src will look for source of html files which call for dependencies
        // using the syntax bower:js or bower:css.  
        .pipe(wiredep(wiredOptions))
        // wiredep options are passed to configure the wiredep stream 
        .pipe(gulp.dest("./src/client/main"));
    // Files will be picked from gulp.src call stated above and modified 
    // in the stream and placed into the gulp.dest ie in a specified 
    // destination.
});

/* setting up browser-sync */

gulp.task('serve', ['nodemon-setup'], function () {
    console.log('"serve" task has begun');
    browserSync.init(null, {
        proxy: "http://localhost:5000",
        files: ["src/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

gulp.task('nodemon-setup', ["inject-vendor-scripts"], function () {
    var watchedFileList = ['*.js', 'src/**/*.js', '*.html', '*.css'];


    var nodemonOptions = {
        script: "src/server/app.js",
        ext: "html js",
        delayTime: 1,
        env: {
            port: 5000
        },
        watch: watchedFileList
    };

    return nodemon(nodemonOptions)
        .on('start', function () {
            console.log('Server up and running');
        });
});