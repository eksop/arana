var require = patchRequire(require)

var casper = require('casper').create({
  verbose: true,
  logLevel: 'info',
  pageSettings: {
    loadImages: false,        // The WebPage instance used by Casper will
    loadPlugins: false         // use these settings
  },
  clientScripts: [
    './src/crawler/remote/parser.js'
  ]
})

casper.on('remote.message', function (msg) {
  this.echo('remote message caught: ' + msg)
})

casper.on('page.error', function (msg, trace) {
  this.echo('Error: ' + msg, 'ERROR')
})

casper.on('resource.error', function (msg) {
  this.echo('resource error: ' + msg)
})

casper.on('resource.received', function (resource) {
  // this.echo(resource.url)
})

// listening to a custom event
casper.on('new.page.loading', function () {
  this.log('Opening new page : ' + this.getCurrentUrl(), 'info')
})

// Set screen resolution
casper.options.viewportSize = { width: 1920, height: 1080 }

exports.casper = casper
