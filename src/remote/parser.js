function parseSelector (element, selector) {
  if (selector === '') {
    return element
  }

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
function parseShineListPage () {
  var rows = document.querySelectorAll('div.search_listing')
  var data = []

  var parse = [
    ['company_img', 'div.search_listingleft div.cmplogo a img', 'attr', 'src'],
    ['company_name', 'div.search_listingleft a em.cls_cmpname', 'text', ''],
    ['company_url', 'div.search_listingleft div.cmplogo a', 'attr', 'href'],
    ['description', 'div.search_listingleft a .srcresult', 'text', ''],
    ['experience', 'div.search_listingleft a span.snp_yoe', 'text', ''],
    ['id', 'div.search_listingleft a.cls_searchresult_a', 'attr', 'href'],
    ['location', 'div.search_listingleft a span.snp_yoe_loc em.snp_loc', 'text', ''],
    ['posted_on', 'div.apply .share_links', 'text', ''],
    ['skills', 'div.search_listingleft .skl ul', 'text', ''],
    ['title', 'div.search_listingleft a span.snp', 'text', ''],
    ['url', 'div.search_listingleft a.cls_searchresult_a', 'attr', 'href']
  ]

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

    console.log('Found a job : ' + job.id)

    data.push(job)
  })

  return data
}

/**
 * Scrape page data
 */
function parseNaukriListPage () {
  var rows = document.querySelectorAll('div.row[itemtype="http://schema.org/JobPosting"]')
  var data = []

  var parse = [
    ['company_img', 'a.content div.banner img', 'attr', 'src'],
    ['company_name', 'a.content span.org', 'text', ''],
    ['description', 'a.content div.more span.desc', 'text', ''],
    ['experience', 'a.content span.exp', 'text', ''],
    ['id', 'a.content', 'attr', 'href'],
    ['location', 'a.content span.loc', 'text', ''],
    ['posted_by', 'div.other_details div.rec_details a', 'text', ''],
    ['posted_on', 'div.other_details div.rec_details span.date', 'text', ''],
    ['salary', 'div.other_details span.salary', 'text', ''],
    ['skills', 'a.content div.more div.desc span.skill', 'text', ''],
    ['title', 'a.content span.desig', 'text', ''],
    ['url', 'a.content', 'attr', 'href']
  ]

  Array.prototype.forEach.call(rows, function (row) {
    var job = {}

    for (var i = 0; i < parse.length; i++) {
      setParsedValue(job, parse[i][0], row, parse[i][1], parse[i][2], parse[i][3])
    }

    if (job.id) {
      job.id = job.id.match(/^.*[^0-9]([0-9]+)\?src=.*$/)[1]
    }

    console.log('Found a job : ' + job.id)

    data.push(job)
  })

  return data
}

/**
 * Scrape page data
 */
function parseDotaCalendarPage () {
  var rows = document.querySelectorAll('#evcal > tbody > tr > td.evc-l')

  var data = []

  var parse = [
    ['day', 'div > div.ev-feed', 'attr', 'data-day']
  ]

  Array.prototype.forEach.call(rows, function (row) {
    var job = {
      'league': []
    }

    for (var i = 0; i < parse.length; i++) {
      setParsedValue(job, parse[i][0], row, parse[i][1], parse[i][2], parse[i][3])
    }

    var leagues = row.querySelectorAll('div > div.ev-feed > div.ev-block')

    var parseLeague = [
      ['id', 'div.ev-head > div > div.ev-ctrl > span', 'attr', 'data-event-id'],
      ['name', 'div.ev-head > div > div.ev-ctrl > span', 'text', ''],
      ['time', 'div.ev-head > span.ev-timer', 'text', ''],
      ['stage', 'div.ev-stage', 'text', '']
    ]

    Array.prototype.forEach.call(leagues, function (l) {
      var league = {
        'match': []
      }

      for (var i = 0; i < parseLeague.length; i++) {
        setParsedValue(league, parseLeague[i][0], l, parseLeague[i][1], parseLeague[i][2], parseLeague[i][3])
      }

      var matches = l.querySelectorAll('div.ev-body > div.ev-match > div')

      var parseMatch = [
        ['teams', 'span:nth-child(1)', 'text', ''],
        ['time', 'span:nth-child(2)', 'text', '']
      ]

      Array.prototype.forEach.call(matches, function (r) {
        var match = {}

        for (var i = 0; i < parseMatch.length; i++) {
          setParsedValue(match, parseMatch[i][0], r, parseMatch[i][1], parseMatch[i][2], parseMatch[i][3])
        }

        league['match'].push(match)
      })

      job['league'].push(league)
    })

    data.push(job)
  })

  return data
}

/**
 * Scrape page data
 */
function parseDotaTeamPage () {
  var rows = document.querySelectorAll('#team_filter > option')

  var data = []

  var parse = [
    ['name', '', 'text', ''],
    ['id', '', 'attr', 'value']
  ]

  Array.prototype.forEach.call(rows, function (row) {
    var team = {}

    for (var i = 0; i < parse.length; i++) {
      setParsedValue(team, parse[i][0], row, parse[i][1], parse[i][2], parse[i][3])
    }

    data.push(team)
  })

  return data
}

/**
 * Scrape page data
 */
function parseDotaLeaguePage () {
  var rows = document.querySelectorAll('#league_filter > option')

  var data = []

  var parse = [
    ['name', '', 'text', ''],
    ['id', '', 'attr', 'value']
  ]

  Array.prototype.forEach.call(rows, function (row) {
    var team = {}

    for (var i = 0; i < parse.length; i++) {
      setParsedValue(team, parse[i][0], row, parse[i][1], parse[i][2], parse[i][3])
    }

    data.push(team)
  })

  return data
}

/**
 * Scrape page data
 */
function parseListPage () {
  var host = window.location.host

  console.log('Host found from page : ' + host)

  if (host === 'www.shine.com') {
    return parseShineListPage()
  }

  if (host === 'www.naukri.com') {
    return parseNaukriListPage()
  }
}
