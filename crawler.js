var casper = require('casper').create({ verbose: true });
var utils = require("utils");
var fs = require('fs');

var debug = true;
var url = 'http://www.shine.com/job-search/simple/it/';
var selector = 'div.search_listingleft a span.snp_yoe_loc em.snp_loc';

var jobs = [];

/**
 * Scrape page data
 */
function getPageData() {
  var rows = document.querySelectorAll('div.search_listing');
  var data = [];

  /*
  var skills_raw = row.querySelector("div.search_listingleft .skl ul").getElementsByTagName("li");
  var skills = [];

  for (var j = 0; j < skills_raw.length; j++) {
    skills.push(skills_raw[j].textContent);
  }
  */

  Array.prototype.forEach.call(rows, function(row){
    var job = {}

    job.id = row.querySelector("div.search_listingleft a.cls_searchresult_a").getAttribute("href", 2).match(/^.*\/([0-9]+)\/$/)[1];
    job.url = window.location.protocol + "//" + window.location.host + row.querySelector("div.search_listingleft a.cls_searchresult_a").getAttribute("href", 2);
    job.title = row.querySelector("div.search_listingleft a span.snp").textContent;
    job.company = row.querySelector("div.search_listingleft a em.cls_cmpname").textContent;

    if (row.querySelector("div.search_listingleft div.cmplogo a")) {
      job.company_url = row.querySelector("div.search_listingleft div.cmplogo a").getAttribute("href", 2)
      job.company_img = row.querySelector("div.search_listingleft div.cmplogo a img").getAttribute("src")
    }

    job.apply_url = row.querySelector("div.apply .cls_linkonhover a").getAttribute("data-jurl", 2);
    job.date = row.querySelector("div.apply .share_links").textContent.replace(/^\s+|\s+$/g, '').match(/^Posted Date\s+(.*)$/)[1];
    job.experience = row.querySelector("div.search_listingleft a span.snp_yoe").textContent;
    job.location = row.querySelector("div.search_listingleft a span.snp_yoe_loc em.snp_loc").textContent;
    job.description = row.querySelector("div.search_listingleft a .srcresult").textContent;

    data.push(job);
  });

  return data;
}

/**
 * Stop the script
 */
function stopScript() {
    this.echo("STOPPING SCRIPT").exit();
};

/**
 * Process page data
 */
function processPage() {
    var data = this.evaluate(getPageData);

    this.echo("Found new jobs : " + data.length);
    var ret = persistData(data);

    jobs = jobs.concat(data);
    fs.write('data.json', JSON.stringify(jobs), 'w');

    /*
    for(var i in pageData) {
        this.echo("Job [" + i + "] : \n" + JSON.stringify(pageData[i]));
    }
    */

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


/**
 * Persist Data
 */
function persistData(data) {
  for (var i = 0; i < data.length; i++) {
    var job_id = data[i].id;
    var file = "data/job/" + job_id + ".json"

    if (fs.exists(file)) {
      if (debug) {
        console.log("Job ID : " + job_id + " already crawled");
      }
    } else {
      fs.write(file, JSON.stringify(data[i]), 'w');
      console.log("Job ID : " + job_id + " added");
    }
  }
}

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
casper.options.viewportSize = { width: 3840, height: 2160 };

// Main
casper.start(url);

casper.waitForSelector(selector, processPage, stopScript);

casper.run();
