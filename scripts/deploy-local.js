#!/usr/bin/env node
console.log('Deploy local');
var fs = require('fs');
var fsx = require('fs-extra');
var config = JSON.parse(fs.readFileSync(__dirname + '/local.json', 'utf8'));
fsx.removeSync(config.www);

for(var i=0; i<config.includes.length; i++){
    var target = config.includes[i];
    fsx.copySync( './' + target, config.www+target);
}


console.log('Deploy DONE to' + config.www);

