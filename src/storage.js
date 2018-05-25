var require = patchRequire(require)

var utils = require('utils')
var fs = require('fs')
var log = require('./log')
/**
 * Persist Data
 */
function store (casper, data, file) {
  for (var i = 0; i < data.length; i++) {
    var dataId = data[i].id

    if (!fs.exists(file)) {
      fs.write(file, JSON.stringify(data[i]), 'w')
      log.debug('Data stored to ' + file)
    }
  }
}

exports.store = store
