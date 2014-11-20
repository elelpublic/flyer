var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema = {
  keyword: String,
  visitCount: Number,
  timeCreated: Date,
  lastModified: Date,
  stars: Number
};

module.exports = {
  model: mongoose.model('Keyword', new Schema( schema ) ),
  schema: schema
}

