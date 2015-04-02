module.exports = (grunt) ->
  grunt.initConfig
    watch:
      launch:
        files: ['src/launch.user.coffee']
        tasks: ['coffee:launch']
      main:
        files: ['src/*']
        tasks: ['coffee:main', 'sass:main', 'autoprefixer:main']
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
    autoprefixer:
      main:
        src: 'build/eext.css'
        options:
          map: yes
    devserver:
      server: {}

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-devserver'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-autoprefixer'

  grunt.registerTask 'build', ['coffee', 'sass', 'autoprefixer']
  grunt.registerTask 'serve', ['devserver']
  grunt.registerTask 'build-serve', ['build', 'serve']