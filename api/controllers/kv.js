const fs = require('fs');
const URLSafeBase64 = require('urlsafe-base64');

function getKEY(req, res) {
  var key = req.swagger.params.KvKey.value;

  //key check
  if(URLSafeBase64.validate(key) && key){
    fs.readFile('store.dat', (err, data)=>{
      if(err) throw err;
      
      var store = JSON.parse(data);
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
    });
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
    fs.readFile('store.dat', (err, data)=>{
      if(err) throw err;
      
      var store = JSON.parse(data);
      var resObj = {}
      var now = (new Date()).toISOString();
      
      if(store[key]){
        resObj.OLD_VALUE = store[key];
        resObj.TS = now;
        
        delete store[key];
        fs.writeFile('store.dat', JSON.stringify(store), (err)=>{
          if(err){
            res.json(500, {
              message: 'Failed to write data.'
            });
            throw err;
          }
          else{
            res.json(200, resObj);
          }
        });
      }
      else{
        resObj.TS = now;
        res.json(200, resObj);
      }
    });
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
    fs.readFile('store.dat', (err, data)=>{
    if(err) throw err;

    var store = JSON.parse(data);
    store[key] = val;

    fs.writeFile('store.dat', JSON.stringify(store), (err)=>{
        if(err) throw err;
        let now = (new Date()).toISOString();
        res.json(200, {
          TS: now,
        });
      });
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
