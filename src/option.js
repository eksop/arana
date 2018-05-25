var require = patchRequire(require)

var wait = {
  'www.shine.com': 'div.search_listingleft a span.snp_yoe_loc em.snp_loc',
  'www.naukri.com': 'div.row[type=tuple]'
}

var next = {
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
function get_host (url) {
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
* Get value of key if exists or return default
*/
function get (key, options, def) {
  def = typeof def !== 'undefined' ? def : false

  if (options.hasOwnProperty(key)) {
    return options[key]
  }

  return def
}

exports.get = get
exports.get_host = get_host
