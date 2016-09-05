var casper = require('casper').create();

var url = 'http://www.shine.com/job-search/simple/bangalore/';
var selector = 'div.search_listingleft a span.snp_yoe_loc em.snp_loc';

// Increase resolution https://stackoverflow.com/questions/22858088/how-can-i-maximize-the-browser-window-while-running-test-scripts-in-casperjs-usi
casper.options.viewportSize = { width: 3840, height: 2160 };

function getPageData() {
  // Scrape the links from top-right nav of the website
  //var elts = document.querySelectorAll('div.search_listingleft');
  var elts = document.querySelectorAll('div.search_listing');
  var results = [];

  for (var i = 0; i < elts.length; i++) {
    //var skills_raw = elts[i].querySelector("div.search_listingleft .sk.jsrp .skl ul").getElementsByTagName("li");
    //var skills = [];

    // for (var j = 0; j < skills_raw.length; j++) {
      // skills.push(skills_raw[j].textContent);
    // }

    data = {
      "jobUrl": elts[i].querySelector("div.search_listingleft a.cls_searchresult_a").getAttribute("href"),
      "jobTitle": elts[i].querySelector("div.search_listingleft a span.snp").textContent,
      "company": elts[i].querySelector("div.search_listingleft a em.cls_cmpname").textContent,
      "companyUrl": elts[i].querySelector("div.search_listingleft div.cmplogo a").getAttribute("href"),
      "companyImg": elts[i].querySelector("div.search_listingleft div.cmplogo a img").getAttribute("src"),
      "applyUrl": elts[i].querySelector("div.apply .cls_linkonhover a").getAttribute("data-jurl"),
      "postedOn": elts[i].querySelector("div.apply .share_links").textContent,
      "experience": elts[i].querySelector("div.search_listingleft a span.snp_yoe").textContent,
      "location": elts[i].querySelector("div.search_listingleft a span.snp_yoe_loc em.snp_loc").textContent,
      "description": elts[i].querySelector("div.search_listingleft a .srcresult").textContent
      // "skills": skills
    }

    results.push(data);
  }

  return results;
}

function stopScript() {
    this.echo("STOPPING SCRIPT").exit();
};

function processPage() {
    var pageData = this.evaluate(getPageData);//getPageData is your function which will do data scraping from the page. If you need to extract data from tables, from divs write your logic in this function

    this.echo("Here : " + pageData.length);

    for(var i in pageData) {
        this.echo("Job [" + i + "] : \n" + JSON.stringify(pageData[i]));
    }

    //If there is no nextButton on the page, then exit a script because we hit the last page
    if (this.exists("input.cls_paginate.submit") == false) {
        stopScript();
    }

	//If script didn't finish, then click on the next button and go to process next page
    this.thenClick("input.cls_paginate.submit").then(function() {
        this.waitForSelector(selector, processPage, stopScript);
    });
};

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
  this.echo(resource.url);
});


casper.start(url);
casper.waitForSelector(selector, processPage, stopScript);
casper.run();
