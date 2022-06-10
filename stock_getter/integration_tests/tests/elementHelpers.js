const { By, until, Key } = require("selenium-webdriver");

async function clickElement(driver, cssSelector) {
  const element = await getElement(driver, cssSelector);
  await element.click();
}

// Function needed for some elements for which regular click produces
// error that element is not clickable
async function clickElementWithSpace(driver, cssSelector) {
  const element = await getElement(driver, cssSelector);
  await element.sendKeys(Key.SPACE);
}

async function selectNextOption(driver, cssSelector) {
  const element = await getElement(driver, cssSelector);
  await element.sendKeys(Key.ARROW_DOWN);
}

async function getElement(driver, cssSelector) {
  return await driver.wait(until.elementLocated(By.css(cssSelector)));
}

async function getElementsText(driver, cssSelector) {
  const elements = await driver.wait(
    until.elementsLocated(By.css(cssSelector))
  );
  const textValues = [];
  for (const element of elements) {
    const textValue = await element.getText();
    textValues.push(textValue);
  }
  return textValues;
}

module.exports = { clickElement, clickElementWithSpace, selectNextOption, getElement, getElementsText };
