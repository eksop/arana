var utils = require('utils')
var casper = require('../src/crawler/casper').casper
var config = require('../src/crawler/config')

var action = config.parseKeyInOptions('action', casper.cli.options, 'login')
var url = config.parseKeyInOptions('url', casper.cli.options, 'http://192.168.5.1')

// var stdout = config.parseKeyInOptions('stdout', casper.cli.options) // Not used right now
// var dest_dir = config.parseKeyInOptions('dest_dir', casper.cli.options, 'scraped/' + host)

// var dest_file = config.parseKeyInOptions('dest_file', casper.cli.options, 'data/' + host + '.json') // Not used right now
// var debug = config.parseKeyInOptions('debug', casper.cli.options)

// casper.log('url: ' + url, 'info')
// casper.log('host: ' + host, 'info')
// casper.log('selector: ' + selector, 'info')
// casper.log('next_btn: ' + next_btn, 'info')
// casper.log('dest_dir: ' + dest_dir, 'info')

/**
 * Stop the script
 */
function stopScript () {
  casper.log('xt stopping script prematurely', 'error')
  casper.exit(5)
}

/**
 * Process page data
 */
function processHomePage () {
  casper.capture('homepage.png')

  // If script didn't finish, then click on the next button and go to process next page
  this.thenClick('#advanced_label').then(function () {
    this.emit('new.page.loading')
    this.waitForSelector('div.button_div > table > tbody > tr > td > input.reboot', processAdvancePage, stopScript)
  })
}

/**
 * Process page data
 */
function processAdvancePage () {
  casper.capture('advance.png')

  // If script didn't finish, then click on the next button and go to process next page
  this.thenClick('#icon1 > div.button_div > table > tbody > tr > td > input.reboot').then(function () {
    this.emit('new.page.loading')
  })
}

// Main
casper.start(url)
// casper.waitForSelector(selector, processPage, stopScript)
//

casper.setHttpAuth('admin', 'password')

casper.wait(10000, function () {
  this.capture('homepage.png')
})

casper.thenOpen('http://192.168.5.1/adv_index.htm')

casper.wait(10000, function () {
  this.capture('advance.png')
})

casper.waitForSelector('div.button_div > table > tbody > tr > td > input.reboot', processAdvancePage, stopScript)

// casper.waitForSelector('#advanced_label', processHomePage, stopScript)

// #attached > div.icon_name
// #advanced_label > b > span


casper.run(function () {
    casper.done()
})
