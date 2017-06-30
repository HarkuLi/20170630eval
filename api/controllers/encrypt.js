const restify = require('restify');
const client = restify.createJsonClient({
  url: 'https://nkiua09s52.execute-api.ap-northeast-1.amazonaws.com'
});

function isHex(str){
  if(str && str.length%2 == 0){
    let re = /^[0-9A-Fa-f]+$/;
    if(re.exec(str)){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
}

function encrypt(req, res) {
  var plaintext = req.swagger.params.body.value.plaintext;
  if(isHex(plaintext)){
    if(plaintext.length > 32){
      res.json(413, {
        message: 'The decoded plaintext is to large'
      });
    }
    else{
      client.post('/dev/encrypt', {plaintext}, function(err, remote_req, remote_res, obj) {
        res.json(200, obj);
      });
    }
  }
  else{
    res.json(400, {
      message: 'Bad Request'
    });
  }
  
}

module.exports = {
  encrypt
}
