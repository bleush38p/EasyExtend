(function() {
  var __slice = [].slice;

  if (typeof EEXT === "undefined" || EEXT === null) {
    return console.error("EEXT needs to be launched with the official loader.");
  }

  (function() {
    var version;
    this.verbose = this.verbose != null;
    version = "0.0.0.9";
    if (this.verbose) {
      console.debug("[EEXT] has been loaded successfully. (version " + version + ")");
    }
    this._init = function(pDebug) {
      var debug;
      debug = function(m) {
        return pDebug("[_init] " + m);
      };
      this.menuOpen = false;
      this.loaded = 0;
      $('#EEXTTOREMOVE').remove();
      return this._createButton(debug);
    };
    this._createButton = function(pDebug) {
      var debug;
      debug = function(m) {
        return pDebug("[_createButton] " + m);
      };
      debug("Creating EEXT button in navbar...");
      this.$button = $('<button>', {
        text: 'E',
        "class": 'EEXT-E',
        click: (function(_this) {
          return function() {
            var tDebug;
            tDebug = function(m) {
              return debug("[$button:click] " + m);
            };
            _this.$button.removeClass('EEXT-error');
            if (_this.loaded === 2) {
              return _this._toggleMenu(tDebug);
            } else {
              return _this._load(tDebug);
            }
          };
        })(this)
      });
      $('#topnav .account-nav').after(this.$button);
      return debug("EEXT button ready in navbar.");
    };
    this._load = function(pDebug) {
      var debug;
      debug = function(m) {
        return pDebug("[_load] " + m);
      };
      debug("Ready to load EEXT.");
      if (!this._scratchLoaded(debug)) {
        debug("Scratch isn't loaded yet or doesn't exist. Canceling load.");
        this.loaded = -1;
        this.$button.addClass('EEXT-error');
        this.notify(false, "Launch failed", "Either there is no flash player on the page or it hasn't loaded yet. " + "<strong>Make sure you wait until the Scratch project is done loading to start EEXT.</strong>", [["OK", "#", false, true]]);
        return 0;
      }
    };
    this._doneLoading = function(pDebug) {
      var debug;
      debug = function(m) {
        return pDebug("[_pDebug] " + m);
      };
      return this.loaded = 2;
    };
    this._toggleMenu = function(pDebug) {
      var debug;
      return debug = function(m) {
        return pDebug("[_toggleMenu] " + m);
      };
    };
    this._loadExtension = function(name, pDebug) {
      var debug;
      return debug = function(m) {
        return pDebug("[_loadExtension] " + m);
      };
    };
    this._scratchLoaded = function(pDebug) {
      var debug, e;
      debug = function(m) {
        return pDebug("[_scratchLoaded] " + m);
      };
      try {
        return $('#scratch')[0].PercentLoaded() === 100;
      } catch (_error) {
        e = _error;
        return false;
      }
    };
    this._wrap = (function(_this) {
      return function(name) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this[name].apply(_this, __slice.call(args).concat([function(m) {
            return console.debug("[_wrap] " + m);
          }]));
        };
      };
    })(this);
    return this._init(this.verbose ? function(m) {
      return console.debug("[EEXT] " + m);
    } : function() {});
  }).call(EEXT);

}).call(this);
