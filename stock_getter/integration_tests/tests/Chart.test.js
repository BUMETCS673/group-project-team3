require("chromedriver");
const { expect } = require("chai");
const { Builder } = require("selenium-webdriver");
const {clickElement, getElementsText, clickElementWithEnter} = require('./elementHelpers');

let driver;

describe("Plotly Chart", function () {
  this.beforeAll(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  this.afterAll(async function () {
    await driver.quit();
  });

  it("should contain correct aggregation options", async function () {
    await driver.get("http://localhost:8000/dashboard.html");
    await clickElement(driver, ".ag-selection-checkbox input");
    await clickElementWithEnter(driver, "#get_data");
    const chartOptionValues = await getElementsText(driver, 
      "div .plotly .selector-text"
    );
    expect(chartOptionValues).to.eql(["1m", "6m", "all"]);
  });
});
