const { By, until, Key } = require("selenium-webdriver");

async function clickElement(driver, cssSelector) {
  const element = await getElement(driver, cssSelector);
  await element.click();
}

async function clickElementWithEnter(driver, cssSelector) {
  const element = await getElement(driver, cssSelector);
  await element.sendKeys(Key.ENTER);
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

module.exports = { clickElement, clickElementWithEnter, getElement, getElementsText };
