var utils = require('utils')
var casper = require('../src/casper').casper
var option = require('../src/option')
var log = require('../src/log')

// Parse options
var url = option.get('url', casper.cli.options, null)
var crawler = option.get('crawler', casper.cli.options, null)
var page = option.get('page', casper.cli.options, 50)
var test = option.get('test', casper.cli.options)

var json = require(crawler)

var host = json['host']
var waiter = json['waiter']
var pagination = json['pagination']

var count = 0

/**
 * Stop the script
 */
function stop_script () {
  log.debug('xt stopping script prematurely', {}, 'ERROR')
  casper.exit(3)
}

/**
 * Process page data
 */
function process_page () {
  count += 1

  if (test) {
    this.capture('screen/page_' + count + '.png')
  }

  var data = this.evaluate(function (json) {
    // parse_page exists in remote parser.js
    return parse_page(json)
  }, json)

  log.debug('Found new jobs : ' + data.length)

  print_data(data)

  var paginate = null

  for (var i = 0; i < pagination.length; i++) {
    if (this.exists(pagination[i]) === true) {
      paginate = pagination[i]

      log.debug('Button exists : ' + pagination[i])
      break
    }

    log.debug('Button not exists : ' + pagination[i])
  }

  if (paginate == null) {
    log.debug('Next button not found')
    casper.exit(0)
  }

  // If we have crawled maximum
  if (page !== 0 && count >= page) {
    log.debug('End of count against pages : ' + count)
    casper.exit(0)
  }

  // If script didn't finish, then click on the next button and go to process next page
  this.thenClick(paginate).then(function () {
    this.wait(2000, function () {
      this.waitForSelector(waiter, process_page, stop_script)
    })
  })
}

/**
 * Print on stdout
 */
function print_data (data) {
  for (var i = 0; i < data.length; i++) {
    console.log(JSON.stringify(data[i]))
  }
}

log.debug('Scraping data from : ' + host)

// Main
casper.start(url)
casper.waitForSelector(waiter, process_page, stop_script)
casper.run()
