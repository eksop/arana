var require = patchRequire(require)

var fs = require('fs')
var utils = require('utils')

var LOG_ENTRY_START_DELIMITER = '------------------------>>'
var LOG_ENTRY_END_DELIMITER = '<<------------------------'

var TYPE_INFO = 'INFO'
var TYPE_DEBUG = 'DEBUG'
var TYPE_ERROR = 'ERROR'

var logFileJson = 'crawler_json.log'
var logFileDebug = 'crawler_debug.log'
var logFileError = 'crawler_error.log'
var logDirectory = 'logs'

function xtLogJson (message, debug, type, file, trace) {
  message = typeof message !== 'undefined' ? message : null
  type = typeof type !== 'undefined' ? type : TYPE_INFO
  debug = typeof debug !== 'undefined' ? debug : {}
  file = typeof file !== 'undefined' ? file : null
  trace = typeof trace !== 'undefined' ? trace : 2

  var log = new XtLog()

  return log.message(message, type).file(file).debug_info(debug).log_json(trace)
}

function xtLogDebug (message, debug, type, file, trace) {
  message = typeof message !== 'undefined' ? message : null
  type = typeof type !== 'undefined' ? type : TYPE_INFO
  debug = typeof debug !== 'undefined' ? debug : {}
  file = typeof file !== 'undefined' ? file : null
  trace = typeof trace !== 'undefined' ? trace : 2

  var log = new XtLog()

  return log.message(message, type).file(file).debug_info(debug).log_debug(trace)
}

function XtLog () {
  this._message = null
  this._file = null
  this._log_type = null
  this._debug_info = null
}

XtLog.prototype.message = function (message, errorLevel) {
  this._message = message
  this._log_type = errorLevel

  if (this._message === '' || this.message === null) {
    this._message = 'Developer attempted to log "empty message". Please fix.'
  }

  return this
}

XtLog.prototype.append_to_log = function (file, message) {
  try {
    return this._log_to_file(file, message)
  } catch (err) {
    // "do nothing", we don't have much choice here
    // Coz logging has failed (ie something wrong with HDD) and ...
    // doing anything else may not be fool proof.

    return false
  }
}

XtLog.prototype.debug_info = function (debugInfo) {
  this._debug_info = debugInfo

  return this
}

XtLog.prototype.file = function (file) {
  this._file = file

  return this
}

XtLog.prototype.log_it = function () {
  if (this._file == null) {
    throw (new Error('You should specify a file name!'))
  }

  return this._log_to_file(this._file, this._message)
}

XtLog.prototype._get_common_log_params = function () {
  var string = {}

  string['app_name'] = 'xt-crawler'
  string['timestamp'] = this._get_current_date_time()
  string['category'] = this._log_type
  string['message'] = this._message

  if (this._debug_info != null) {
    string['debug_info'] = JSON.stringify(this._debug_info)
  }

  return string
}

XtLog.prototype._get_current_date_time = function () {
  var today = new Date()
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

  return date + ' ' + time
}

XtLog.prototype._log_to_file = function (file, message) {
  var filePath = logDirectory + fs.separator + file

  if (!fs.isDirectory(logDirectory)) {
    fs.makeTree(logDirectory)

    if (!fs.makeDirectory(logDirectory)) {
      throw (new Error('Unable to create log directory' + logDirectory))
    }
  }

  if (fs.exists(filePath)) {
    fs.write(filePath, message, 'a')
  } else {
    fs.write(filePath, message, 'w')
  }

  return true
}

XtLog.prototype.log_json = function (traceNo) {
  traceNo = typeof traceNo !== 'undefined' ? traceNo : 1

  if (this._file === null) {
    var file = logFileJson
    this.file(file)
  }

  //TODO Get line no and source file etc

  var array = this._get_common_log_params()
  this._message = JSON.stringify(array)

  return this.log_it()
}

XtLog.prototype.log_debug = function (traceNo) {
  traceNo = typeof traceNo !== 'undefined' ? traceNo : 1

  if (this._file === null) {
    var file = logFileDebug
    this.file(file)
  }

  var startDelim = LOG_ENTRY_START_DELIMITER + '\n'
  var endDelim = '\n' + LOG_ENTRY_END_DELIMITER

  var date = this._get_current_date_time()

  var str = startDelim + this._log_type + '               ' + date

  str += '\nMessage: ' + this._message

  if (this._debug_info != null) {
    str += '\nDebug Info:\n' + JSON.stringify(this._debug_info, null, 2)
  }

  str += endDelim + '\n\n'

  this._message = str

  return this.log_it()
}

exports.json = xtLogJson
exports.debug = xtLogDebug
