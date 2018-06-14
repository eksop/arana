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
var output = {}
output['error'] = false
output['original_url'] = url
output['data'] = []
output['next_url'] = null

/**
 * Stop the script
 */
function stop_script () {
  log.debug('xt stopping script prematurely', {}, 'ERROR')
  output['error'] = 'Timed out while waiting for selector'
  console.log(JSON.stringify(output))

  casper.exit(3)
}

/**
 * Process page data
 */
function process_page () {
  count += 1

  if (option.get('scroll', json, false)) {
    this.scrollToBottom()
  }

  if (test) {
    this.capture('screen/page_' + count + '.png')
  }

  var data = this.evaluate(function (json) {
    // parse_page exists in remote parser.js
    return parse_page(json)
  }, json)

  log.debug('Found new data : ' + data.length)

  var row = {}
  row['url'] = this.getCurrentUrl()
  row['data'] = data

  if (option.get('page', json, 'normal') === 'spa') {
    output['data'].length = 0
    output['data'].push(row)
  } else {
    output['data'].push(row)
  }

  var paginate = null

  for (var i = 0; i < pagination.length; i++) {
    if (this.exists(pagination[i]) === true) {
      paginate = pagination[i]

      log.debug('Button exists : ' + pagination[i])
      break
    }

    log.debug('Button not exists : ' + pagination[i])
  }

  // Do we have a next button
  if (paginate == null) {
    log.debug('Next button not found')
    console.log(JSON.stringify(output))

    casper.exit(0)
  }

  // If we have crawled maximum
  if (page !== 0 && count >= page) {
    log.debug('End of count against pages : ' + count)

    this.thenClick(paginate).then(function () {
      this.wait(5000, function () {
        this.waitForSelector(waiter, function () {
          count += 1
          output['next_url'] = this.getCurrentUrl()
          console.log(JSON.stringify(output))

          casper.exit(0)
        }, stop_script)
      })
    })
  }

  // If script didn't finish, then click on the next button and go to process next page
  this.thenClick(paginate).then(function () {
    this.wait(5000, function () {
      this.waitForSelector(waiter, process_page, stop_script)
    })
  })
}

log.debug('Scraping data from : ' + host)

// Main
casper.start(url)
casper.waitForSelector(waiter, process_page, stop_script)
casper.run()
