const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var SurveySchema = new mongoose.Schema({
    code: String,
    title: String,
    description: String,
    status: String,
    startDate: Date,
    endDate: Date,
    publishDate: Date,
    reminderDate1: Date,
    reminderDate2: Date,
    invite : Number,
    category: [{type: Schema.Types.ObjectId, ref: 'category'}],
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'user'},
    updatedAt: {type: Date, default: Date.now},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'user'}
}, {
    collection: 'survey'
});

SurveySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('survey', SurveySchema);