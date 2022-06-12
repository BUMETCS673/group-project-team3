# How to run integration tests 

## Prerequisites

### NodeJS
Install from https://nodejs.org/en/

### Webdriver

Install from https://www.selenium.dev/selenium/docs/api/javascript/index.html

Make sure webdriver version is compatible with your Chrome browser

### Front end server

Make sure the front end server is running. Tests are expecting it to run at localhost:8080

## Run tests
- In Shell, go to integration_tests folder
- Run `npm install` (this should install all the package versions)
- Run `npm test **/*.test.js`

This will run all the *.test.js files and output the summary of all tests.

We can also run specific tests by using a test file name:
`npm test **/Favorite.test.js`

## Possible issues

### Test timeout

Currently timeout is at 30 seconds which should be enough since they take couple of seconds, but sometimes it takes longer to load the initial page.

Possible solutions are to restart front end server or close the previous Chrome window in case it was not automatically closed.

## Code
### Test files

Test file needs to be in /tests folder and named as *.test.js
Each test should be testing a single flow. For example, Chart.test.js is testing we loaded dashboard, selected first stock and loaded the chart

### Helper files

#### elementHelpers.js

This file contains helper functions for element operations such as clicking or getting their information. Elements are obtained by using CSS selector. More information about css selectors at: https://saucelabs.com/resources/articles/selenium-tips-css-selectors

#### debugHelpers.js

This file contains helper functions that are useful when debugging, but are otherwise not needed.


