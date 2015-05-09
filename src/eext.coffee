# screw you, webstorm
# if EEXT doesn't exist yet, something's gone hella wrong.
unless EEXT? then return console.error "EEXT needs to be launched with the official loader."

# wrap this up all nice and shiny so we can map @ to EEXT
(->
  @verbose = @verbose?
  version = "0.0.0.9"

  if @verbose then console.debug "[EEXT] has been loaded successfully. (version #{version})"

  # detection of player state
  do ()->
    old = window.onhashchange or ->
    window.onhashchange = (e)->
      EEXT._hashChange e, old
  @_hashChange = (e, old)->
    hash = location.hash
    $('body')["#{if hash is '#fullscreen' then 'add' else 'remove'}Class"] 'fullscreen'
    old e
  @_hashChange {}, -> #run to get current state
  # sneaky hacky method of determining full screen state in editor:
  # listen for changes to the opacity of the tip bar
  # first, a helper (might be used other places)
  # https://developer.mozilla.org/en/docs/Web/API/MutationObserver
  @_observe = (target, options, callback)->
    observer = (new MutationObserver callback)
    observer.observe target, options
    observer
  # now observe the tip bar
  @_observe $('#tip-bar')[0],
    {attributes: true, attributeFilter: ['style']},
    (mutations)->
      unless $('body').hasClass('editor') then return
      mutations.forEach (mutationRecord)->
        oldFS = $('body').hasClass('fullscreen')
        newFS = $('#tip-bar')[0].style.display is 'none'
        if newFS is oldFS then return
        $('body')["#{if newFS then 'add' else 'remove'}Class"] 'fullscreen'
        # console.log('state changed, editor:', true, '/ fullscreen:', newFS)

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
        @$button.removeClass 'EEXT-error'
        if @loaded is 2 then @_toggleMenu tDebug else @_load tDebug

    $('#pagewrapper').append @$button
    debug "EEXT button ready in navbar."

  @_load = (pDebug)->
    debug = (m)-> pDebug "[_load] #{m}"
    debug "Ready to load EEXT."
    unless @_scratchLoaded debug
      debug "Scratch isn't loaded yet or doesn't exist. Canceling load."
      @loaded = -1
      @$button.addClass 'EEXT-error'
      @notify false,
        "Launch failed",
        "Either there is no flash player on the page or it hasn't loaded yet. "+
          "<strong>Make sure you wait until the Scratch project is done loading to start EEXT.</strong>",
        [["OK", "#", no, yes]]
      return 0
    # now the actual loading shall begin!


  @_doneLoading = (pDebug)->
    debug = (m)-> pDebug "[_pDebug] #{m}"
    @loaded = 2


  @_toggleMenu = (pDebug)->
    debug = (m)-> pDebug "[_toggleMenu] #{m}"

  @_loadExtension = (name, pDebug)->
    debug = (m)-> pDebug "[_loadExtension] #{m}"

  @_scratchLoaded = (pDebug)->
    debug = (m)-> pDebug "[_scratchLoaded] #{m}"
    try $('#scratch')[0].PercentLoaded() is 100
    catch e then no

  # this'll let us run things in the console, for example:
  # EEXT._wrap('_loadExtension')('EEXT/math')
  @_wrap= (name)=>
    (args...)=>
      @[name] args..., (m)->
        console.debug "[_wrap] #{m}"

  @_init if @verbose then (m)->console.debug "[EEXT] #{m}" else ->
).call EEXT