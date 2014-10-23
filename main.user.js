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
    $('head').append(EEXT.hs.CSS); // I'm using stylish locally to test css
                                   // that hasn't been synced to GH yet.
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
          [' ', 'load missing libraries', 'loadLibs'],
          ['-'],
          ['h', 'when user installs libraries', 'onceInstalled'],
          ['h', 'when user cancels install', 'onceCanceled'],
          ['b', 'user installed libraries?', 'isInstalled'],
          ['b', 'user canceled install?', 'isCanceled']
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
      var onceInstalled = false,
          onceCanceled  = false,
          isInstalled   = false,
          isCanceled    = false;
      
      var rtrue = function () {return true;};
      
      // These should be true as soon as the extension is loaded!
      ext.onceReady = rtrue;
      ext.isReady = rtrue;
      
      ext.onceInstalled = function() {return onceInstalled;};
      ext.onceCanceled  = function() {return onceCanceled ;};
      ext.isInstalled   = function() {return isInstalled  ;};
      ext.isCanceled    = function() {return isCanceled   ;};
      
      ext.addEEXTLib = function (libname) {
        if (!($.inArray(libname, eextLibsToInstall) === -1 &&
              $.inArray(libname, eextLibsInstalled) === -1 &&
              $.inArray(libname, descriptor.menus.liblist) !== -1))
          return;
        eextLibsToInstall.push(libname);
        console.log(eextLibsToInstall);
      };
      ext.addHTTPLib = function (liburi)  {
        if (!($.inArray(libname, httpLibsToInstall) === -1 &&
              $.inArray(libname, httpLibsInstalled) === -1 &&
              liburi.slice(-14) ===
              '.mainfest.json'))
          return;
        httpLibsToInstall.push(liburi);
        console.log(httpLibsToInstall);
      };
      
      ext.loadLibs   = function ()        { /* ... */ };
      
      // And now to register it with Scratch...
      ScratchExtensions.register('EEXT/importer', descriptor, ext);
      
      console.info('[EEXT] EEXT/importer inserted!');
      
      
      EEXT.statusColor = EEXT.scs.GOOD;
      EEXT.statusLetter = 'E';
      
      EEXT.updateStatus();
      
      EEXT.isWorking(false);
    }({}));
  };
  
  // Quick Access
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