/**
 * Created by damo on 03/08/16.
 */
var fs = require('fs');
var prompt = require('prompt');
var Client = require('ssh2').Client;

var config,cache,next;

var sendPackage = function(config,next){
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
                        var command = 'tar -zxvf ' + config.ssh.dir + "/site.tar.gz -C " + config.ssh.dir;
                        console.log( "extracting : " + command );
                        conn.exec(command, function(err, stream) {
                            if (err) throw err;
                            stream.on('data', function(data, stderr) {
                                if (stderr) {
                                    console.log('STDERR: ' + data);
                                    next();
                                }
                                else {
                                    console.log('STDOUT: ' + data);
                                    next();
                                }
                            }).on('exit', function(code, signal) {
                                console.log('Exited with code ' + code);
                                next();
                            });

                        });
                        //process.exit( 0 );

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

var run = function(config,next){
    console.log('SEND Package');
    try {
        cache = JSON.parse(fs.readFileSync(__dirname + '/.cache', 'utf8'));
        sendPackage(config,next);
    } catch(err){
        console.log('SSH pasword :');
        prompt.start();
        prompt.get(['password'], function ( err, result ) {
            cache = {
                ssh_password: result.password
            };
            fs.writeFile(__dirname + '/.cache', JSON.stringify(cache), 'utf8');
            sendPackage(config,next);
        });

    }
}

module.exports = {
    run:run
}
