var require = patchRequire(require)

var utils = require('utils')
var fs = require('fs')

/**
 * Persist Data
 */
function persistData (data, dir) {
  for (var i = 0; i < data.length; i++) {
    var job_id = data[i].id

    var file = dir + '/' + job_id + '.json'

    if (!fs.isDirectory(dir)) {
      if (!fs.makeDirectory(dir)) {
        console.log('"' + dir + '" is NOT created.')
        return
      }
    }

    if (!fs.exists(file)) {
      fs.write(file, JSON.stringify(data[i]), 'w')
      console.log('Job ID : ' + job_id + ' added')
    }
  }
}

exports.persistData = persistData
