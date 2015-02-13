###
// ==UserScript==
// @name        EasyExtend
// @namespace   https://bleush38p.github.io/EasyExtend/
// @version     0.0.1.0
// @description Easily and safely adds custom extensions to Scratch projects.
// @include     http://scratch.mit.edu/projects/*
// @include     https://bleush38p.github.io/EasyExtend/*
// @copyright   2014-2015, bleush38p / jTron
// @grant       none
// ==/UserScript==
###
((root, $) ->

  if root.location.host is 'bleush38p.github.io'
    return $ ->
      $('a[href="#guides/start"]').text('guides').attr 'href', '#guides'

  version = '0.0.1.26'

  root.EEXT =
    getJSON: (url) -> # this fixes things when there's cloud data
      $.ajax
        dataType: 'json'
        url: url
        crossDomain: true

  if localStorage.EEXTlauncherOptions is undefined
    localStorage.EEXTlauncherOptions = JSON.stringify
      usecustom: no
      customurl: ''
      branch: 'rewrite-dist'
      autoupdate: yes
      verbose: no
      https: no

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
      localStorage.EEXTlauncherOptions = JSON.stringify
        usecustom: no
        customurl: ''
        branch: 'rewrite-dist'
        autoupdate: yes
        verbose: no
      options = JSON.parse localStorage.EEXTlauncherOptions
      console.log 'Reload the page for changes to take effect.'
    unset: ->
      localStorage.removeItem 'EEXTlauncherOptions'
      console.log 'Warning: Reloading the page will reset options.'
    update: (force) ->
      if options.verbose then console.debug "Requesting #{EEXT.url}update.json"
      EEXT.getJSON("#{EEXT.url}update.json")
        .done( (data) ->
          if force then return; # TODO: on-screen update notification
          if data.version isnt version
            if !force then console.log 'An update is available!'; return
            # TODO: on-screen update notification
          else console.debug 'No update available!' if options.verbose
        ).fail (jqxhr, status, error) ->
          console.error "Request failed: #{status}, #{error}"
      return

  if options.autoupdate then do EEXTlauncher.update

  if options.verbose
    console.debug "EEXT resource url set to #{EEXT.url}" if options.verbose
    console.debug "Loading Angular from #{if options.https then 'https' else 'http'}://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.11/angular.min.js"
    console.debug "Loading EEXT from #{EEXT.url}build/eext.js"

  $('body')
    .append($("""<script type="text/javascript" src="#{if options.https then 'https' else 'http'}://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.11/angular.min.js">"""))
    .append $ """<script type="text/javascript" src="#{EEXT.url}build/eext.js">"""

  console.debug "Angular and EEXT were injected successfully and should be loading." if options.verbose

  console.log 'EEXTlauncher ran successfully. Type EEXTlauncher._help() for more info.'

) window, jQuery