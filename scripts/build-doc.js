#!/usr/bin/env node
console.log('Building API documentation');
var exec = require('child_process').exec;
var cmd = "yuidoc -c yuidoc.json -e .hx -t theme";
exec(cmd, {}, function ( error, stdout, stderr ) {
    if ( error !== null ) {
        console.error(error);
    }
    else if ( stderr != null ) {
        console.log(stdout);
        console.log(stderr);
    }
    else {
        console.log(stdout);
    }
});


