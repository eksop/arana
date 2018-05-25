var require = patchRequire(require)

var utils = require('utils')
var fs = require('fs')

/**
 * Persist Data
 */
function persistData (casper, data, dir) {
  for (var i = 0; i < data.length; i++) {
    var dataId = data[i].id

    var file = dir + fs.separator + dataId + '.json'

    if (!fs.isDirectory(dir)) {
      if (!fs.makeDirectory(dir)) {
        casper.log('"' + dir + '" is NOT created.', 'error')
        casper.exit(4)
      }
    }

    if (!fs.exists(file)) {
      fs.write(file, JSON.stringify(data[i]), 'w')
      casper.log('xt data added to ' + file, 'info')
    }
  }
}

exports.persistData = persistData
