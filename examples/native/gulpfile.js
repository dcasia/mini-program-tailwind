const gulp = require('gulp')
const clean = require('gulp-clean')
const changed = require('gulp-changed')
const change = require('gulp-change')
const config = require('./gulp.config')
const sourcemaps = require('gulp-sourcemaps')
const { handleSource } = require('@dcasia/mini-program-tailwind-webpack-plugin/dist/universal-handler')
const { Processor } = require('windicss/lib')
const { HTMLParser } = require('windicss/utils/parser')
const through2 = require('through2')
const fs = require('fs')
const windiConfig = require('./windi.config.js')

const outDir = config.outDir
const styleSrc = config.style.src
const templateSrc = config.template.src
const otherSrc = config.other.src 

const processor = new Processor(windiConfig)

gulp.task('handle:style', () =>
    gulp.src(
            styleSrc,
            {
                since: gulp.lastRun('handle:style')
            }
        )
        .pipe(sourcemaps.init())
        .pipe(change(content => {
            return handleSource('style', content, {enableRpx: true})
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outDir))
)

gulp.task('handle:template',
    gulp.series(
        () => gulp.src(templateSrc)
            .pipe(changed(outDir))
            .pipe(change((content) => {

                return handleSource('template', content)
            
            }))
            .pipe(gulp.dest(outDir)),
        () => gulp.src(templateSrc)
            .pipe(through2.obj(function(file, enc, cb) {
                let result = ''
                if (file.isBuffer()) {
                    const wxmlContent = file.contents.toString()
                    const content = new HTMLParser(wxmlContent)
                        .parseClasses()
                        .map(i => i.result)
                        .join(' ')
                    const interpretedSheet = processor.interpret(content, true).styleSheet
                    const MINIFY = true
                    const styles = interpretedSheet.build(MINIFY)

                    result = handleSource('style', styles, {enableRpx: true})

                }
                cb(null, result)
            }))
            .pipe(fs.createWriteStream('./dist/windi.wxss', {'flags': 'a'}))
    )
)

gulp.task('handle:other', () => 
    gulp.src(otherSrc)
        .pipe(changed(outDir))
        .pipe(gulp.dest(outDir))
)

gulp.task('watch:style', () => {
    gulp.watch(
        styleSrc,
        gulp.series('handle:style')
    )
})

gulp.task('watch:template', () => {
    gulp.watch(
        templateSrc,
        gulp.series('handle:template')
    )
})

gulp.task('watch:other', () => {
    gulp.watch(
        otherSrc,
        gulp.series('handle:other')
    )
})

gulp.task(
    'watch',
    gulp.parallel(
        'watch:style',
        'watch:template',
        'watch:other'
    )
)

gulp.task('clean', () => 
    gulp.src(
        [
            'dist',
            './src/windi.wxss'
        ],
        { 
            allowEmpty: true
        }
    )
    .pipe(clean())
)

gulp.task(
    'default',
    gulp.series(
        'clean',
        gulp.parallel(
            'handle:style',
            'handle:template',
        ),
        'handle:other',
        'watch'
    )
)
