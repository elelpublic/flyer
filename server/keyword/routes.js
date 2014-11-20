var express = require('express');
var router = express.Router();   // get an instance of the express Router
var controller = require('./controller');
var model = require('./model').model;
var app = require('../app');

router.route('/keywords')

  // CREATE ---------------------
  .post(function(req, res) {
   
   var entity = new model();
   controller.updateEntity( entity, req );
  
   entity.save(function(err) {
     if (err)
       res.send(err);
  
     res.json({ message: 'Entity created!', entity: entity });
   });
   
  })
  
  // LIST ---------------------
  .get(function(req, res) {
    model.find(function(err, entities) {
      if (err)
        res.send(err);

      res.json(entities);
    });
  });



router.route('/keywords/:id')


  // READ ---------------------------
  .get(function(req, res) {
    model.findById(req.params.id, function(err, entity) {
     if (err)
       res.send(err);
     res.json(entity);
   });
  })
  
  // UPDATE ---------------------------
  .put(function(req, res) {

    model.findById(req.params.id, function(err, entity) {

      if (err)
        res.send(err);

      controller.updateEntity( entity, req );

      entity.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Entity updated!' });
      });

    });
  })
  

  // DELETE -------------------
  .delete(function(req, res) {
    model.remove({
      _id: req.params.id
    }, function(err, entity) {
      if (err)
        res.send(err);
  
      res.json({ message: 'Entity deleted' });
    });
  })
  
  ;

app.use('/api', router);


