var casper = require('casper').create();
var links;

// Increase resolution https://stackoverflow.com/questions/22858088/how-can-i-maximize-the-browser-window-while-running-test-scripts-in-casperjs-usi
casper.options.viewportSize = {width: 3840, height: 2160};

function getLinks() {
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

casper.start('http://www.shine.com/job-search/simple/bangalore/');

casper.waitForSelector('div.search_listingleft a span.snp_yoe_loc em.snp_loc', function() {
    this.captureSelector('twitter.png', 'html');
});

casper.then(function () {
    links = this.evaluate(getLinks);

    this.echo("Here : " + links.length);

    for(var i in links) {
        this.echo("Job [" + i + "] : \n" + JSON.stringify(links[i]));
    }
});

casper.run(function () {
    casper.done();
});
