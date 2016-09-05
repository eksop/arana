var utils = require('utils')
var casper = require('app').app;
var config = require('config');
var storage = require('storage');

// console.log(JSON.stringify(casper.cli.options));

var url = config.parseCrawlUrl(casper.cli.options);

if (url == false)
{
  casper.log("Wrong URL", "error");
  casper.exit();
}

// casper.log("Crawling URL : " + url, "info");

var host = config.getCrawlHost(url);
var selector = config.getWaitSelector(host);
var next_btn = config.getNextButtonSelector(host);

var pages = config.parseKeyInOptions('pages', casper.cli.options, 50);
var debug = config.parseKeyInOptions('debug', casper.cli.options);
var destination = config.parseKeyInOptions('destination', casper.cli.options);

var count = 0;

// console.log("url: " + url);
// console.log("selector: " + selector);
// console.log("next_btn: " + next_btn);

/**
 * Stop the script
 */
function stopScript() {
    this.echo("STOPPING SCRIPT").exit();
};

/**
 * Get parsed data
 */
function getParseData() {
  return parsePage();
}

/**
 * Process page data
 */
function processPage() {
  count += 1;

  var data = this.evaluate(getParseData);
  this.echo("Found new jobs : " + data.length);

  var ret = storage.persistData(host, data, destination);

  // If there is no nextButton on the page, then exit a script because we hit the last page
  if (this.exists(next_btn) == false) {
    stopScript();
  }

  // If we have crawled maximum
  if (count >= pages) {
    stopScript();
  }

  //If script didn't finish, then click on the next button and go to process next page
  this.thenClick(next_btn).then(function() {
    this.emit('new.page.loading');
    this.waitForSelector(selector, processPage, stopScript);
  });
};

// Main
casper.start(url);
casper.waitForSelector(selector, processPage, stopScript);
casper.run();
