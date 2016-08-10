#!/usr/bin/env node
console.log('Deploy local');
var configManager = require(__dirname +'/config.js');
var cacheManager = require(__dirname +'/cache.js');
var fsx = require('fs-extra');
var prompt = require('prompt');
var config = configManager.getConfig('local');

console.log(config);
var cache;

var run = function(){
    console.log('Cleaning...');
    fsx.removeSync(cache.www);

    console.log('Deploying...');
    for(var i=0; i<config.includes.length; i++){
        var target = config.includes[i];
        fsx.copySync( './' + target, cache.www+target);
    }
    console.log('Deploy DONE to' + cache.www);
}


try {
    cache = cacheManager.getCache('local');
    run();
} catch(err){
    console.log('Output Folder :');
    prompt.start();
    prompt.get(['www'], function ( err, result ) {
        cache = {
            www: result.www
        };
        cacheManager.setCache('local',cache);
        run();
    });

}