module.exports = function (grunt) {

    grunt.initConfig({
        watch: {
            jade:{
                file: ['views/**'],
                //tasks: ['jshint'],
                options:{
                    livereload: true
                }
            },
            js: {
                file: ['public/js/**','models/**/*.js','schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon:{
            dev:{
                options:{
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md','node_modules/**'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app','config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 4000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent:{
            tasks:['nodemon'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');    
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['concurrent']);

};