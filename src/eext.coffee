# if EEXT doesn't exist yet, something's gone hella wrong.
unless EEXT? then return console.error "EEXT needs to be launched with the official loader."

# wrap this up all nice and shiny so we can map @ to EEXT
(->
  @verbose = @verbose?
  version = "0.0.0.9"

  if @verbose then console.debug "[EEXT] has been loaded successfully. (version #{version})"

  @_init = (pDebug)->
    debug = (m)-> pDebug "[_init] #{m}"
    @menuOpen = no
    @loaded = 0 # 0: unloaded; -1: error; 1: waiting, 2:loaded

    do $('#EEXTTOREMOVE').remove # clean up that temporary CSS
    @_createButton debug

  @_createButton = (pDebug)->
    debug = (m)-> pDebug "[_createButton] #{m}"
    debug "Creating EEXT button in navbar..."
    @$button = $ '<button>',
      text: 'E'
      class: 'EEXT-E'
      click: => # preserving EEXT as @
        tDebug = (m)-> debug "[$button:click] #{m}"
        if @loaded is 2 then @_toggleMenu tDebug else @_load tDebug
    $('#topnav .account-nav').after @$button
    debug "EEXT button ready in navbar."

  @_load = (pDebug)->
    debug = (m)-> pDebug "[_load] #{m}"
    debug "Ready to load EEXT."

  @_doneLoading = (pDebug)->
    debug = (m)-> pDebug "[_pDebug] #{m}"
    @loaded = 2


  @_toggleMenu = (pDebug)->
    debug = (m)-> pDebug "[_toggleMenu] #{m}"

  @_loadExtension = (name, pDebug)->
    debug = (m)-> pDebug "[_loadExtension] #{m}"


  @_init if @verbose then (m)->console.debug "[EEXT] #{m}" else ->
).call EEXT