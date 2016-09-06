var storage = require('../src/storage')
var stdout = false

var data = []

var job = {}

job.id = '1'
job.url = 'httsp:..aaa'

data.push(job)

if (stdout) {
  printDataOnStdout(data)
} else {
  storage.persistData(data, '../scraped/www.test.com')
}

/**
 * Print on stdout
 */
function printDataOnStdout (data) {
  for (var i = 0; i < data.length; i++) {
    console.log(JSON.stringify(data[i]))
  }
}
