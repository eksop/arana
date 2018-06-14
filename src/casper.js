var require = patchRequire(require)
var log = require('../src/log')

var casper = require('casper').create({
  verbose: false,
  logLevel: 'error',
  pageSettings: {
    loadImages: false,
    loadPlugins: true,
    webSecurityEnabled: false
  },
  clientScripts: [
    './remote/parser.js'
  ]
})

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11')

casper.options.viewportSize = { width: 1920, height: 1080 }

casper.on('complete.error', function (err) {
  log.debug('Complete Error: ', err, 'ERROR')
})

casper.on('remote.message', function (msg) {
  log.debug('Remote Message', msg, 'INFO')
})

// Any resource
casper.on('resource.error', function (request) {
  //log.debug('Resource Error: ' + request.url, request, 'INFO')
})

casper.on('resource.timeout', function (request) {
  //log.debug('Resource Timeout: ' + request.url, request, 'INFO')
})

casper.on('resource.recieved', function (response) {
  //log.debug('Resource Timeout: ' + request.url, request, 'INFO')
})

casper.on('resource.requested', function (request, network) {
  //log.debug('Resource Timeout: ' + request.url, request, 'INFO')
})


// Page related
casper.on('page.resource.received', function (response) {
  //log.debug('Resource Recieved: ' + response.url, response, 'INFO')
})

casper.on('page.resource.requested', function (request, network) {
  log.debug('Resource Requested: ' + request.url, request, 'INFO')
})

casper.on('page.error', function (msg, trace) {
  var stack = ['ERROR: ' + msg]
  if (trace && trace.length) {
    stack.push('TRACE:')
    trace.forEach(function (t) {
      stack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''))
    })
  }

  log.debug('Page Error: ' + msg, stack, 'ERROR')
})

// Casper Object related
casper.on('die', function (msg, status) {
  log.debug('Casper Die: ' + msg, {'msg': msg, 'status': status}, 'INFO')
})

casper.on('error', function (msg, trace) {
  var stack = ['ERROR: ' + msg]
  if (trace && trace.length) {
    stack.push('TRACE:')
    trace.forEach(function (t) {
      stack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''))
    })
  }

  log.debug('Casper Die: ' + msg, stack, 'ERROR')
})

casper.on('exit', function (status) {
  log.debug('Casper Exit: ' + status, {}, 'INFO')
})

exports.casper = casper
