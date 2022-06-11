###################################################################
# This file contains views for the API service
###################################################################
import configparser
from typing import Any, Dict, List, Optional, Tuple, Union

import pandas as pd
import requests
from django.http import JsonResponse
from django.http.request import HttpRequest
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import status

from .forecast_tools import Forecaster


###################################################################
# Stock List Service Class
###################################################################
class StockListServiceAPIView(generics.ListCreateAPIView):
    """Class for the view that handles GET and POST requests for the API.
    Uses Django REST framework.
    """
    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        
        # Parse API URL and key from local configuration file
        config = configparser.ConfigParser()
        config.read('api_keys.ini')
        self.stock_list_url = config['API_URLS']['stock_list']

    def get(self, request, *args, **kwargs):
        """This function handles GET requests
        """
        try:
            # We just need to get the request and pass on to public API
            response = requests.get(self.stock_list_url)
            
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

        # Parse API URL and key from local configuration file
        config = configparser.ConfigParser()
        config.read('api_keys.ini')
        self.stock_data_daily_url = config['API_URLS']['stock_data_daily']
        self.stock_data_weekly_url = config['API_URLS']['stock_data_weekly']
        self.stock_data_monthly_url = config['API_URLS']['stock_data_monthly']

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
            forecast = request.data.get("Forecast", False)
            horizon = request.data.get("Horizon", 10)
            model_type = request.data.get("ModelType", "Prophet")
            if symbol is None or grain is None:
                raise Exception("***Error: Name and grain are required fields")

            # Assuming we are here, get teh stock data from public API
            response = self.get_stock_data(symbol, grain)
            
            # Handle errors
            if response is None:
                msg = "***ERROR: failed to get repsponse"
                msg += "from stock data API"
                raise Exception(msg)

            # Extract response as JSON
            stock_data_json = response.json()

            # Instantiate forecaster and
            #   forecast, if required. Otherwise process into 'recrods'
            #   orientation of the JSON
            forecaster = Forecaster()
            if forecast:
                stock_data_json = forecaster.forecast(
                    stock_data_json, grain, horizon, model_type)
            else:
                stock_data_json = forecaster.process_stock_data(
                    stock_data_json, grain)

            # Return response
            return JsonResponse(data=stock_data_json, status=status.HTTP_200_OK)

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

    



            

