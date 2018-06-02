module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Project configuration.
    grunt.initConfig({
        pkg   : grunt.file.readJSON('package.json'),
        jshint: {
            files  : ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', "main.js"],
            options: {}
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/*.js','test/**/*.js']
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'mochaTest']);

};