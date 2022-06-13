require("chromedriver");
const { expect } = require("chai");
const { Builder } = require("selenium-webdriver");
const {getElementsText, clickElementWithSpace, selectNextOption} = require('./elementHelpers');

/**
 * Integration tests for Plotly charts with and without forecast generation
 */

let driver;

describe("Plotly Chart", function () {
  this.beforeAll(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  this.afterAll(async function () {
    await driver.quit();
  });

  it("should contain correct aggregations and legend when no forecast selected", async function () {
    await driver.get("http://localhost:8080/dashboard.html");    
    await selectFirstStock();
    await getData();
    await assertChartOptionValues(["1m", "6m", "all"]);
    await assertLegendValues(["High", "Low", "Close"]);
  });

  it("should contain correct aggregation options and legend when forecast selected", async function () {
    await driver.navigate().refresh();
    await driver.get("http://localhost:8080/dashboard.html");
    await selectFirstStock();
    // Data grain needs to be montly in order for forecast data to be loaded before test times out
    await changeDataGrainToMonthly();
    await selectForecastGeneration();
    await getData();
    await assertChartOptionValues(["1m", "6m", "all"]);
    await assertLegendValues(["High", "Low", "Close", "High Forecast", "Low Forecast", "Close Forecast"]);
  });

  const selectFirstStock = async () => {
    await clickElementWithSpace(driver, ".ag-selection-checkbox input");
  }

  const changeDataGrainToMonthly = async () => {
    await selectNextOption(driver, "#data_grain");
    await selectNextOption(driver, "#data_grain");
  }

  const getData = async () => {
    await clickElementWithSpace(driver, "#get_data");
  }

  const selectForecastGeneration = async () => {
    await clickElementWithSpace(driver, "#forecast_check");
  }

  const assertChartOptionValues = async expectedValues => {
    const chartOptionValues = await getElementsText(driver, 
      "div .plotly .selector-text"
    );
    expect(chartOptionValues).to.eql(expectedValues);
  }

  const assertLegendValues = async expectedValues => {
    const chartLegendsText = await getElementsText(driver, ".legendtext");
    expect(chartLegendsText).to.eql(expectedValues);
  }
});
