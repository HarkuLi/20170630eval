const fs = require('fs');
const URLSafeBase64 = require('urlsafe-base64');
var store = {};

function getKEY(req, res) {
  var key = req.swagger.params.KvKey.value;

  //key check
  if(URLSafeBase64.validate(key) && key){
    if(store[key]){
      let now =(new Date()).toISOString();
      res.json(200, {
        VALUE: store[key],
        TS: now
      });
    }
    else{
      res.json(404, {
        message: 'Key is not found',
      });
    }
  }
  else{
    res.json(400, {
      message: 'Bad Request',
    });
  }
}

function deleteKEY(req, res) {
  var key = req.swagger.params.KvKey.value;

  //key check
  if(URLSafeBase64.validate(key) && key){
    var resObj = {}
    var now = (new Date()).toISOString();
    
    if(store[key]){
      resObj.OLD_VALUE = store[key];
      delete store[key];
    }
    resObj.TS = now;
    res.json(200, resObj);
  }
  else{
    res.json(400, {
      message: 'Bad Request',
    });
  }
}

function postKEY(req, res) {
  var key = req.swagger.params.KvKey.value;
  var val = req.swagger.params.body.value.VALUE;

  //key check
  if(URLSafeBase64.validate(key) && key){
    let now = (new Date()).toISOString();
    store[key] = val;
    res.json(200, {
      TS: now,
    });
  }
  else{
    res.json(400, {
      message: 'Bad Request',
    });
  }
}

module.exports = {
  getKEY,
  deleteKEY,
  postKEY,
}
