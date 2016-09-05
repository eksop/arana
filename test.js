
var Job = require('db.js');

Employee.find(function(err, jobs) {
  console.log(jobs);
});
