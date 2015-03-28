var http = require('http');
var path = require('path');
var cors = require('cors');

var sendJson = require("send-data/json");
var sendError = require("send-data/error");
var aws = require('aws-sdk');
var s3blobs = require('s3-blob-store');

module.exports = function(config) {
  var client = new aws.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  });

  var store = s3blobs({
    client: client,
    bucket: config.bucket
  });

  function formatResp(s3Obj) {
    return {
      "path": s3Obj.Key,
      "size": s3Obj.Size,
      "type": s3Obj.Size ? 'file': 'directory'
    }
  }

  function onrequest(req, res) {
    var name = req.url.replace(/%20/g, '\ ');
    if (!!~path.basename(name.indexOf('.'))) {
      store.exists({ key: name.slice(1)}, function(err, exists){
        if (err) sendError(req, res, { body: new Error(err) });
        else if (exists) {
          server.emit('file', name.slice(1));
          store.createReadStream({
            key: name.slice(1)
          }).pipe(res);
        }
      })
    } else {
      var reqCfg = {Bucket: config.bucket};
      if(name.length > 1) reqCfg.Prefix = name.slice(1);
      client.listObjects(reqCfg, function(err, resp) {
        if (err) sendError(req, res, { body: new Error(err) });
        server.emit('directory', name.slice(1));
        sendJson(req, res, resp.Contents.filter(function(obj) {
                             if (obj.Key.substr(0, obj.Key.length -1) == name.slice(1)) return false;
                             return obj.Key.split('/').length === name.split('/').length;
                           }).map(formatResp));
      });
    }
  }

  var c = cors();
  var server = http.createServer(function(req, res) {
                 c(req, res, function() {
                   onrequest(req, res)
                 })
               });
  return server;
}
