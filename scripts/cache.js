/**
 * Created by damo on 10/08/16.
 */

var fs = require('fs');

var getCache = function(env){
    return JSON.parse(fs.readFileSync(__dirname + '/.cache', 'utf8'))[env];
};

var setCache = function(env,data){
    var cache = {};
    try{
        cache = JSON.parse(fs.readFileSync(__dirname + '/.cache', 'utf8'));
    } catch(err){
        cache = {};
    }
    cache[env] = data;
    console.log(cache);
    fs.writeFile(__dirname + '/.cache', JSON.stringify(cache), 'utf8');
};

module.exports = {
    getCache:getCache,
    setCache:setCache
};