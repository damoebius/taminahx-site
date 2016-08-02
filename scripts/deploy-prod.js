#!/usr/bin/env node
console.log('Deploy prod');
var fs = require('fs');
var fsx = require('fs-extra');
var targz = require('tar.gz');
var prompt = require('prompt');
var Client = require('ssh2').Client;

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
    sendPackage();

};

var sendPackage = function(){
    var conn = new Client();
    conn.on('ready', function() {
        console.log('Client :: ready');
        conn.sftp(
            function (err, sftp) {
                if ( err ) {
                    console.log( "Error, problem starting SFTP: %s", err );
                    process.exit( 2 );
                }

                console.log( "- SFTP started : " + config.ssh.dir );

                // upload file
                var readStream = fs.createReadStream( "site.tar.gz" );
                var writeStream = sftp.createWriteStream( config.ssh.dir + "/site.tar.gz" );

                // what to do when transfer finishes
                writeStream.on(
                    'close',
                    function () {
                        console.log( "- file transferred" );
                        sftp.end();
                        process.exit( 0 );
                    }
                );

                // initiate transfer of file
                readStream.pipe( writeStream );
            }
        );
    }).connect({
        host: config.ssh.ip,
        port: 22,
        username: config.ssh.user,
        password: cache.ssh_password
    });
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






