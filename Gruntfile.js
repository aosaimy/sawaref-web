//Gruntfile
"use strict"
module.exports = function(grunt) {
    //Initializing the configuration object
    grunt.initConfig({
        express: {
            // files: ['**/*.js'],
            // tasks: ['express:dev'],
            options: {
                spawn: false, // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded 
                // Override defaults here 
                // script: './server.js'
              background: false,
            },
            dev: {
              options: {
                script: './server.js'
              }
            },

        },

        // Task configuration
        concat: {
            options: {
                separator: grunt.util.linefeed + ';' + grunt.util.linefeed,
            },
            js: {
                src: [
                    './node_modules/jquery/dist/jquery.js',
                    './node_modules/bootstrap/dist/js/bootstrap.js',
                    './node_modules/angular/angular.js',
                    './node_modules/angular-resource/angular-resource.js',
                    './node_modules/angular-route/angular-route.js',
                    './node_modules/angular-filter/dist/angular-filter.js',
                ],
                dest: './public/assets/js/js.js'
            },
            tables: {
                src: [
                    './node_modules/bootstrap-table/src/bootstrap-table.js',
                    //'./node_modules/bootstrap-table/src/extensions/filter/bootstrap-table-filter.js',
                    './node_modules/bootstrap-3-typeahead/bootstrap3-typeahead.js',
                    './node_modules/table-export/tableExport.js',
                    './node_modules/table-export/jquery.base64.js'
                ],
                dest: './public/assets/js/tables.js'
            },
            myjs: {
                src: [
                    './assets/js/config.js',
                    './assets/js/main.js',
                    './assets/js/controllers.js',
                    './assets/js/models.js',
                    './assets/js/translation_model.js',
                    './assets/js/routes.js'

                    // './assets/js/js.js'
                ],
                dest: './public/assets/js/myjs.js'
            },
            similiarity: {
                src: [
                    "./assets/js/models.similarity.js",
                ],
                dest: './public/assets/js/models.similarity.js'
            },
            css: {
                src: [
                    './node_modules/bootstrap-table/src/bootstrap-table.min.css',
                    './node_modules/bootstrap-table/src/extensoins/filter/bootstrap-table-filter.min.js',
                    './assets/css/cssTmp.css'
                ],
                dest: './public/assets/css/css.css'
            }
        },
        less: {
            development: {
                options: {
                    compress: true, //minifying the result
                },
                files: {
                    //"./public/assets/css/bootstrap.css": "./node_modules/bootstrap/less/bootstrap.less",
                    "./assets/css/cssTmp.css": "./assets/css/css.less"
                }
            }
        },
        copy: {
            fonts: {
                expand: true,
                src: ['./node_modules/bootstrap/dist/fonts/*'],
                dest: './public/assets/fonts/',
                flatten: true,
                filter: 'isFile'
            },
            html: {
                expand: true,
                src: "*.html",
                dest: 'public/',
            },
        },
        uglify: {
            options: {
                mangle: false // Use if you want the names of your functions and variables unchanged
            },
            js: {
                files: {
                    './public/assets/js/js.js': './public/assets/js/js.js',
                }
            },
        },
        watch: {
            less: {
                files: ['./assets/css/*.less'], //watched files
                tasks: ['less', 'concat:css'], //tasks to run
                options: {
                    livereload: 32111 //reloads the browser
                }
            },
            html: {
                files: ['./*.html'], //watched files
                tasks: ['copy:html'], //tasks to run
                options: {
                    livereload: 32111 //reloads the browser
                }
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['less', 'concat', 'copy'], // everything
                options: { reload: 32111 }
            },
            js: {
                files: [
                    // './node_modules/jquery/jquery.js',
                    // './node_modules/bootstrap/dist/js/bootstrap.js',
                    './assets/js/*.js'
                ],
                tasks: ['concat' /*, 'uglify:js'*/ ], //tasks to run
                options: {
                    livereload: 32111 //reloads the browser
                }
            },
        }
    });


    // // Plugin loading
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');

    // Task definition
    grunt.registerTask('default', ['less', 'concat', 'copy', 'watch']);
    grunt.registerTask('cp', ['copy']);
};