#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var util = require('util');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://safe-meadow-7519.herokuapp.com";
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function (htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function (checksfile) {
    return JSON.parse (fs.readFileSync(checksfile));
};

var checkHtmlFile = function (htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
        var present = $(checks[ii]).length >  0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkHtmlFile = function (htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
        var present = $(checks[ii]).length >  0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkUrlFile = function (htmlfile, checksfile) {
    $ = cheerio.load(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
        var present = $(checks[ii]).length >  0;
        out[checks[ii]] = present;
    }
    return out;
};

var assertUrlValid = function (checksfile){
    var urlCheck = function (result, responseO) {
        if (result instanceof Error ) {
            console.error('Error: ' + util.format(response.message));
        } else {
            var checkJson = checkUrlFile(result, checksfile);
            var outJson = JSON.stringify(checkJson, null, 4);
            console.log(outJson);
        }
    };
    return urlCheck;
};


if (require.main == module ) {
    program
    .option('-c, --checks ', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
    .option('-f, --file ', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
    .option('-u, --url ', 'Url for check', assertUrlValid, URL_DEFAULT)
    .parse(process.argv);

    if (program.url) {
        var urlCheckMy = assertUrlValid(program.checks);
        rest.get(program.url).on('complete', urlCheckMy);
    } else {
        var checkJson = checkHtmlFile (program.file, program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log (outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
