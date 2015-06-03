module.exports = function(grunt) {

  var appConfig = {
    home: '.',
    src: 'src',
    dist: 'dist',
    demo: 'demo',
    test: 'test'
  };

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    app: appConfig,

    concat: {
      options: {
        separator: "\n\n"
      },
      css: {
        src: [
          'src/_preCSS.js',
          'src/static/css/chart.css',
          'src/_endCSS.js',
        ],
        dest: 'dist/css.js'
      },
      dist: {
        src: [
          'dist/css.min.js',
          'bower_components/javascript-detect-element-resize/detect-element-resize.js',
          'src/core.js',
          'src/line_chart.js',
          'src/candle_chart.js',
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
      css: {
        files: {
          'dist/css.min.js': ['dist/css.js']
        }
      }
    },

    // jade
    jade: {
        dist: {
            options: {
                pretty: true
            },
            files: [{
                expand: true,
                cwd: '<%= app.home %>',
                dest: '<%= app.home %>',
                src: '*.jade',
                ext: '.html'
            },{
                expand: true,
                cwd: '<%= app.src %>',
                dest: '<%= app.src %>',
                src: '{,*/,*/**/*}*.jade',
                ext: '.html'
            },{
                expand: true,
                cwd: '<%= app.test %>',
                dest: '<%= app.test %>',
                src: '{,*/,*/**/*}*.jade',
                ext: '.html'
            },{
                expand: true,
                cwd: '<%= app.demo %>',
                dest: '<%= app.demo %>',
                src: '{,*/,*/**/*}*.jade',
                ext: '.html'
            }]
        }
    },

    qunit: {
      files: ['test/*.html']
    },

    jshint: {
      files: ['dist/traderLightChart.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      config: {
        files: [ 'Gruntfile.js'],
        tasks: ['lint'],
        options: {
          reload: true
        }
      },
      dev: {
        files: ['<%= app.src %>/*', '<%= app.test %>/*', '<%= app.demo %>/*'],
        tasks: ['default'],
        options: {
          reload: true
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('lint', ['newer:jshint', 'newer:jscs']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('dev', ['default', 'watch:dev']);
  grunt.registerTask('default', ['concat:css', 'uglify:css', 'concat', 'jade:dist', 'qunit', 'uglify']);

};
