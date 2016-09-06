var storage = require('storage');
var stdout = false;

var data = [];

var job = {};

job.id = "1";
job.url = "httsp:..aaa";

data.push(job);

if (stdout) {
  printDataOnStdout(data)
} else {
  storage.persistData(data, "data/job/nao");
}

/**
 * Print on stdout
 */
function printDataOnStdout(data) {
  for (var i = 0; i < data.length; i++) {
    console.log(JSON.stringify(data[i]));
  }
}
