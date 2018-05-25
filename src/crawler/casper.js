var require = patchRequire(require)

var fs = require('fs')
var log = require('../src/crawler/log')

var casper = require('casper').create({
  verbose: false,
  logLevel: 'error',
  pageSettings: {
    loadImages: true,        // The WebPage instance used by Casper will
    loadPlugins: true         // use these settings
  },
  clientScripts: [
    './src/remote/parser.js',
    './src/remote/jquery.min.js'
  ]
})

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)')

casper.options.viewportSize = { width: 1920, height: 1080 }

casper.on('complete.error', function (err) {
  log.logDebug('Complete Error: ', err, 'ERROR')
});

casper.on('remote.message', function (msg) {
  log.logDebug('Remote Message', msg, 'INFO')
})

// Any resource
casper.on('resource.error', function (request) {
  //log.logDebug('Resource Error: ' + request.url, request, 'INFO')
})

casper.on('resource.timeout', function (request) {
  //log.logDebug('Resource Timeout: ' + request.url, request, 'INFO')
})

casper.on('resource.recieved', function (response) {
  //log.logDebug('Resource Timeout: ' + request.url, request, 'INFO')
})

casper.on('resource.requested', function (request, network) {
  //log.logDebug('Resource Timeout: ' + request.url, request, 'INFO')
})


// Page related
casper.on('page.resource.received', function (response) {
  log.logDebug('Resource Recieved: ' + response.url, response, 'INFO')
})

casper.on('page.resource.requested', function (request, network) {
  log.logDebug('Resource Requested: ' + request.url, request, 'INFO')
})

casper.on('page.error', function (msg, trace) {
  log.logDebug('Page Error: ' + msg, trace, 'ERROR')
})

// Casper Object related
casper.on('die', function (msg, status) {
  log.logDebug('Casper Die: ' + msg, {'msg': msg, 'status':status}, 'INFO')
})

casper.on('error', function (msg, trace) {
  log.logDebug('Casper Die: ' + msg, trace, 'ERROR')
})

casper.on('exit', function (status) {
  log.logDebug('Casper Exit: ' + status, {}, 'INFO')
})


exports.casper = casper
