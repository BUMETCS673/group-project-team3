###################################################################
# This file defines the Forecaster object, used to wrap forecasting
# models
###################################################################
from typing import Any, Dict, List, Optional, Tuple, Union
import pandas as pd
from .forecast_models import ProphetModel


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

    def process_stock_data(self, stock_data: dict, grain:str) -> dict:
        """Method to pre-process data into Records orientation needed
        for the front end

        Args:
            stock_data (dict): stock data in dict format
            grain (str): data grain ('weekly', 'daily', 'monthly')

        Returns:
            dict: dict with stock data in records orientation
        """
        # Parse stock data
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
        data_df = pd.DataFrame.from_dict(out_dict)
        data_df['date'] = pd.to_datetime(data_df['date'], format='%Y-%m-%d')

        # Put into proper orientation in the dict and return
        # Cast date column back to string
        data_df.date = data_df.date.dt.strftime('%Y-%m-%d')

        # Create return dict
        ret_dict = {}
        ret_dict['data'] = data_df.to_dict(orient="records")
        
        # Return
        return ret_dict

    def forecast(self, stock_data: dict, grain: str, horizon: str,
                 model_type: str="Prophet") -> dict:
        """Method to generate forecast

        Args:
            stock_data (dict): stock data in dict format
            grain (str): data grain ('weekly', 'daily', 'monthly')
            horizon (str): forecast horizon
            model_type(str): forecasting model type. For now just 
                supports Facebook prophet algorithm:
                https://facebook.github.io/prophet/

        Returns:
            dict: dict with the data (in records orientation)
        """
        # Parse stock data
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
        data_df = pd.DataFrame.from_dict(out_dict)
        data_df['date'] = pd.to_datetime(data_df['date'], format='%Y-%m-%d')

        # Instantiate appropriate model (for now just prophet)
        if model_type == "Prophet":
            forecast_model = ProphetModel(data_df, grain)
        else:
            msg = "***ERROR: incorrect model type specified"
            msg += "returning just history with no forecast"
            raise Exception(msg)

        # Forecast
        fcast_df = forecast_model.run_forecast(horizon)

        # Replace all NaN's as empty strings
        fcast_df = fcast_df.fillna('')

        # Filter out negative values (replace with 0's)
        filter_cols = [x for x in fcast_df.columns if x != 'date']
        fcast_df[filter_cols] = fcast_df[filter_cols].applymap(
            lambda x: 0 if type(x) is not str and x < 0 else x)

        # Put into proper orientation in the dict and return
        # Cast date column back to string
        fcast_df.date = fcast_df.date.dt.strftime('%Y-%m-%d')

        # Create return dict
        ret_dict = {}
        ret_dict['data'] = fcast_df.to_dict(orient="records")
        
        # Return
        return ret_dict



