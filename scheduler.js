/**
 * Read a list of urls
 * Filter relevant URLs into relevant cohorts
 * Build a list of todos
 * Beging running handler   
 * 
 */

const fs = require('fs');
const scraper = require('./scraper.js');


function readLines(input, func) {
    var remaining = '';
  
    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        func(line);
        index = remaining.indexOf('\n');
      }
    });
  
    input.on('end', function() {
      if (remaining.length > 0) {
        func(remaining);
      }
    });
  }
  
  function func(data) {
    console.log(data);
    let result = "";
    result = scraper(data,"results.txt");

  }
  
  var input = fs.createReadStream('urls.txt');
  readLines(input, func);