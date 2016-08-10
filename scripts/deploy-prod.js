#!/usr/bin/env node
console.log('Deploy prod');
var configManager = require(__dirname +'/config.js');
var packageTask = require(__dirname +'/build-package.js');
var sendTask = require(__dirname +'/send-package.js');


//console.log(toto);
console.log(packageTask);



var config = configManager.getConfig('prod');
var currentTaskIndex=0;

var exitTask = {
    run:function(){
        console.log("END");
        process.exit(0);
    }
}

var taskList = [
    packageTask.run,
    sendTask.run,
    exitTask.run
];

var executeNextStep = function(){
    currentTaskIndex++;
    taskList[currentTaskIndex](config, executeNextStep);
};

taskList[0](config,executeNextStep);













