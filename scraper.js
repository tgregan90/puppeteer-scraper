const puppeteer = require('puppeteer');
const results = [];
const fs = require('fs');

module.exports =  async function scraper(url,outputFilename){
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'image' ){
            req.abort();
        } else {
            req.continue();
        }
        if (req.resourceType() === 'javascript' ){
            req.abort();
        } else {
            req.continue();
        }
        if (req.resourceType() === 'js' ){
            req.abort();
        } else {
            req.continue();
        }
    });
    await page.goto(url);
    await page.waitFor(3000);  
    let text = "\n";
    let regex =  /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig ;
    
    let URL = url.match(regex);

    text += URL.toString() + ",";
    text += await page.evaluate(() => {
        return document.querySelector("span.device-results-table__deal-price").innerText;
    });
    text += ",";
    try {
        await page.click("#results_filter > div:nth-child(3) > ul > li:nth-child(3)",{delay: 1000});
      }
      catch(err) {
          if(err.message === "No node found for selector: #results_filter > div:nth-child(3) > ul > li:nth-child(3)"){
              return console.log("No Broken Condition Found")
             }
        console.log("Click Error:" + err.message);
        await browser.close();
      }  
    text += await page.evaluate(() => {
        return document.querySelector("span.device-results-table__deal-price").innerText.toString();
    });
    // text += "\n";
    fs.appendFile(outputFilename,text.toString());

    console.log(text);
    results.push(text);
    await page.close();
    await browser.close();
}
