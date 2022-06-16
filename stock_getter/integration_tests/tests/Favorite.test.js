require("chromedriver");
const { expect } = require("chai");
const { Builder } = require("selenium-webdriver");
const { getElementsText, clickElement } = require('./elementHelpers');
const { delay } = require('./testHelpers')

/**
 * Integration tests for selecting stocks as favorites
 */

let driver;
const whiteStarCharacter = "\u2606";
const blackStarCharacter = "\u2605";

describe("Favorites", function () {
  this.beforeAll(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await delay(60000);
  });

  this.afterAll(async function () {
    await driver.quit();
  });

  it("should be initially unselected for first stock", async function () {
    await driver.get("http://localhost:8080/dashboard.html"); 
    await assertFirstStockFavoriteUnselected();
  });

  it("should be selected after clicked", async function () {
    await clickFirstStockFavoriteIcon();
    await assertFirstStockNotFavorite();
  });

  it("should still be selected after refresh", async function () {
    driver.navigate().refresh();
    await assertFirstStockNotFavorite();
  });

  it("should be unselected after clicked", async function () {
    await clickFirstStockFavoriteIcon();
    await assertFirstStockFavoriteUnselected();
  });

  const clickFirstStockFavoriteIcon = async () => {
    await clickElement(driver, ".favorite");
  }

  const assertFirstStockFavoriteUnselected = async () => {
    await assertFirstStockFavoriteValue(whiteStarCharacter);
  }

  const assertFirstStockNotFavorite = async () => {
    await assertFirstStockFavoriteValue(blackStarCharacter);
  }

  const assertFirstStockFavoriteValue = async (expectedValue) => {
    const stockFavoritesText = await getElementsText(driver, ".favorite");
    const firstStock = await stockFavoritesText[0];
    expect(firstStock).to.be.eql(expectedValue);
  }
});
