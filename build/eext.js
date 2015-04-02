(function() {
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
      return debug("Ready to load EEXT.");
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
    return this._init(this.verbose ? function(m) {
      return console.debug("[EEXT] " + m);
    } : function() {});
  }).call(EEXT);

}).call(this);
