// == math.js ==
// (c) 2014 bleush38p
// made with <3 for Scratch EasyExtend:
// github.com/bleush38p/EasyExtend

(function (ext) {
  ext._shutdown = function () {};
  
  ext._getStatus = function () {
    return {status: 2, msg: 'Ready.'};
  };
  
  var descriptor = {
    blocks: [
      ['b', 'EEXT/math ready?', 'ready'],
      ['-'],
      ['r', '%n ^ %n', 'exp', '2', '4'],
      ['b', '%n %m.mathops %n', 'mathops', '10', '=', '10'],
      ['b', '%b %m.boolops %b', 'boolops', '', '∧'],
      ['r', 'const %m.constants', 'constant', 'π'],
      ['b', '%m.bool', 'bool', 'true'],
      ['b', '%s JS truthy?', 'truthy', '']
    ],
    menus: {
      mathops: ['=', '<', '>', '≠', '≤', '≥'],
      boolops: ['∧', '∨', '→', '⊕', '≡'],
      constants: ['π', 'e', '√2', 'φ', 'L', 'α', 'δ', 'γ', 'K',
                 'R (LatmK⁻¹mol⁻¹)', 'R (JK⁻¹mol⁻¹)'],
      bool: ['true', 'false']
    },
    url: 'https://github.com/bleush38p/EasyExtend'
  };
  
  ext.ready = function () { return true; };
  
  ext.exp = function (base, power) {
    return Math.pow(base, power);
  };
  
  ext.mathops = function (x, op, y) {
    switch (op) {
    case '=':
      return x === y;
    case '<':
      return x < y;
    case '>':
      return x > y;
    case '≠':
      return x !== y;
    case '≤':
      return x <= y;
    case '≥':
      return x >= y;
    }
  };
  
  ext.boolops = function (x, op, y) {
    switch (op) {
    case '∧':
      return x && y;
    case '∨':
      return x || y;
    case '→':
      return !x || y;
    case '⊕':
      return (x || y) && !(x && y);
    case '≡':
      return x === y;
    }
  };
  
  ext.constant = function (n) {
    switch (n) {
    case 'π':
      return 3.14159265358979323846264338327950288;
    case 'e':
      return 2.71828182845904523536028747135266249;
    case '√2':
      return 1.41421356237309504880168872420969807;
    case 'φ':
      return 1.61803398874989484820458683436563811;
    case 'L':
      return 6.02214129e+23;
    case 'α':
      return 2.50290787509589282228390287321821578;
    case 'δ':
      return 4.66920160910299067185320382046620161;
    case 'γ':
      return 0.57721566490153286060651209008240243;
    case 'K':
      return 2.68545200106530644530971483548179569;
    case 'R (LatmK⁻¹mol⁻¹)':
      return 0.08205736;
    case 'R (JK⁻¹mol⁻¹)':
      return 8.2144621;
    }
  };
  
  ext.bool = function (m) {
    return m === 'true';
  };
  
  ext.truthy = function (v) {
    return !!v;
  };
  
  ScratchExtensions.register('EEXT/math', descriptor, ext);
}({}));
