# This is the repo for the StockGetter app developed by the Group 3 Team
The project will be a web-based application called StockGetter. The idea behind the app is to allow an end user to obtain history of stock price and volume data (i.e. time series data for stock prices and volumes) for publicly traded stocks in the US as well as provide a forecast of the said prices and volumes using a modern machine learning algorithm. 

# The objectives and priorities for the project are:
forecasting stock prices, plotting multiple stocks in one graph, and downloading stock data to local machines. The goals of the project are completing the proposed essential features, as well as developing some optional features if time permits, which including a log-in page, multiple plots for different sets of stocks, printing capability, and deployment. 

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



