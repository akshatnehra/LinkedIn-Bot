let credentials = require('./credentials.js');
let sendData = require('./message.js');

let totalPages = 100;

let subject = sendData.subject;
let message = sendData.message;

let username = credentials.username;
let password = credentials.password;

const puppeteer = require('puppeteer');

/*
  ------------------TIME ZONES-------------------
  1. Marshall Islands, Northern Mariana Islands, Gilbert Islands (Kiribati), and Caroline Islands Papua New Guinea, the Solomon Islands, Vanuatu, and Fiji,New Zealand, Australia, South Korea, Japan, Singapore, Malaysia, Phillipeans, South Korea
  2. Albania Austria Belgium Croatia Denmark (mainland) France (mainland) Germany Hungary Italy Netherlands Norway Poland Slovakia 
  3. Spain (mainland) Sweden Switzerland Bulgaria Estonia Finland Greece Latvia Lithuania Moldova Romania Turkey
  4. Canary Islands Faroe Islands Iceland* (on GMT all year) Ireland* Portugal United Kingdom
  5. Argentina, Uruguay, Suriname,  Brazil. French Guiana Bolivia, Chile, Guyana, Paraguay, The Falkland Islands
  6. USA, Canada, El Salvador, Costa Rica, Belize, Guatemala, Nicaragua, and Honduras ,Panama, Greenland
*/

let locations = process.argv.slice(2)[0];
let userSearchKeyword = process.argv.slice(2)[1];

let link1 = "https://www.linkedin.com/search/results/services/?geoUrn=%5B%22103121230%22%2C%22106808692%22%2C%22102454443%22%2C%22101355337%22%2C%22105149562%22%2C%22101452733%22%2C%22105490917%22%2C%22105733447%22%2C%22102185308%22%2C%22104980134%22%2C%22100152180%22%2C%22103666514%22%2C%22104742735%22%2C%22106516799%22%5D&keywords="+userSearchKeyword;
let link2 = "https://www.linkedin.com/search/results/services/?geoUrn=%5B%22103119917%22%2C%22105072130%22%2C%22103819153%22%2C%22102890719%22%2C%22103350119%22%2C%22100288700%22%2C%22101282230%22%2C%22105015875%22%2C%22104514075%22%2C%22104688944%22%2C%22100565514%22%2C%22103883259%22%2C%22102845717%22%5D&keywords="+userSearchKeyword;
let link3 = "https://www.linkedin.com/search/results/services/?geoUrn=%5B%22102105699%22%2C%22106670623%22%2C%22106178099%22%2C%22101464403%22%2C%22104341318%22%2C%22104677530%22%2C%22100456013%22%2C%22102974008%22%2C%22105333783%22%2C%22106693272%22%2C%22105117694%22%2C%22104035573%22%2C%22105646813%22%5D&keywords="+userSearchKeyword;
let link4 = "https://www.linkedin.com/search/results/services/?geoUrn=%5B%22101165590%22%2C%22100364837%22%2C%22104738515%22%2C%22105238872%22%2C%22104630756%22%2C%22102102005%22%5D&keywords="+userSearchKeyword;
let link5 = "https://www.linkedin.com/search/results/services/?geoUrn=%5B%22104961595%22%2C%22106057199%22%2C%22100446943%22%2C%22100867946%22%2C%22104065273%22%2C%22104379274%22%2C%22104621616%22%2C%22105001561%22%2C%22105530931%22%2C%22105836293%22%5D&keywords="+userSearchKeyword;
let link6 = "https://www.linkedin.com/search/results/services/?geoUrn=%5B%22103705642%22%2C%22100808673%22%2C%22101937718%22%2C%22105517145%22%2C%22100877388%22%2C%22105912732%22%2C%22101739942%22%2C%22106522560%22%2C%22101174742%22%2C%22103644278%22%5D&keywords="+userSearchKeyword;

var finalURL;
var count = 0;
var limit = 100;
var startPageNumber = process.argv.slice(2)[2];
var currentPageNumber = 1;

if(locations == 1)
  finalURL = link1;
else if(locations == 2)
  finalURL = link2;
else if(locations == 3)
  finalURL = link3;
else if(locations == 4)
  finalURL = link4;
else if(locations == 5)
  finalURL = link5;
else
  finalURL = link6;


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

async function sendMessages(url, pageNumber, isLogin){

    try{
        var pageFormat = `&page=${pageNumber}`;

        if(pageNumber){
            url += pageFormat;
            currentPageNumber = parseInt(pageNumber);
        }

        var finalURLtoVisit = url;
        console.log(finalURLtoVisit);
        
        // Open userURL
        await page.goto(finalURLtoVisit, {
            waitUntil: 'networkidle2',
        });

        if(isLogin == true){
            // goto LOGIN PAGE
            await page.click('.main__sign-in-link');

            // LOGIN
            await page.type('#username', `${username}`, {delay: 20})
            await page.type('#password', `${password}`, {delay: 20})
            await page.click('.login__form_action_container');
        }

        for(let times = 1; times <= totalPages; times++){
            await delay(10000);

            for(let i=1; i<=10; i++){

                let buttonText = await page.$eval(`.search-results-container:nth-child(2) ul li:nth-child(${i}) button`, el => el.innerText); 
                if(buttonText != "Message"){
                    continue;
                }

                let buttonToClick = `.search-results-container:nth-child(2) ul li:nth-child(${i}) button`;
                let user = await page.$eval(`.search-results-container:nth-child(2) ul li:nth-child(${i}) [dir=ltr] span`, el => el.textContent); 
                let messageToSend = `Hi ${user}` + message;

                await page.click(buttonToClick);
                //break;
                //  return;
                
                await delay(1000);
                
                let isAlreadyConvoInitiated = (await page.$('.msg-overlay-conversation-bubble--is-active')) || "";
                if(isAlreadyConvoInitiated) {
                let checkBtn = (await page.$('.msg-convo-wrapper .msg-overlay-bubble-header__control:nth-child(4)')) || "";
                if(checkBtn){
                    await page.click('.msg-convo-wrapper .msg-overlay-bubble-header__control:nth-child(4)');
                    continue; 
                }
                }
                
                await delay(1000);

                ispremiumPopUp = (await page.$('.upsell-modal .mercado-match')) || "";

                if(ispremiumPopUp) {
                    await page.click('.upsell-modal .mercado-match');
                    continue;
                };

                await delay(5000);

                if(subject) {
                    await page.click('input[name=subject]');
                    await page.type('.msg-form', subject, {delay: 1})
                }

                await page.keyboard.press("Tab");
                await delay(1000);
                await page.click('.full-height .msg-form div:nth-child(3)');

                await page.type('.full-height .msg-form div:nth-child(3)', messageToSend, {delay: 50})
                await page.click('.msg-convo-wrapper .msg-form__send-button');
                // await delay(3000);
                isDiscardPopUp = (await page.$('.data-test-dialog-title')) || "";
            if(isDiscardPopUp){
            await page.click('.data-test-modal-close-btn');
            }
                await page.click('.msg-convo-wrapper .msg-overlay-bubble-header__control:nth-child(2)');
                // return;
                count++;
                console.log(`Message sent to ${count} people, currently on Page Number: ${currentPageNumber} :)`);
                if(count >= limit)
                return;
            }
            //break;
            // await delay(10000);
            isDiscardPopUp = (await page.$('.data-test-dialog-title')) || "";
            if(isDiscardPopUp){
            await page.click('.data-test-modal-close-btn');
            }
            await page.click('button[aria-label=Next]');
            currentPageNumber++;
        }
    } catch (error) {
        console.log('Error aaya par humne sambhal liya, aap chinta mat kijiye');
        sendMessages(finalURL, currentPageNumber, false);
    }
      
}

var page;
var browser;


(async () => {
    browser = await puppeteer.launch({
    headless: false,
    args:['--start-maximized'],
    defaultViewport: null    
  });
   page = await browser.newPage();

  try {
    sendMessages(finalURL, startPageNumber, true);
  } catch (error) {
    console.log('Error aaya par humne sambhal liya, aap chinta mat kijiye (Bade wale hain hum)');
    sendMessages(finalURL, currentPageNumber, false);
  }
  

//   await browser.close();
})();