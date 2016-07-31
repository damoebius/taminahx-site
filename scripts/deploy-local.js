#!/usr/bin/env node
console.log('Deploy local');
var fs = require('fs');
var fsx = require('fs-extra');
var config = JSON.parse(fs.readFileSync(__dirname + '/local.json', 'utf8'));
fsx.removeSync(config.www);
fsx.copySync( './' , config.www);
console.log('Deploy DONE');

