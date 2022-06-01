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
        data_df = self.parse_stock_data(stock_data, grain)
        ret_dict = self.convert_data_to_records_orientation(data_df)
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
        data_df = self.parse_stock_data(stock_data, grain)
        
        # Instantiate appropriate model (for now just prophet)
        if model_type == "Prophet":
            forecast_model = ProphetModel(data_df, grain)
        else:
            msg = "***ERROR: incorrect model type specified"
            msg += "returning just history with no forecast"
            raise Exception(msg)

        # Forecast
        fcast_df = forecast_model.run_forecast(horizon)
        fcast_df = fcast_df.fillna('')


        # Put into proper orientation in the dict and return
        ret_dict = self.convert_data_to_records_orientation(fcast_df)
        return ret_dict

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

    def convert_data_to_records_orientation(
        self, data_df: pd.DataFrame) -> dict:
        """Helper method to convert data from data frame into a dict with 
        records orientation and stringify dates column to make in serialize
        in JSON properly.

        Args:
            data_df (pd.DataFrame): data frame with data

        Returns:
            dict: dict with data
        """
        try:
            # Cast date column back to string
            data_df.date = data_df.date.dt.strftime('%Y-%m-%d')

            # Create return dict
            ret_dict = {}
            ret_dict['data'] = data_df.to_dict(orient="records")
            
            return ret_dict

        except Exception as err:
            print(err)



