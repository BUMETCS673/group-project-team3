###################################################################
# This file contains views for the API service
###################################################################
from django.shortcuts import render
from django.http import JsonResponse
from django.http.request import HttpRequest
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import status
import pandas as pd
import configparser
import requests
from typing import Any, Dict, List, Optional, Union, Tuple


###################################################################
# Stock List Service Class
###################################################################
class StockListServiceAPIView(generics.ListCreateAPIView):
    """Class for the view that handles GET and POST requests for the API.
    Uses Django REST framework.
    """
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        # Parse API URL and key and intitialize
        # config = configparser.ConfigParser()
        # config.read('api_keys.ini')
        # self.stock_list_url = config['APIURLS']['stock_list']

        #TODO: Fix this to read config files
        self.stock_list_url = 'https://fcsapi.com/api-v3/stock/list?country=United-states&access_key=4wcNF3TiJ7XVx6p8zDt21' 

    def get(self, request, *args, **kwargs):
        """This function handles GET requests
        """
        try:
            # We just need to get the request and pass on to public API
            response = requests.get(self.stock_list_url)
            # response = requests.get(self.stock_list_url, json={'key:'value})
            data = response.json()
            
            # Handle errors
            if response is None:
                msg = "***ERROR: failed to get repsponse"
                msg += "from stock list API"
                raise Exception(msg)

            # Pass request along
            data = response.json()
            return JsonResponse(data=data, status=status.HTTP_200_OK)

        except Exception as err:
            payload = {'Success': 0, 'ErrorMsg': str(err)}
            return JsonResponse(data=payload, 
                status=status.HTTP_400_BAD_REQUEST)


    def post(self, request, *args, **kwargs):
        """This function handles POST requests. Not implemented for now.
        """
        resp_data = {
                'ErrorMsg': 'POST requests are not supported. Use GET',
                'Success': 0
        }
        return JsonResponse(data=resp_data, status=status.HTTP_400_BAD_REQUEST)


###################################################################
# Stock Data Service Class
###################################################################
class StockDataServiceAPIView(generics.ListCreateAPIView):
    """Class for the view that handles GET and POST requests for the API.
    Uses Django REST framework.
    """
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        # config = configparser.ConfigParser()
        # config.read('api_keys.ini')
        # self.stock_data_daily_url = config['APIURLS']['stock_data_daily']
        # self.stock_data_weekly_url = config['APIURLS']['stock_data_weekly']
        # self.stock_data_monthly_url = config['APIURLS']['stock_data_monthly']

        #TODO: Fix this to read config files
        self.stock_data_daily_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey=Q5SUUT82ASKLSWB1'
        self.stock_data_weekly_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey=Q5SUUT82ASKLSWB1'
        self.stock_data_monthly_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey=Q5SUUT82ASKLSWB1'
       

    def get(self, request, *args, **kwargs):
        """This function handles GET requests. Not implemented for now.
        """
        resp_data = {
                'ErrorMsg': 'GET requests are not supported. Use POST',
                'Success': 0
        }
        return JsonResponse(data=resp_data, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        """This function handles POST requests
        """
        # Parse incoming data from the request
        try:
            symbol = request.data.get("Symbol", None)
            grain = request.data.get("Grain", None)
            if symbol is None or grain is None:
                raise Exception("***Error: Name and grain are required fields")

            # Assuming we are here, get teh stock data from public API
            response = self.get_stock_data(symbol, grain)
            
            # Handle errors
            if response is None:
                msg = "***ERROR: failed to get repsponse"
                msg += "from stock data API"
                raise Exception(msg)

            # Pass request along
            data = response.json()
            return JsonResponse(data=data, status=status.HTTP_200_OK)

        except Exception as err:
            payload = {'Success': 0, 'ErrorMsg': str(err)}
            return JsonResponse(data=payload, 
                status=status.HTTP_400_BAD_REQUEST)

    def get_stock_data(self, symbol: str, grain: str) -> Optional[str]:
        """Method to get stock data from the public API

        Args:
            symbol (str): stock symbol
            grain (str): data grain

        Returns:
            Optional[str]: A JSON response or None
        """
        # Construct the URL
        if grain == 'daily':
            url = self.stock_data_daily_url + f'&symbol={symbol}'
        elif grain == 'weekly':
            url = self.stock_data_weekly_url + f'&symbol={symbol}'
        else:
            url = self.stock_data_monthly_url + f'&symbol={symbol}'
        
        # Now do a GET request to the public API
        return requests.get(url)




            

