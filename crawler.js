var utils = require("utils");
var fs = require('fs');

var storage = require('storage');
var casper = require('app').app;

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

    //jobs = jobs.concat(data);

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


// Main
casper.start(url);
casper.waitForSelector(selector, processPage, stopScript);
casper.run();
