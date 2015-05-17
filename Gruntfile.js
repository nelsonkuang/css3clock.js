module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                src: 'js/css3clock.js',
                dest: 'js/css3clock.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uglify', 'cssmin']);

};
