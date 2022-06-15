For security consideration, the API URLs are stored locally in the configuration file api_keys.ini.

The configuration file should be set up with the following format with your personal API URLs:

[API_URLS]
stock_list = 
stock_data_daily = 
stock_data_weekly = 
stock_data_monthly = 

In order to get your API URLs, you can sign up at:

https://fcsapi.com/document/stock-api

Once signed up and logged in, you will be able to get a free personal API access key. You can configure your API by adding your access key like:

stock_list = https://fcsapi.com/api-v3/stock/list?country=United-states&access_key="Your Access Key"

For daily/weekly/monthly APIs, you can sign up at:

https://www.alphavantage.co 

and get your API key.

After getting your personal API key, you can add it to the API URLs like:

stock_data_daily = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey="Your API Key"
stock_data_weekly = https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey="Your API Key"
stock_data_monthly = https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey="Your API Key"


Note: In case your personal API URLs do not work or encounted any formating issues, you can use our provided URLs with correct format below:

[API_URLS]
stock_list = https://fcsapi.com/api-v3/stock/list?country=United-states&access_key=4wcNF3TiJ7XVx6p8zDt21
stock_data_daily = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey=Q5SUUT82ASKLSWB1
stock_data_weekly = https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey=Q5SUUT82ASKLSWB1
stock_data_monthly = https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey=Q5SUUT82ASKLSWB1

