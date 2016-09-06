var require = patchRequire(require)

var utils = require('utils')
var fs = require('fs')
// var config = require('config')

/**
 * Persist Data
 */
function persistData (casper, data, dir) {
  for (var i = 0; i < data.length; i++) {
    var job_id = data[i].id

    var file = dir + '/' + job_id + '.json'

    if (!fs.isDirectory(dir)) {
      if (!fs.makeDirectory(dir)) {
        casper.log('"' + dir + '" is NOT created.', 'error')
        casper.exit(4)
      }
    }

    if (!fs.exists(file)) {
      fs.write(file, JSON.stringify(data[i]), 'w')
      casper.log('xt job added to ' + file, 'info')
    }
  }
}

exports.persistData = persistData
