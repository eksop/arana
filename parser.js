/**
 * Scrape page data
 */
function parseShinePage() {
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
 * Scrape page data
 */
function parsePage() {
  var host = window.location.host;

  if (host == "www.shine.com") {
    return parseShinePage();
  }
}
