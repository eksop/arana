var require = patchRequire(require)

var fs = require('fs')
var log = require('../src/log')

var casper = require('casper').create({
  verbose: false,
  logLevel: 'error',
  pageSettings: {
    loadImages: true,        // The WebPage instance used by Casper will
    loadPlugins: true         // use these settings
  },
  clientScripts: [
    './remote/parser.js',
    './remote/jquery.min.js'
  ]
})

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)')

casper.options.viewportSize = { width: 1920, height: 1080 }

casper.on('complete.error', function (err) {
  log.debug('Complete Error: ', err, 'ERROR')
});

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
  log.debug('Resource Recieved: ' + response.url, response, 'INFO')
})

casper.on('page.resource.requested', function (request, network) {
  log.debug('Resource Requested: ' + request.url, request, 'INFO')
})

casper.on('page.error', function (msg, trace) {
  log.debug('Page Error: ' + msg, trace, 'ERROR')
})

// Casper Object related
casper.on('die', function (msg, status) {
  log.debug('Casper Die: ' + msg, {'msg': msg, 'status':status}, 'INFO')
})

casper.on('error', function (msg, trace) {
  log.debug('Casper Die: ' + msg, trace, 'ERROR')
})

casper.on('exit', function (status) {
  log.debug('Casper Exit: ' + status, {}, 'INFO')
})


exports.casper = casper
