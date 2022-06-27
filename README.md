# This is the repo for the StockGetter app developed by Team 3:
The project is a web-based application called StockGetter. The idea behind the app is to allow an end user to obtain history of stock price and volume data (i.e. time series data for stock prices and volumes) for publicly traded stocks in the US as well as provide a forecast of the said prices and volumes using a modern machine learning algorithm. It also allows users to save selected stocks as favorites on site.

# The team includes the following memebres:
* Duy Nguyen
* Jing Tian
* Serguei Chervachidze
* Sylvie Xiang

# Quick setup guide for StockGetter:
- Create a virtual environment and install required modules. The list of required modules can be found at: [stock_getter/backend_stockgetter/requirements.txt](stock_getter/backend_stockgetter/requirements.txt)

  Note: If you're using windows system, Anaconda is recommanded to set up a virtual environment.

- Once all requirements is installed, open a new terminal and navigate to the app directory, for example: 
```
cd C:\...\stock_getter
```

- Before launching backend, navigate to the back end directory and apply migration first. You can do it by: 
```
cd backend_stockgetter
python manage.py migrate
```

- After migration, you can start backend server by:
```
python manage.py runserver 8000
```

- To start frontend, first open another terminal and nagviate to frontend folder, for example:
```
cd C:\...\stock_getter
cd frontend_stockgetter
```

- In frontend directory, you can start local frontend server by:
```
python -m http.server 8080
```
- Once backend and frontend are correctly launched, you can view the app page on localhost by [http://localhost:8080/](http://localhost:8080/)
  
Note: backend and frontend port are fixed, please make sure you are using 8080 for the frontend and 8000 for the backend, otherwise the app will not work properly



# Configuration file setup guide for StockGetter:
- For security consideration, the API URLs are stored locally in the configuration file stock_getter\backend_stockgetter\api_keys.ini.

- The configuration file should be set up with the following format with your personal API URLs:

```
[API_URLS]
stock_list = 
stock_data_daily = 
stock_data_weekly = 
stock_data_monthly =
```

- In order to get your API URLs, you can sign up at:
https://fcsapi.com/document/stock-api
Once signed up and logged in, you will be able to get a free personal API access key. You can configure your API by adding your access key like:

```
stock_list = https://fcsapi.com/api-v3/stock/list?country=United-states&access_key="Your Access Key"
```

- For daily/weekly/monthly APIs, you can sign up at:
https://www.alphavantage.co 
and get your API key.

- After getting your personal API key, you can add it to the API URLs like:

```
stock_data_daily = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey="Your API Key"
stock_data_weekly = https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey="Your API Key"
stock_data_monthly = https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey="Your API Key"
```

Note: In case your personal API URLs do not work or encounted any formating issues, you can use our provided URLs with correct format below:

```
[API_URLS]
stock_list = https://fcsapi.com/api-v3/stock/list?country=United-states&access_key=4wcNF3TiJ7XVx6p8zDt21
stock_data_daily = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey=Q5SUUT82ASKLSWB1
stock_data_weekly = https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey=Q5SUUT82ASKLSWB1
stock_data_monthly = https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey=Q5SUUT82ASKLSWB1
```

- Once you finished setting up the configuration file, you can run our test file in your terminal window to check if your configuration file format is correct.
If the return result is "OK", then your configuration file is correctly set up and you're good to go.
```
python test_config.py
```




