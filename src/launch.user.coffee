###
// ==UserScript==
// @name        EasyExtend
// @namespace   https://bleush38p.github.io/EasyExtend/
// @version     0.0.1.38
// @description Easily and safely adds custom extensions to Scratch projects.
// @include     http://scratch.mit.edu/projects/*
// @include     https://scratch.mit.edu/projects/*
// @include     https://bleush38p.github.io/EasyExtend/*
// @copyright   2014-2015, bleush38p / jTron
// @author      bleush38p / jTron
// @grant       none
// ==/UserScript==
###
((root, $) ->

  if root.location.host is 'bleush38p.github.io'
    return $ ->
      $('a[href="#guides/start"]').text('guides').attr 'href', '#guides'

  version = '0.0.1.40'

  # probably temporary
  $('head').append $("""
    <style type="text/css" id="EEXTTOREMOVE">
      .EEXT-notification {
        position: fixed;
        right: 15px;
        top: 50px;
        max-width: 300px;
        background: white;
        padding: 10px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        opacity: 0.9;
      }
      .EEXT-notification button {
        background: 0;
        border: 0;
        position: absolute;
        top: 12px;
        right: 12px;
        line-height: 1;
        padding: 0;
        height: 12px;
        font-size: 10px;
        text-transform: uppercase;
      }
      .EEXT-notification h1 {
        font-size: 16px;
        padding-right: 12px;

      }
      .EEXT-notification .EEXT-button {
        display: inline-block;
        text-transform: uppercase;
        float: right;
        padding: 2px 6px 1px 6px;
        margin-left: 2px;
      }
      .EEXT-notification .EEXT-button:hover {
        text-decoration: none;
        background-color: rgba(0,0,0,0.2);
      }
    </style>
    """)

  root.EEXT =
    getJSON: (url) -> # this fixes things when there's cloud data
      $.ajax
        dataType: 'json'
        url: url
        crossDomain: true
    notify: (persistant, main, alt, buttons) ->
      disappear = ->
        notif.fadeOut 500, -> do $(@).remove
      notif = $("""<div class="EEXT-notification">
                     <button>Close</button>
                     <h1>#{main}</h1>
                     <p>#{alt}</p>
                   </div>""")
      notif.find('button').click disappear
      buttons.forEach (button) ->
        $button = $("<a class=\"EEXT-button\" #{ if button[2]? and button[2] then 'target="_blank"' }>#{button[0]}</a>")
        if typeof button[1] is "string"
          $button.attr("href", button[1])
          if button[3]? and button[3] then $button.click disappear
        else
          $button.click button[1]
        notif.append $button
      $('body').append notif
      do notif.show
      if !persistant then setTimeout(disappear, 10 * 1000);

  if localStorage.EEXTlauncherOptions is undefined
    localStorage.EEXTlauncherOptions = JSON.stringify
      usecustom: no
      customurl: ''
      branch: 'rewrite-dist'
      autoupdate: yes
      verbose: no
      https: no # for now this is the default, we'll see where Scratch goes!

  options = JSON.parse localStorage.EEXTlauncherOptions

  EEXT.url = if options.usecustom then options.customurl else "#{if options.https then 'https' else 'http'}://rawgit.com/bleush38p/EasyExtend/#{options.branch}/"

  root.EEXTlauncher =
    _help: ->
      console.log '''
        EEXTlauncher._help(): print this help message
        EEXTlauncher.version(): print info about EEXTlauncher
        EEXTlauncher.options(): print option names and their values
        EEXTlauncher.options(optionName): print info about an option
        EEXTlauncher.options(optionName, value): set an option
        EEXTlauncher.reset(): reset EEXTlauncher to its default state
        EEXTlauncher.unset(): remove EEXTlauncher data storage
        EEXTlauncher.update(): force an update check
        EEXTlauncher.update(false): check for an update, but don\'t update if one is available
        EEXTlauncher.update(true): reload the userscript regardless of whether an update is available
      '''
    version: ->
      console.log 'EEXTlauncher version ' + version
      EEXTlauncher.update no
    options: (optionName, value) ->
      if !optionName?
        console.log """
          usecustom: #{options.usecustom} (false) whether to use customurl as the path to online EEXT resources
          customurl: "#{options.customurl}" ("") the url to use as the path to online EEXT resources (see https://bleush38p.github.io/EasyExtend/#launcher/customurl)
          branch: "#{options.branch}" ("rewrite-dist") the github branch or tag to use for online EEXT resources (see https://bleush38p.github.io/EasyExtend/#launcher/branch)
          autoupdate: #{options.autoupdate} (true) whether to check for updates automatically
          verbose: #{options.verbose} (false) whether EEXT should spew debug info all over the place
          https: #{options.https} (false) whether to use https to load online resources
        """
        return
      return console.warn "#{optionName} isn't an option!" if !(optionName in ['usecustom','customurl','branch','autoupdate','verbose','https'])
      return options[optionName] if !value?
      switch optionName
        when 'usecustom'
          if typeof value is 'boolean' then options.usecustom = value else return console.warn 'Value for usecustom should be a boolean!'
        when 'autoupdate'
          if typeof value is 'boolean' then options.autoupdate = value else return console.warn 'Value for autoupdate should be a boolean!'
        when 'verbose'
          if typeof value is 'boolean' then options.verbose = value else return console.warn 'Value for verbose should be a boolean!'
        when 'customurl'
          if typeof value is 'string' then options.customurl = value else return console.warn 'Value for customurl should be a string!'
        when 'branch'
          if typeof value is 'string' then options.branch = value else return console.warn 'Value for branch should be a string!'
        when 'https'
          if typeof value is 'boolean' then options.https = value else return console.warn 'Value for https should be a boolean!'
        else throw Error 'Uh oh... Report this error (EEXTlauncher:options:switch:default) and what you typed leading up to it at https://github.com/bleush38p/EasyExtend/issues'
      localStorage.EEXTlauncherOptions = JSON.stringify options
      console.log 'Reload the page for changes to take effect.'
    reset: ->
      localStorage.removeItem 'EEXTlauncherOptions'
      console.log 'Reload the page for changes to take effect.'
    unset: ->
      localStorage.removeItem 'EEXTlauncherOptions'
      console.log 'Warning: Reloading the page will reset options.'
    update: (force) ->
      if options.verbose then console.debug "Requesting #{EEXT.url}update.json"
      EEXT.getJSON("#{EEXT.url}update.json")
        .done( (data) ->
          if force then return update data
          if data.version isnt version
            if force? then console.log "An update is available! (#{data.version}) Run EEXTlauncher.update()"; return
            update data
          else console.debug 'No update available!' if options.verbose
        ).fail (jqxhr, status, error) ->
          console.error "Request failed: #{status}, #{error}"
      return
  update = (data) ->
    EEXT.notify yes,
      "An update to EEXT is available!",
      "Version #{data.version}. Reload this page after updating.", [["Update", "#{EEXT.url}#{data.update}", no, yes], ["Release Notes", "https://bleush38p.github.io/EasyExtend/#changelog", yes, no]]

  if options.autoupdate then do EEXTlauncher.update

  if options.verbose
    console.debug "EEXT resource url set to #{EEXT.url}"
    # console.debug "Loading Angular from #{if options.https then 'https' else 'http'}://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.11/angular.min.js"
    console.debug "Loading EEXT from #{EEXT.url}build/eext.js"
    console.debug "Loading EEXT css from #{EEXT.url}build/eext.css"

  $('body')
    # .append($ """<script type="text/javascript" src="#{if options.https then 'https' else 'http'}://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.11/angular.min.js">""")
    .append($ """<script type="text/javascript" src="#{EEXT.url}build/eext.js">""")
    .append $ """<link rel="stylesheet" type="text/css" href="#{EEXT.url}build/eext.css">"""

  # console.debug "Angular and EEXT were injected successfully and should be loading." if options.verbose
  console.debug "EEXT was injected successfully and should be loading." if options.verbose
  console.log 'EEXTlauncher ran successfully. Type EEXTlauncher._help() for more info.'

) window, jQuery