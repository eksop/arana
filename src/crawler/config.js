var require = patchRequire(require)

var hostWait = {
  'www.shine.com': 'div.search_listingleft a span.snp_yoe_loc em.snp_loc',
  'www.naukri.com': 'div.row[type=tuple]'
}

var hostNext = {
  'www.shine.com': [
    'input.cls_paginate.submit[data-type=next]'
  ],
  'www.naukri.com': [
    'div.pagination > a:nth-child(2) > button',
    'div.pagination > a > button'
  ]
}

/**
 * Extract domain name
 */
function extractHost (url) {
  var domain

  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2]
  } else {
    domain = url.split('/')[0]
  }

  // find & remove port number
  return domain.split(':')[0]
}

/**
 * Validate crawling
 */
function validateCrawl (url) {
  var host = extractHost(url)

  if (hostWait.hasOwnProperty(host) && hostNext.hasOwnProperty(host)) {
    return true
  }

  return false
}

function parseKeyInOptions (key, options, def) {
  def = typeof def !== 'undefined' ? def : false

  if (options.hasOwnProperty(key)) {
    return options[key]
  }

  return def
}

exports.parseKeyInOptions = parseKeyInOptions

exports.getWaitSelector = function getWaitSelector (host) {
  return hostWait[host]
}

exports.getNextButtonSelector = function getNextButtonSelector (host) {
  return hostNext[host]
}

exports.getCrawlHost = function getCrawlHost (url) {
  return extractHost(url)
}

exports.parseCrawlUrl = function parseCrawlUrl (options) {
  var url = parseKeyInOptions('url', options)

  if (validateCrawl(url)) {
    return options.url
  }

  return false
}
