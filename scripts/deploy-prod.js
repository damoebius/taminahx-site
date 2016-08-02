#!/usr/bin/env node
console.log('Deploy prod');
var fs = require('fs');
var fsx = require('fs-extra');
var targz = require('tar.gz');
var prompt = require('prompt');

var config = JSON.parse(fs.readFileSync(__dirname + '/prod.json', 'utf8'));
var cache;

var buildPackage = function (){
    fsx.removeSync(config.build);
    console.log('Build folder removed');
    for(var i=0; i<config.includes.length; i++){
        var target = config.includes[i];
        fsx.copySync( './' + target, config.build+target);
    }
    console.log('Files copied');
    targz().compress(config.build, 'site.tar.gz', function(err){
        if(err)
            console.log('Something is wrong ', err.stack);

    });
    console.log('Compression Done');
    console.log('SSH pasword :' + cache.ssh_password);
    console.log('Deploy DONE to' + config.build);

}



try {
    cache = JSON.parse(fs.readFileSync(__dirname + '/.cache', 'utf8'));
    buildPackage();
} catch(err){
    console.log('SSH pasword :');
    prompt.start();
    prompt.get(['password'], function ( err, result ) {
        cache = {
            ssh_password: result.password
        };
        fs.writeFile(__dirname + '/.cache', JSON.stringify(cache), 'utf8');
        buildPackage();
    });

}






