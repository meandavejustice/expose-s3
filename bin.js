#!/usr/bin/env node

var minimist = require('minimist');
var fs = require('fs');
var path = require('path');
var localtunnel = require('localtunnel');
var createServer = require('./');

var argv = minimist(process.argv.slice(2), {alias:{port:'p', quiet:'q', help:'h', tunnel:'t'}});
var configPath = argv._[0];

if (argv.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf-8'))
  return;
}
var config = JSON.parse(fs.readFileSync(configPath));
var server = createServer(config)

if (argv.tunnel) {
  var opts = {};

  localtunnel(config.port, function(err, tunnel) {
    if(argv.quiet) return;
    if (err) return console.log("localtunnel error", err);
    console.log('Availabe at %s', tunnel.url);
  });
}

if (!argv.quiet) {
  console.log('Exposing s3 bucket: %s on port %d', config.bucket, config.port);

  server.on('file', function(name) {
    console.log('Returning file: %s', name)
  })

  server.on('directory', function(name) {
    console.log('Returning directory: %s', name)
  })
}

server.listen(config.port);
