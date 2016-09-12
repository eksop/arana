var require = patchRequire(require)

var casper = require('casper').create({
  verbose: true,
  logLevel: 'error',
  pageSettings: {
    loadImages: false,        // The WebPage instance used by Casper will
    loadPlugins: false         // use these settings
  },
  clientScripts: [
    './src/crawler/remote/parser.js'
  ]
})

casper.options.viewportSize = { width: 1920, height: 1080 }

casper.on('remote.message', function (msg) {
  this.log('xt remote message caught: ' + msg, 'info')
})

casper.on('page.error', function (msg, trace) {
  this.log('xt page error: ' + msg, 'ERROR', 'error')
})

casper.on('resource.error', function (msg) {
  this.log('xt resource error: ' + msg, 'info')
})

casper.on('resource.received', function (resource) {
  this.log('xt resource received: ' + resource.url, 'debug')
})

casper.on('remote.message', function (msg) {
  this.log('xt remote message: ' + msg, 'info')
})

// Custom event
casper.on('new.page.loading', function () {
  this.log('xt opening new page: ' + this.getCurrentUrl(), 'info')
})

exports.casper = casper
