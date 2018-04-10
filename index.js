const webdriver = require('webdriverio');
const driver = webdriver.remote({ 
    port: 4321,
    desiredCapabilities: { 
        browserName: 'chrome' 
    } 
}).init();

const main = async () => {
    await driver.url('https://www.mrporter.com/intl/api/basket/addsku/1076447-815.json');
    await driver.getText('body').then(async res => {
        res = JSON.parse(res);

        if(res.result == 'PRODUCT_ADDED') {
            await driver.url('https://www.mrporter.com/intl/changecountry.mrp?channel=INTL&country=GB');
            await driver.url('https://www.mrporter.com/en-gb/signin.mrp');
            return await driver.refresh();
        }

        console.log(`Failed to add to cart, retrying in 2 seconds: ${res.message}`);
        setTimeout(main, 2000);
    }).catch(err => {
        console.error(`Failed to cart: ${err}`);
    });
};

main();
