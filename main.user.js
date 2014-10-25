// ==UserScript==
// @name       EasyExtend
// @author     bleush38p / jTron
// @namespace  http://scratch.mit.edu/users/jTron/
// @version    0.1
// @description  Easily and safely adds custom extensions to Scratch projects.
// @include    http://scratch.mit.edu/projects/*
// @copyright  2014+, bleush38p / jTron
// @grant          none
// ==/UserScript==

(function($, root) {
  root.EEXT = {}; // Get it to exist, then we can just use EEXT from now on.
  
  EEXT.init = function () {
    $('head').append(EEXT.hs.CSS).append(EEXT.hs.FONT);
    
    EEXT.statusLetter = 'E';
    EEXT.statusColor = EEXT.scs.UNLOADED;
    $('#pagewrapper').append(EEXT.hs.MAIN);
  };
  
  EEXT.load = function () {
    EEXT.isWorking(true);
    
    if (!EEXT.scratchLoaded()) {
      EEXT.statusColor = EEXT.scs.ERROR;
      EEXT.statusLetter = '!';
      EEXT.updateStatus();
      EEXT.notif(EEXT.n.FAILEDLOAD);
      EEXT.isWorking(false);
      return;
    }
    
    (function(ext) {
      // This will make sure this function works even if the extension's
      // already been installed.
      ScratchExtensions.unregister('EEXT/importer'); 
      
      console.info('[EEXT] Inserting EEXT/importer...');
      
      ext._shutdown = function () {};
      
      var status = 0; 
      
      ext._getStatus = function() {
        return [{status: 2, msg: 'Ready, though no libraries are installed yet.'},
                {status: 2, msg: 'Ready.'},
                {status: 0, msg: 'Install canceled.'}][status];
      };
      
      var descriptor = {
        blocks: [
          ['h', 'on EEXT ready', 'onceReady'],
          ['b', 'EEXT ready?', 'isReady'],
          ['-'],
          [' ', 'add EEXT library %m.liblist', 'addEEXTLib', 'sample'],
          [' ', 'add external library %s', 'addHTTPLib', 'http://'],
          ['w', 'load missing libraries', 'loadLibs'],
          ['-'],
          ['h', 'when install is successful', 'onceInstalled'],
          ['h', 'when install is canceled', 'onceCanceled'],
          ['h', 'when install fails', 'onceFailed'],
          ['b', 'installation successful?', 'isInstalled'],
          ['b', 'installation canceled?', 'isCanceled'],
          ['b', 'installation falied?', 'isFailed']
        ],
        
        menus: {
          liblist: ['sample', 'lib1', 'lib2', 'lib3', 'lib4', 'lib5']
          // just a sample for now.
          // possibly get this dynamically from a server?
        },
        
        url: 'https://github.com/bleush38p/EasyExtend'
      };
      
      // Library arrays
      var eextLibsToInstall = [],
          eextLibsInstalled = [],
          httpLibsToInstall = [],
          httpLibsInstalled = [];
      
      // Install checking
      var isInstalled   = false,
          isCanceled    = false,
          isFailed      = false;
      
      var rtrue = function () {return true;};
      
      // These should be true as soon as the extension is loaded!
      ext.onceReady = rtrue;
      ext.isReady = rtrue;
      
      ext.onceInstalled = function() {return isInstalled  ;};
      ext.onceCanceled  = function() {return isCanceled   ;};
      ext.onceFailed    = function() {return isFailed     ;};
      ext.isInstalled   = function() {return isInstalled  ;};
      ext.isCanceled    = function() {return isCanceled   ;};
      ext.isFailed      = function() {return isFailed     ;};
      
      ext.addEEXTLib = function (libname) {
        if (!($.inArray(libname, eextLibsToInstall) === -1 &&
              $.inArray(libname, eextLibsInstalled) === -1 &&
              $.inArray(libname, descriptor.menus.liblist) !== -1))
          return;
        eextLibsToInstall.push(libname);
      };
      ext.addHTTPLib = function (liburi) {
        if (!($.inArray(libname, httpLibsToInstall) === -1 &&
              $.inArray(libname, httpLibsInstalled) === -1 &&
              liburi.slice(-14) ===
              '.mainfest.json'))
          return;
        httpLibsToInstall.push(liburi);
      };
      
      ext.loadLibs = function (callback) {
        // just for now, EEXT libs only.
        
        if (eextLibsToInstall.length === 0 &&
            httpLibsToInstall.length === 0) {
          callback();
          return;
        }
        
        EEXT.showInstallWindow(eextLibsToInstall, [], function (success) {
          
          if (success === 1) {
            isInstalled = true;
            isCanceled = false;
            isFailed = false;
            $.each(eextLibsToInstall, function(i, o) {
              eextLibsInstalled.push(o);
            });
            $.each(httpLibsToInstall, function(i, o) {
              httpLibsInstalled.push(o);
            });
            callback();
          } else if (success === 0) {
            isInstalled = false;
            isCanceled = true;
            isFailed = false;
            eextLibsToInstall = [];
            httpLibsToInstall = [];
            callback();
          } else {
            console.warn('Extension import failed: Error ' + success + '.');
            isInstalled = false;
            isCanceled = false;
            isFailed = true;
            eextLibsToInstall = [];
            httpLibsToInstall = [];
            callback();
          }
        });
      };
      
      // And now to register it with Scratch...
      ScratchExtensions.register('EEXT/importer', descriptor, ext);
      
      console.info('[EEXT] EEXT/importer inserted!');
      
      
      EEXT.statusColor = EEXT.scs.GOOD;
      EEXT.statusLetter = 'E';
      
      EEXT.updateStatus();
      
      EEXT.isWorking(false);
    }({}));
  };
  
  EEXT.installCount = 0;
  EEXT.totalInstalls = 0;
  EEXT.installWindow = 0;
  EEXT.extensionsArea = 0;
  EEXT.jsToImport = [];
  
  // Let's do some installing!
  EEXT.showInstallWindow = function (eextLibs, httpLibs, callback) {
    if (EEXT.isWorking()) {
      callback(-1);
      return;
    }
    
    EEXT.jsToImport = [];
    EEXT.isWorking(true);
    EEXT.installCount = 0;
    EEXT.totalInstalls = eextLibs.length;
    
    $('body').append($('<div>', {
      'class': 'EEXT-page-cover EEXT-toremove'
    }));
    
    EEXT.installWindow =  $('<div>', {
      'class': 'EEXT-modal EEXT-toremove'
    }).append(
      $('<div>', {
        text: 'Extension Install Request',
        'class': 'EEXT-title'
      }).append(
        $('<div>', {
          'text': '?',
          'class': 'EEXT-help',
          click: function () {} // this'll *totally* do something sometime
        })
      )
    ).append(
      $('<div>', {
        'class': 'EEXT-hmessage'
      }).append(
        'The project '
      ).append(
        $('<a>', {
          'text': EEXT.projectInfo.title,
          href: 'http://scratch.mit.edu/projects/' + EEXT.projectInfo.id,
          'class': 'EEXT-pname',
          'target': '_blank'
        })
      ).append(
        ' by '
      ).append(
        $('<a>', {
          'text': EEXT.projectInfo.creator,
          href: 'http://scratch.mit.edu/users/' + EEXT.projectInfo.creator,
          'class': 'EEXT-pname',
          'target': '_blank'
        })
      ).append(
        ' wants to use the following extensions:'
      )
    ).append(
      $('<div>', {
        'class': 'EEXT-extlist'
      })
    ).append(
      $('<input>', {
        'class': 'EEXT-extvs EEXT-extvx',
        id: 'EEXT-extvx',
        type: 'checkbox'
      })
    ).append(
      $('<label>', {
        'class': 'EEXT-extvxl',
        'for': 'EEXT-extvx'
      }).append(
        $('<div>', {
          'class': 'EEXT-mopt',
          'text': 'More Options'
        })
      )
    ).append(
      $('<button>', {
        'class': 'EEXT-install EEXT-maininstall EEXT-btn',
        'id': 'EEXT-MAININSTALL',
        'text': 'LOADING (...)',
        disabled: true
      })
    ).append(
      $('<button>', {
        'class': 'EEXT-nh EEXT-install EEXT-danger EEXT-tf EEXT-btn',
        'id': 'EEXT-INSTALLPROJ',
        'text': 'Always For Proj',
        disabled: true
      })
    ).append(
      $('<button>', {
        'class': 'EEXT-nh EEXT-install EEXT-danger EEXT-tf EEXT-btn',
        'id': 'EEXT-INSTALLUSR',
        'text': 'Always For User',
        disabled: true
      })
    ).append(
      $('<button>', {
        'class': 'EEXT-cancel EEXT-btn',
        'id': 'EEXT-CANCEL',
        'text': 'Cancel',
        disabled: true
      })
    );
    
    $('body').append(EEXT.installWindow);
    
    $('.EEXT-maininstall').text(
      'LOADING (' + (EEXT.totalInstalls - EEXT.installCount) + ')');
    
    EEXT.extensionsArea = $('.EEXT-extlist');
    
    $.each(eextLibs, function (i, req) {
      var j = i + 1;
      $.getJSON(
        'http://rawgit.com/bleush38p/EasyExtend/master/extensions/' +
        req + '.manifest.json'
      ).done(function (data) {
        if (typeof data.permissions === 'undefined')
          data.permissions = [];
        EEXT.extensionsArea.append(
          $('<input>', {
            'class': 'EEXT-extvs EEXT-extv' + j,
            'id': 'EEXT-extv' + j,
            'type': 'checkbox'
          })
        ).append(
          $('<label>', {
            'class': 'EEXT-extv' + j + 'l',
            'for': 'EEXT-extv' + j
          }).append(
            $('<div>', {
              'class': 'EEXT-extension',
              'id': 'EEXT-extno' + j
            }).append(
              $('<div>', {
                'class': 'EEXT-head'
              }).append(
                $('<span>', {
                  text: data.name
                })
              ).append(
                ' by '
              ).append(
                $('<a>', {
                  'class': 'EEXT-pname',
                  'text': data.author[0],
                  'href': data.author[1],
                  'target': '_blank'
                })
              ).append(
                $('<span>', {
                  'class': 'EEXT-p-count',
                  'text': data.permissions.length ? 
                    data.permissions.length : ''
                })
              )
            ).append(
              $('<div>', {
                'class': 'EEXT-body'
              }).append(
                $('<span>', {
                  text: data.desc
                })
              )
            )
          )
        );
        if (data.permissions.length)
          $('#EEXT-extno' + j).append(
            $('<div>', {
              'class': 'EEXT-permissions',
              'id': 'EEXT-permsno' + j,
              'text': 'This extension is allowed:'
            })
          );
        $.each(data.permissions, function (i, perm) {
          $('#EEXT-permsno' + j).append(
            $('<div>', {
              'class': 'EEXT-permission'
            }).append(
              $('<span>', {
                'text': (typeof perm === 'string'
                ? EEXT.perms[perm].name
                : perm.name) + ': '
              })
            ).append(
              typeof perm === 'string'
              ? EEXT.perms[perm].desc
              : perm.desc
            )
          );
        });
        EEXT.jsToImport.push(
          'http://rawgit.com/bleush38p/EasyExtend/master/extensions/' +
          data.js[0]);
        EEXT.checkLoadFinished(callback);
      }).fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ', ' + error;
        console.group('EEXT couldn\'t load an extension!');
        console.warn('Request failed: ' + err);
        console.info('Make sure the URL is correct.');
        console.groupEnd();
        EEXT.checkLoadFinished(callback, true);
      });
    });
    
  };
  
  EEXT.installFailed = 0;
  EEXT.checkLoadFinished = function(callback, failed) {
    if (failed) {
      EEXT.installFailed = true;
    }
    EEXT.installCount++;
    if (EEXT.installCount === EEXT.totalInstalls) {
      if (EEXT.installFailed) {
        EEXT.installFailed = false;
        $('#EEXT-CANCEL').click(function(){
          $('.EEXT-toremove').remove();
          callback(-2);
          EEXT.isWorking(false);
        }).removeAttr('disabled');
        $('#EEXT-MAININSTALL')
          .text('FAILED!')
          .addClass('.EEXT-danger');
      } else {
        $('.EEXT-btn').removeAttr('disabled');
        $('.EEXT-maininstall').text('INSTALL ' + EEXT.totalInstalls);

        $('#EEXT-CANCEL').click(function() {
          $('.EEXT-toremove').remove();
          EEXT.isWorking(false);
          callback(0);
        });
        
        $('#EEXT-MAININSTALL').click(function() {
          $('.EEXT-toremove').remove();
          $.each(EEXT.jsToImport, function(i, js) {
            $('body').append(
              $('<script>', {
                'type': 'text/javascript',
                'src': js
              })
            );
          });
          EEXT.isWorking(false);
          callback(1);
        });
      }
    }
  };
  
  // Quick Access
  
  EEXT.projectInfo = Scratch.INIT_DATA.PROJECT.model;
  
  EEXT.scratchLoaded = function () {
    // This will try to see if the Scratch player is finished loading or not.
    try {
      return $('#scratch')[0].PercentLoaded() == 100;
    } catch (e) {
      return false;
    }
  };
  
  EEXT.isWorking = function (v) {
    if (typeof v == 'boolean')
      if (v) {
        $('.EEXT-main').addClass('EEXT-loading');
        $('.EEXT-status').addClass('EEXT-invis');
        $('.EEXT-loader').removeClass('EEXT-invis');
        return true;
      } else {
        $('.EEXT-main').removeClass('EEXT-loading');
        $('.EEXT-status').removeClass('EEXT-invis');
        $('.EEXT-loader').addClass('EEXT-invis');
        return false;
      }
    else return $('.EEXT-main').hasClass('EEXT-loading');
  };
  
  // PERMISSIONS
  EEXT.perms = {
    INTERNETACCESS: {
      name: 'Full internet access',
      desc: 'Access the internet in an unrestricted manner.'
    }
  };
  
  // Status color/letter
  EEXT.updateStatus = function () {
    $('.EEXT-main')
      .removeClass('EEXT-yellow EEXT-red')
      .addClass(EEXT.statusColor);
    $('.EEXT-status')
      .text(EEXT.statusLetter);
  };
  
  EEXT.scs = {
    GOOD: '',
    UNLOADED: 'EEXT-yellow',
    ERROR: 'EEXT-red'
  };
  
  // Notifications
  EEXT.notif = function (n) {
    // For now, this is in the console, but I'll make on-page notifications
    // once I'm done with this beginning stuff.
    console.group(n.title);
    console.log(n.info);
    console.info(n.sugg);
    console.groupEnd();
  };
  
  EEXT.n = {
    // Here's the different possible notifications.
    FAILEDLOAD: {
      title: 'Scratch doesn\'t appear to have loaded!',
      info: 'The scratch player either doesn\'t exist or isn\'t finished loading.',
      sugg: 'Try again when the project has finished loading. If that doesn\'t work, reload the page, and make sure you only start EasyExtend once the project inside the player is done loading.'
    }
  };
  
  // HTML/jQuery Obj Snippets
  EEXT.hs = {
    CSS: $('<link>', {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'http://rawgit.com/bleush38p/EasyExtend/master/main.user.js.css'
    }),
    
    FONT: $('<link>', {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'http://fonts.googleapis.com/css?family=Roboto:400,400italic,700,700italic'
    }),
    
    MAIN: $('<div>', {
      'class': 'EEXT-main EEXT-yellow',
      click: EEXT.load
    }).append(
      $('<span>', {
        text: 'E',
        'class': 'EEXT-status'
      })
    ).append(
      $('<div>', {
        'class': 'EEXT-loader EEXT-invis'
      })
    )
  };
  
  // And lastly, start it all up.
  $(EEXT.init);
}(jQuery, window)); // (All Scratch pages should have jQuery.)