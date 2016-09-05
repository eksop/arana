var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var jobSchema = new Schema({
  job_url: String,
  job_title: String,
  company: String,
  company_url: String,
  company_img: String,
  apply_url: String,
  date: String,
  experience: String,
  location: String,
  description: String
});

module.exports = mongoose.model('Job', jobSchema);
