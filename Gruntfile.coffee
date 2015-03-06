module.exports = (grunt) ->
  grunt.initConfig
    watch:
      launch:
        files: ['src/launch.user.coffee']
        tasks: ['coffee:launch']
      main:
        files: ['src/*']
        tasks: ['coffee:main', 'sass:main']
    coffee:
      launch:
        options:
          bare: yes
        files:
          'build/launch.user.js': 'src/launch.user.coffee'
      main:
        files:
          'build/eext.js': 'src/eext.coffee'
    sass:
      main:
        files:
          'build/eext.css': 'src/eext.scss'
    devserver:
      server: {}

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-devserver'
  grunt.loadNpmTasks 'grunt-contrib-sass'

  grunt.registerTask 'build', ['coffee', 'sass']
  grunt.registerTask 'serve', ['devserver']
  grunt.registerTask 'build-serve', ['build', 'serve']