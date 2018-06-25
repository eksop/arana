function parse_selector (element, selector) {
  if (selector === '') {
    return element
  }

  if (element.querySelector(selector)) {
    return element.querySelector(selector)
  }

  return false
}

function parse_element (element, selector, type, attr) {
  attr = typeof attr !== 'undefined' ? attr : 'href'

  var ret = parse_selector(element, selector)

  if (ret === false) {
    return ''
  }

  switch (type) {
    case 'attr':
      return ret.getAttribute(attr).replace(/^\s+|\s+$/g, '')
    case 'text':
      return ret.textContent.replace(/^\s+|\s+$/g, '')
  }

  return ''
}

function parse_link (element, selector, type, attr) {
  attr = typeof attr !== 'undefined' ? attr : 'url'

  if (selector == '') {
    element.click()
  } else {
    element.querySelector(selector).click()
  }

  console.log(element.querySelector(selector))

  if (attr == 'url') {
    var url = window.location.href
    console.log(url)
    window.history.back()

    return url
  }

  return ''
}

function parse_key (element, selector, parser) {
  var data = []
  var rows = element.querySelectorAll(selector)

  Array.prototype.forEach.call(rows, function (row) {
    var fetched = {}

    for (var i = 0; i < parser.length; i++) {

      if (parser[i][2] == 'loop') {
        fetched[parser[i][0]] = parse_key(row, parser[i][1], parser[i][3])
        continue
      }

      if (parser[i][2] == 'page') {
        fetched[parser[i][0]] = parse_link(row, parser[i][1], parser[i][3])
        continue
      }

      fetched[parser[i][0]] = parse_element(row, parser[i][1], parser[i][2], parser[i][3])
    }

    data.push(fetched)
  })

  return data
}

/**
 * Scrape page data
 */
function parse_page (json) {
  var selector = json['selector']
  var parser = json['parser']

  return parse_key (document, selector, parser)
}
