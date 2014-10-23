(function(ext){
  ext._shutdown = function () {};
  
  ext._getStatus = function () {
    return {status: 2, msg: 'Ready to love!'};
  };
  
  ext.showLove = function () {
    alert('I love you!');
  };
  
  ext.isLoving = function () {
    return true;
  };
  
  var descriptor = {
    blocks: [
      [' ', 'show some love', 'showLove'],
      ['b', 'has lots of love?', 'isLoving']
    ]
  }
  
  ScratchExtensions.register('EEXT/Sample', descriptor, ext);
}({}));