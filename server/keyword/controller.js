var model = require('./model');
exports.model = model.model;
var schema = model.schema;

exports.updateEntity = function( entity, req ) {
  
  for( var field in schema ) {
    if( typeof req.body[ field ] !== 'undefined' ) {
      entity[ field ] = req.body[ field ];
    }
  }
  
}      

