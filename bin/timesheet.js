var utils = require('utils')
var casper = require('../src/crawler/casper').casper
var config = require('../src/crawler/config')

var url = config.parseKeyInOptions('url', casper.cli.options, 'http://attendance.ts.webyog.com/report.php#2712')

/**
 * Stop the script
 */
function stopScript () {
  casper.log('xt stopping script prematurely', 'error')
  casper.exit(5)
}

/**
 * Get parsed data
 */
function getParseData () {
  var data = {
    'reach_time': document.querySelector('#attendance > tbody > tr.odd > td:nth-child(2)').textContent.replace(/^\s+|\s+$/g, ''),
    'service_time': document.querySelector('#attendance > tbody > tr.odd > td:nth-child(6)').textContent.replace(/^\s+|\s+$/g, ''),
    'break_time': document.querySelector('#attendance > tbody > tr.odd > td:nth-child(5)').textContent.replace(/^\s+|\s+$/g, ''),
    'break_count': document.querySelector('#attendance > tbody > tr.odd > td:nth-child(4)').textContent.replace(/^\s+|\s+$/g, '')
  }

  return data
}

/**
 * Process page data
 */
function processPage () {
  casper.capture('homepage.png')

  var data = this.evaluate(getParseData)
  console.log(JSON.stringify(data))
}

casper.start(url)
casper.setHttpAuth('webyog', 'cameo15jay')

// casper.wait(10000, function () {
//  this.capture('homepage.png')
// })

casper.waitForSelector('table > tbody > tr.odd', processPage, stopScript)

casper.run(function () {
  casper.done()
})
