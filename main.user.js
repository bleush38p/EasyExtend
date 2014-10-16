// ==UserScript==
// @name       EasyExtend
// @namespace  http://scratch.mit.edu/users/jTron/
// @version    0.1
// @description  Easily and safely adds custom extensions to Scratch projects.
// @include    http://scratch.mit.edu/projects/*
// @copyright  2014+, bleush38p / jTron
// ==/UserScript==

var EEXT_ = {
  init: function () {
    console.log('[EEXT] Waiting for Scratch SWF to load...');
  },
  load: function () {
    
  }
};

$(document).ready(EEXT_.init);

alert('hi');