var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
	company_id: { type: String, default: '' },
    job_title: { type: String, default: '' },
    description: { type: String, default: '' },
    job_id: { type: String, default: '' },
    skill_set: { type: String, default: '' },
    location: { type: String, default: '' },
    experience_level: { type: String, default: '' }  

});

module.exports = mongoose.model('Job', jobSchema);
