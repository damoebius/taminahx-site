/**
 * Created by damo on 10/08/16.
 */
var fs = require('fs');

var getConfig = function(env){
  return JSON.parse(fs.readFileSync(__dirname + '/' + env + '.json', 'utf8'));
};

module.exports = {
    getConfig:getConfig
};