
/*
// ==UserScript==
// @name        EasyExtend
// @namespace   https://bleush38p.github.io/EasyExtend/
// @version     0.0.1.42
// @description Easily and safely adds custom extensions to Scratch projects.
// @include     http://scratch.mit.edu/projects/*
// @include     https://scratch.mit.edu/projects/*
// @include     https://bleush38p.github.io/EasyExtend/*
// @copyright   2014-2015, bleush38p / jTron
// @author      bleush38p / jTron
// @grant       none
// ==/UserScript==
 */
(function(root, $) {
  var debug, options, update, version;
  if (root.location.host === 'bleush38p.github.io') {
    return $(function() {
      return $('a[href="#guides/start"]').text('guides').attr('href', '#guides');
    });
  }
  version = '0.0.1.42';
  debug = function(m) {
    console.debug("[EEXTLauncher] " + m);
    return 0;
  };
  $('head').append($("<style type=\"text/css\" id=\"EEXTTOREMOVE\">\n  .EEXT-notification {\n    position: fixed;\n    right: 15px;\n    top: 50px;\n    max-width: 300px;\n    background: white;\n    padding: 10px;\n    box-shadow: 2px 2px 10px rgba(0,0,0,0.5);\n    opacity: 0.9;\n  }\n  .EEXT-notification button {\n    background: 0;\n    border: 0;\n    position: absolute;\n    top: 12px;\n    right: 12px;\n    line-height: 1;\n    padding: 0;\n    height: 12px;\n    font-size: 10px;\n    text-transform: uppercase;\n  }\n  .EEXT-notification h1 {\n    font-size: 16px;\n    padding-right: 12px;\n\n  }\n  .EEXT-notification .EEXT-button {\n    display: inline-block;\n    text-transform: uppercase;\n    float: right;\n    padding: 2px 6px 1px 6px;\n    margin-left: 2px;\n  }\n  .EEXT-notification .EEXT-button:hover {\n    text-decoration: none;\n    background-color: rgba(0,0,0,0.2);\n  }\n</style>"));
  root.EEXT = {
    getJSON: function(url) {
      return $.ajax({
        dataType: 'json',
        url: url,
        crossDomain: true
      });
    },
    notify: function(persistant, main, alt, buttons) {
      var disappear, notif;
      disappear = function() {
        return notif.fadeOut(500, function() {
          return $(this).remove();
        });
      };
      notif = $("<div class=\"EEXT-notification\">\n  <button>Close</button>\n  <h1>" + main + "</h1>\n  <p>" + alt + "</p>\n</div>");
      notif.find('button').click(disappear);
      buttons.forEach(function(button) {
        var $button;
        $button = $("<a class=\"EEXT-button\" " + ((button[2] != null) && button[2] ? 'target="_blank"' : void 0) + ">" + button[0] + "</a>");
        if (typeof button[1] === "string") {
          $button.attr("href", button[1]);
          if ((button[3] != null) && button[3]) {
            $button.click(disappear);
          }
        } else {
          $button.click(button[1]);
        }
        return notif.append($button);
      });
      $('body').append(notif);
      notif.show();
      if (!persistant) {
        return setTimeout(disappear, 10 * 1000);
      }
    }
  };
  if (localStorage.EEXTlauncherOptions === void 0) {
    localStorage.EEXTlauncherOptions = JSON.stringify({
      usecustom: false,
      customurl: '',
      branch: 'rewrite',
      autoupdate: true,
      verbose: false,
      https: true
    });
  }
  options = JSON.parse(localStorage.EEXTlauncherOptions);
  EEXT.url = options.usecustom ? options.customurl : "" + (options.https ? 'https' : 'http') + "://rawgit.com/bleush38p/EasyExtend/" + options.branch + "/";
  root.EEXTlauncher = {
    _help: function() {
      return console.log('EEXTlauncher._help(): print this help message\nEEXTlauncher.version(): print info about EEXTlauncher\nEEXTlauncher.options(): print option names and their values\nEEXTlauncher.options(optionName): print info about an option\nEEXTlauncher.options(optionName, value): set an option\nEEXTlauncher.reset(): reset EEXTlauncher to its default state\nEEXTlauncher.unset(): remove EEXTlauncher data storage\nEEXTlauncher.update(): force an update check\nEEXTlauncher.update(false): check for an update, but don\'t update if one is available\nEEXTlauncher.update(true): reload the userscript regardless of whether an update is available');
    },
    version: function() {
      console.log('EEXTlauncher version ' + version);
      return EEXTlauncher.update(false);
    },
    options: function(optionName, value) {
      if (optionName == null) {
        console.log("usecustom: " + options.usecustom + " (false) whether to use customurl as the path to online EEXT resources\ncustomurl: \"" + options.customurl + "\" (\"\") the url to use as the path to online EEXT resources (see https://bleush38p.github.io/EasyExtend/#launcher/customurl)\nbranch: \"" + options.branch + "\" (\"rewrite\") the github branch or tag to use for online EEXT resources (see https://bleush38p.github.io/EasyExtend/#launcher/branch)\nautoupdate: " + options.autoupdate + " (true) whether to check for updates automatically\nverbose: " + options.verbose + " (false) whether EEXT should spew debug info all over the place\nhttps: " + options.https + " (true) whether to use https to load online resources");
        return;
      }
      if (!(optionName === 'usecustom' || optionName === 'customurl' || optionName === 'branch' || optionName === 'autoupdate' || optionName === 'verbose' || optionName === 'https')) {
        return console.warn("" + optionName + " isn't an option!");
      }
      if (value == null) {
        return options[optionName];
      }
      switch (optionName) {
        case 'usecustom':
          if (typeof value === 'boolean') {
            options.usecustom = value;
          } else {
            return console.warn('Value for usecustom should be a boolean!');
          }
          break;
        case 'autoupdate':
          if (typeof value === 'boolean') {
            options.autoupdate = value;
          } else {
            return console.warn('Value for autoupdate should be a boolean!');
          }
          break;
        case 'verbose':
          if (typeof value === 'boolean') {
            options.verbose = value;
          } else {
            return console.warn('Value for verbose should be a boolean!');
          }
          break;
        case 'customurl':
          if (typeof value === 'string') {
            options.customurl = value;
          } else {
            return console.warn('Value for customurl should be a string!');
          }
          break;
        case 'branch':
          if (typeof value === 'string') {
            options.branch = value;
          } else {
            return console.warn('Value for branch should be a string!');
          }
          break;
        case 'https':
          if (typeof value === 'boolean') {
            options.https = value;
          } else {
            return console.warn('Value for https should be a boolean!');
          }
          break;
        default:
          throw Error('Uh oh... Report this error (EEXTlauncher:options:switch:default) and what you typed leading up to it at https://github.com/bleush38p/EasyExtend/issues');
      }
      localStorage.EEXTlauncherOptions = JSON.stringify(options);
      return console.log('Reload the page for changes to take effect.');
    },
    reset: function() {
      localStorage.removeItem('EEXTlauncherOptions');
      return console.log('Reload the page for changes to take effect.');
    },
    unset: function() {
      localStorage.removeItem('EEXTlauncherOptions');
      return console.log('Warning: Reloading the page will reset options.');
    },
    update: function(force) {
      if (options.verbose) {
        debug("Requesting " + EEXT.url + "update.json");
      }
      EEXT.getJSON("" + EEXT.url + "update.json").done(function(data) {
        if (force) {
          return update(data);
        }
        if (data.version !== version) {
          if (force != null) {
            console.log("An update is available! (" + data.version + ") Run EEXTlauncher.update()");
            return;
          }
          return update(data);
        } else {
          if (options.verbose) {
            return debug('No update available!');
          }
        }
      }).fail(function(jqxhr, status, error) {
        console.error("Request failed: " + status + ", " + error);
        return EEXT.notify(true, "Something's gone wrong...", "EEXT wasn't able to check for an update automatically. Check the console for additional details.", [["OK", "#", false, true]]);
      });
    }
  };
  update = function(data) {
    return EEXT.notify(true, "An update to EEXT is available!", "Version " + data.version + ". Reload this page after updating.", [["Update", "" + EEXT.url + data.update, false, true], ["Release Notes", "https://bleush38p.github.io/EasyExtend/#changelog", true, false]]);
  };
  if (options.autoupdate) {
    EEXTlauncher.update();
  }
  if (options.verbose) {
    debug("EEXT resource url set to " + EEXT.url);
    debug("Loading EEXT from " + EEXT.url + "build/eext.js");
    debug("Loading EEXT css from " + EEXT.url + "build/eext.css");
    EEXT.verbose = true;
  }
  $('body').append($("<script type=\"text/javascript\" src=\"" + EEXT.url + "build/eext.js\">")).append($("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + EEXT.url + "build/eext.css\">"));
  if (options.verbose) {
    debug("EEXT was injected successfully and should be loading.");
  }
  return console.log('EEXTlauncher ran successfully. Type EEXTlauncher._help() for more info.');
})(window, jQuery);
