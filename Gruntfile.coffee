module.exports = (grunt) ->
  grunt.initConfig {
    watch: {
      launch: {
        files: ['src/*.coffee']
        tasks: ['coffee:launch', 'coffee:main']
      }
    }
    coffee: {
      launch: {
        options: {
          bare: yes
        }
        files: {
          'build/launch.user.js': 'src/launch.user.coffee'
        }
      }
      main: {
        files: {
          'build/eext.js': 'src/eext.coffee'
        }
      }
    }
  }

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'