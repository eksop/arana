var utils = require('utils')
var casper = require('../src/crawler/casper').casper
var config = require('../src/crawler/config')
//var log = require('../src/crawler/log')

var url = config.parseKeyInOptions('url', casper.cli.options, 'http://www.liquiddota.com/calendar/')
var type = config.parseKeyInOptions('type', casper.cli.options, 'event')

//log.logJson('Found URL: ' + url)

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
function getParseData (crawl) {
  console.log('value of crawl = ' + crawl)

  if (crawl === 'team') {
    return parseDotaTeamPage()
  }

  if (crawl === 'league') {
    return parseDotaLeaguePage()
  }

  return parseDotaCalendarPage()
}

var crawl = type

/**
 * Process page data
 */
function processPage () {
  this.evaluate(function (crawl) {
    return getParseData(crawl)
  }, crawl
  )

  var data = this.evaluate(getParseData)
  console.log(JSON.stringify(data))
}

casper.start(url)

casper.waitForSelector('#evcal > tbody > tr > td:nth-child(1) > div > div:nth-child(1) > span', processPage, stopScript)

casper.run(function () {
  casper.done()
})
