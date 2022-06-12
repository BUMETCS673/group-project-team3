The API URLs are stored locally in configuration file api_keys.ini.

In order to get your personal API URLs, you can sign up at:

https://fcsapi.com/document/stock-api

Once signed up and loged in, you will be able to get a personal API access key. You can configure your personal API by adding your access key like:

stock_list = https://fcsapi.com/api-v3/stock/list?country=United-states&access_key="Your Access Key"

For daily/weekly/monthly APIs, you can sign up at https://www.alphavantage.co and get your api key.
After getting your personal api key, you can add it to the API URLs like:
stock_data_daily = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey="Your API Key"
stock_data_weekly = https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey="Your API Key"
stock_data_monthly = https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey="Your API Key"
