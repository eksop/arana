var casper = require('casper').create({
  verbose: true,
  logLevel: "error",
  clientScripts: [
    "parser.js"
  ]
});

var utils = require("utils");
var fs = require('fs');

var storage = require('storage');

var debug = true;
var url = 'http://www.shine.com/job-search/simple/it/';
var domain = storage.extractDomain(url)

var selector = 'div.search_listingleft a span.snp_yoe_loc em.snp_loc';

var jobs = [];

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
    var data = this.evaluate(getParseData);

    this.echo("Found new jobs : " + data.length);

    //console.log("Going to store it");
    var ret = storage.persistData(domain, data);

    jobs = jobs.concat(data);

    //fs.write('data.json', JSON.stringify(jobs), 'w');

    //If there is no nextButton on the page, then exit a script because we hit the last page
    if (this.exists("input.cls_paginate.submit[data-type=next]") == false) {
        stopScript();
    }

	//If script didn't finish, then click on the next button and go to process next page
    this.thenClick("input.cls_paginate.submit[data-type=next]").then(function() {
        this.emit('new.page.loading');
        this.waitForSelector(selector, processPage, stopScript);
    });
};

if (debug) {
  casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
  });

  casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
  });

  casper.on('resource.error', function(msg) {
    this.echo('resource error: ' + msg);
  });

  casper.on('resource.received', function(resource) {
    //this.echo(resource.url);
  });
}

// listening to a custom event
casper.on('new.page.loading', function() {
    this.echo('Crawling : ' + this.getCurrentUrl());
});

// Set screen resolution
casper.options.viewportSize = { width: 1920, height: 1080 };

// Main
casper.start(url);
casper.waitForSelector(selector, processPage, stopScript);
casper.run();
