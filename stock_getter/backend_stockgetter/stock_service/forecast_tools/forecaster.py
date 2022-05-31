###################################################################
# This file defines the Forecaster object, used to wrap forecasting
# models
###################################################################
from datetime import date, timedelta
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import pandas as pd


###################################################################
# Forecaster Class
###################################################################
class Forecaster():
    """Forecaster wrapper class to manage forecasting via different models.
    This does data preprocessing and than uses an object for a given model
    type (for now just prophet) to produce forecasts
    """
    def __init__(self) -> None:
        """For now do nothing in constructor"""
        pass

    def process_stock_data(self, stock_data: dict, grain:str) -> dict:
        """Method to pre-process data into Records orientation needed
        for the front end

        Args:
            stock_data (dict): stock data in dict format
            grain (str): data grain ('weekly', 'daily', 'monthly')

        Returns:
            dict: dict with stock data in records orientation
        """
        data_df = self.parse_stock_data(stock_data, grain)
        
        # Cast date column back to string TODO: refactor into sep fn
        data_df.date = data_df.date.dt.strftime('%Y-%m-%d')

        # Create return dict
        ret_dict = {}
        ret_dict['data'] = data_df.to_dict(orient="records")

        return ret_dict


    def forecast(self, stock_data: dict, grain: str, horizon: str) -> dict:
        """Method to generate forecast

        Args:
            stock_data (dict): stock data in dict format
            grain (str): data grain ('weekly', 'daily', 'monthly')
            horizon (str): forecast horizon

        Returns:
            dict: dict with the data (in records orientation)
        """
        data_df = self.parse_stock_data(stock_data, grain)
        
        # Instantiate model
        # forecast
        # return

        # Cast date column back to string
        data_df.date = data_df.date.dt.strftime('%Y-%m-%d')

        # Create return dict
        ret_dict = {}
        ret_dict['data'] = data_df.to_dict(orient="records")

        return ret_dict

        
        # return {}

    def parse_stock_data(self, stock_data: dict, grain:str) -> pd.DataFrame:
        """Helper method to parse out data

        Args:
            stock_data (dict): scotk cata
            grain (str): data grain ('weekly', 'daily', 'monthly')

        Returns:
            pd.DataFrame: resulting data frame
        """
        # Create proper key string to parse out data
        if grain == 'daily':
            parse_key = 'Time Series (Daily)'
        elif grain == 'weekly':
            parse_key = 'Weekly Time Series'
        else:
            parse_key = 'Monthly Time Series'

        # Now parse out the data and put into a dict
        data_dict = stock_data[parse_key]
        
        # Create lists to hold stuff
        date = []
        hi = []
        low = []
        open = []
        close = []
        volume = []

        # Populate these
        for key in data_dict:
            date.append(key)
            open.append(data_dict[key]['1. open'])
            hi.append(data_dict[key]['2. high'])
            low.append(data_dict[key]['3. low'])
            close.append(data_dict[key]['4. close'])
            volume.append(data_dict[key]['5. volume'])

        # Put into dict
        out_dict= {'date': date, 'open': open, 'high': hi, 'low': low,
                    'close': close, 'volume': volume}

        # Now put into data frame and return
        out_df = pd.DataFrame.from_dict(out_dict)
        out_df['date'] = pd.to_datetime(out_df['date'], format='%Y-%m-%d')
        return out_df


