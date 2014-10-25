// == storage.js ==
// (c) 2014 bleush38p
// made with <3 for Scratch EasyExtend:
// github.com/bleush38p/EasyExtend

(function(ext){
  ext._shutdown = function () {};
  
  ext._getStatus = function () {
    return {status: 2, msg: 'Ready.'};
  };
  
  var descriptor = {
    blocks: [
      ['b', 'EEXT/data ready?', 'ready'],
      ['-'],
      [' ', 'set %s to %s', 'storedata', 'name', '0'],
      ['r', '%s', 'fetchdata', 'name'],
      [' ', 'delete %s', 'removedata', 'name'],
      ['-'],
      [' ', 'set %s to %s for this creator', 'storeuserdata', 'name', '0'],
      ['r', '%s for this creator', 'fetchuserdata', 'name'],
      [' ', 'delete %s for this creator', 'removeuserdata', 'name'],
      ['-'],
      ['b', '%m.bool', 'bool', 'true']
    ],
    menus: {
      bool: ['true', 'false']
    },
    url: 'https://github.com/bleush38p/EasyExtend'
  };
  
  ext.ready = function () {return true;};
  
  ext.storedata = function (key, val) {
    EEXT.db.set('EEXTStore-' + EEXT.projectInfo.id + '-' + key, val);
  };
  ext.fetchdata = function (key) {
    return EEXT.db.get('EEXTStore-' + EEXT.projectInfo.id + '-' + key);
  };
  ext.removedata = function (key) {
    EEXT.db.remove('EEXTStore-' + EEXT.projectInfo.id + '-' + key);
  };
  
  ext.storeuserdata = function (key, val) {
    EEXT.db.set('EEXTStore-' + EEXT.projectInfo.creator + '-' + key, val);
  };
  ext.fetchuserdata = function (key) {
    return EEXT.db.get('EEXTStore-' + EEXT.projectInfo.creator + '-' + key);
  };
  ext.removeuserdata = function (key) {
    EEXT.db.remove('EEXTStore-' + EEXT.projectInfo.creator + '-' + key);
  };
  
  ext.bool = function (m) {
    return !!(m === 'true')
  }
  
  ScratchExtensions.register('EEXT/data', descriptor, ext);
}({}));