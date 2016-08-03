/**
 * Created by damo on 03/08/16.
 */
var fs = require('fs');
var fsx = require('fs-extra');
var targz = require('tar.gz');



var run = function (config,next){
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
    next();

};

module.exports = {
    run:run
}