var utils = require('utils')
var casper = require('../src/crawler/casper').casper
var config = require('../src/crawler/config')
var storage = require('../src/crawler/storage')
var log = require('../src/crawler/log')

/**
 * Get url from cli arguments
 *
 * @type array
 */
var url = config.parseCrawlUrl(casper.cli.options)

if (url === false) {
  casper.log('Wrong URL', 'error')
  casper.exit(2)
}

casper.log('Crawling URL : ' + url, 'info')

var count = 0

var host = config.getCrawlHost(url)
var selector = config.getWaitSelector(host)
var next_btn = config.getNextButtonSelector(host)
var pages = config.parseKeyInOptions('pages', casper.cli.options, 50)
var stdout = config.parseKeyInOptions('stdout', casper.cli.options) // Not used right now
var dest_dir = config.parseKeyInOptions('dest_dir', casper.cli.options, 'data/' + host)

// var dest_file = config.parseKeyInOptions('dest_file', casper.cli.options, 'data/' + host + '.json') // Not used right now
// var debug = config.parseKeyInOptions('debug', casper.cli.options)

casper.log('url: ' + url, 'info')
casper.log('host: ' + host, 'info')
casper.log('selector: ' + selector, 'info')
casper.log('next_btn: ' + next_btn, 'info')
casper.log('dest_dir: ' + dest_dir, 'info')

/**
 * Stop the script
 */
function stopScript () {
  casper.log('xt stopping script prematurely', 'error')
  casper.exit(3)
}

/**
 * Get parsed data
 */
function getParseData () {
  return parseListPage()
}

/**
 * Process page data
 */
function processPage () {
  count += 1

  var data = this.evaluate(getParseData)
  this.log('Found new jobs : ' + data.length, 'info')

  if (stdout) {
    printDataOnStdout(data)
  } else {
    storage.persistData(casper, data, dest_dir)
  }

  var next_sel = null

  for (var i = 0; i < next_btn.length; i++) {
    if (this.exists(next_btn[i]) === true) {
      next_sel = next_btn[i]

      this.log('Button found! : ' + next_btn[i], 'info')
      break
    }

    this.log('Button doesn\'t exists : ' + next_btn[i], 'info')
  }

  if (next_sel == null) {
    this.log('Next button not found', 'info')
    casper.exit(0)
  }

  // If we have crawled maximum
  if (pages !== 0 && count >= pages) {
    this.log('End of count against pages : ' + count, 'info')
    casper.exit(0)
  }

  // If script didn't finish, then click on the next button and go to process next page
  this.thenClick(next_sel).then(function () {
    this.waitForSelector(selector, processPage, stopScript)
  })
}

/**
 * Print on stdout
 */
function printDataOnStdout (data) {
  //log.logDebug('Got Data from URL', data)

  for (var i = 0; i < data.length; i++) {
    console.log(JSON.stringify(data[i]))
  }
}

// Main
casper.start(url)
casper.waitForSelector(selector, processPage, stopScript)
casper.run()
