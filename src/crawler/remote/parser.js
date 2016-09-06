function parseSelector (element, selector) {
  if (element.querySelector(selector)) {
    return element.querySelector(selector)
  }

  return false
}

function parseElement (element, selector, type, attr) {
  attr = typeof attr !== 'undefined' ? attr : 'href'

  var ret = parseSelector(element, selector)

  if (ret === false) {
    return false
  }

  switch (type) {
    case 'attr':
      return ret.getAttribute(attr).replace(/^\s+|\s+$/g, '')
    case 'text':
      return ret.textContent.replace(/^\s+|\s+$/g, '')
  }

  return null
}

function setParsedValue (obj, key, element, selector, type, attr) {
  obj[key] = parseElement(element, selector, type, attr)
}

/**
 * Scrape page data
 */
function parseShinePage () {
  var rows = document.querySelectorAll('div.search_listing')
  var data = []

  var parse = [
    ['id', 'div.search_listingleft a.cls_searchresult_a', 'attr', 'href'],
    ['url', 'div.search_listingleft a.cls_searchresult_a', 'attr', 'href'],
    ['title', 'div.search_listingleft a span.snp', 'text'],
    ['company_name', 'div.search_listingleft a em.cls_cmpname', 'text'],
    ['company_url', 'div.search_listingleft div.cmplogo a', 'attr', 'href'],
    ['company_img', 'div.search_listingleft div.cmplogo a img', 'attr', 'src'],
    // ['apply_url', 'div.apply .cls_linkonhover a', 'attr', 'data-jurl'], // it's removed
    ['posted_on', 'div.apply .share_links', 'text'],
    ['experience', 'div.search_listingleft a span.snp_yoe', 'text'],
    ['location', 'div.search_listingleft a span.snp_yoe_loc em.snp_loc', 'text'],
    ['description', 'div.search_listingleft a .srcresult', 'text']
  ]

  /*
  var skills_raw = row.querySelector('div.search_listingleft .skl ul').getElementsByTagName('li');
  var skills = [];

  for (var j = 0; j < skills_raw.length; j++) {
    skills.push(skills_raw[j].textContent);
  }
  */

  Array.prototype.forEach.call(rows, function (row) {
    var job = {}

    for (var i = 0; i < parse.length; i++) {
      setParsedValue(job, parse[i][0], row, parse[i][1], parse[i][2], parse[i][3])
    }

    if (job.id) {
      job.id = job.id.match(/^.*\/([0-9]+)\/$/)[1]
    }

    if (job.url) {
      job.url = window.location.protocol + '//' + window.location.host + job.url
    }

    if (job.posted_on) {
      job.posted_on = job.posted_on.match(/^Posted Date\s+(.*)$/)[1]
    }

    data.push(job)
  })

  return data
}

/**
 * Scrape page data
 */
function parseNaukriPage () {
  var rows = document.querySelectorAll('div.row[itemtype="http://schema.org/JobPosting"]')
  var data = []

  var parse = [
    ['id', 'a.content', 'attr', 'href'],
    ['url', 'a.content', 'attr', 'href'],
    ['title', 'a.content span.desig', 'text', ''],
    ['experience', 'a.content span.exp', 'text', ''],
    ['location', 'a.content span.loc', 'text', ''],
    ['salary', 'div.other_details span.salary', 'text', ''],
    ['posted_by', 'div.other_details div.rec_details a', 'text', ''],
    ['posted_on', 'div.other_details div.rec_details span.date', 'text', ''],
    ['company_name', 'a.content span.org', 'text', ''],
    ['company_img', 'a.content div.banner img', 'attr', 'src'],
    ['description', 'a.content div.more span.desc', 'text', '']
  ]

  Array.prototype.forEach.call(rows, function (row) {
    var job = {}

    for (var i = 0; i < parse.length; i++) {
      setParsedValue(job, parse[i][0], row, parse[i][1], parse[i][2], parse[i][3])
    }

    if (job.id) {
      job.id = job.id.match(/^.*[^0-9]([0-9]+)\?src=.*$/)[1]
    }

    data.push(job)
  })

  return data
}

/**
 * Scrape page data
 */
function parsePage () {
  var host = window.location.host

  if (host === 'www.shine.com') {
    return parseShinePage()
  } else if (host === 'www.naukri.com') {
    return parseNaukriPage()
  }
}
