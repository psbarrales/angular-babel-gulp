'use strict';

import path from 'path';
import gulp from 'gulp';
import conf from './conf';

import karma from 'karma';

const pathSrcHtml = [path.join(conf.paths.src, '/**/*.html')];

const pathSrcJs = [path.join(conf.paths.src, '/**/!(*.spec).js')];
const pathSpecSrcJs = [path.join(conf.paths.src, '/**/*.spec.js')];

function runTests(singleRun, done) {
    const reporters = ['progress'];
    const preprocessors = {};

    pathSrcHtml.forEach(path => {
        preprocessors[path] = ['ng-html2js'];
    });

    pathSpecSrcJs.forEach(path => {
        preprocessors[path] = ['babel']
    });

    if (singleRun) {
        pathSrcJs.forEach(path => {
            preprocessors[path] = ['babel', 'coverage'];
        });
        reporters.push('coverage');
    }

    const localConfig = {
        configFile: path.join(__dirname, '/../karma.conf.js'),
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters,
        preprocessors: preprocessors
    };

    const server = new karma.Server(localConfig, failCount => {
        done(failCount ? new Error('Failed ' + failCount + ' tests.') : null);
    });
    server.start();
}

gulp.task('test', ['scripts'], done => {
    runTests(true, done);
});

gulp.task('test:auto', ['watch'], done => {
    runTests(false, done);
});