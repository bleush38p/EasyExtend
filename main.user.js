// ==UserScript==
// @name       EasyExtend
// @author     bleush38p / jTron
// @namespace  http://scratch.mit.edu/users/jTron/
// @version    0.1
// @description  Easily and safely adds custom extensions to Scratch projects.
// @include    http://scratch.mit.edu/projects/*
// @copyright  2014+, bleush38p / jTron
// ==/UserScript==

!function($, root) {
  root.EEXT = {}; // Get it to exist, then we can just use EEXT from now on.
  EEXT.init = function () {
    // This will run as soon as the page is loaded.
    // It will start code that checks for the player, unless...
    console.info('[EEXT] Waiting for Scratch SWF to load...');

    // ...the player is already loaded:
    if (EEXT.scratchLoaded()) {
      EEXT.load();
      return;
    }

    // We'll keep testing for scratch every second, then.
    EEXT.loadTries = 0;
    EEXT.loadInt = setInterval(EEXT.testScratch, 1000);
    return;
  };
  EEXT.testScratch = function () {
    // If the player's loaded by now, we'll get started.
    if (EEXT.scratchLoaded()) {
      clearInterval(EEXT.loadInt);
      EEXT.load();
      return;
    }
    EEXT.loadTries++;
    
    // If it's been a minute, we'll give up.
    if (EEXT.loadTries > 60) {
      clearInterval(EEXT.loadInt);
      EEXT.notif(EEXT.n.FAILEDLOAD);
      return;
    }
  };
  EEXT.load = function () {
    setTimeout(function() {
      var ext = {};
      
      console.info('[EEXT] Scratch is ready! Ready to insert EEXT/importer');
      
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
          [' ', 'add EEXT library %m.liblist', 'addEEXTLib', ''],
          [' ', 'add external library %s', 'addHTTPLib', 'http://'],
          ['f', 'load missing libraries', 'loadLibs', ''],
          ['-'],
          ['h', 'when user installs libraries', 'onceInstalled'],
          ['h', 'when user cancels install', 'onceCanceled'],
          ['b', 'user installed libraries?', 'isInstalled'],
          ['b', 'user canceled install?', 'isCanceled']
        ],
        
        menus: {
          liblist: ['no libraries yet :(']
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
      
      ext.addEEXTLib = function (libname) { /* ... */ };
      ext.addHTTPLib = function (liburi)  { /* ... */ };
      
      ext.loadLibs   = function ()        { /* ... */ };
      
      // And now to register it with Scratch...
      ScratchExtensions.register('EEXT/importer', descriptor, ext);
      
      console.info('[EEXT] EEXT/importer inserted!');
    }, 5000); // That should give everything enough time, there's an odd update glitch sometimes
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

  // Notifications
  EEXT.notif = function (n) {
    // For now, this is a notification, but I'll make on-page notifications
    // once I'm done with this beginning stuff.
    console.group(n.title);
    console.log(n.info);
    console.info(n.sugg);
    console.groupEnd();
  }
  
  EEXT.n = {
    // Here's the different possible notifications.
    FAILEDLOAD: {
      title: 'Scratch didn\'t load in time!',
      info: 'Either the scratch player took too long to load, or something went wrong.',
      sugg: 'Try reloading the page.',

    }
  };
  
  // And lastly, start it all up.
  $(document).ready(EEXT.init);
}(jQuery, window); // (All Scratch pages should have jQuery.)