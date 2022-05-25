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

    def forecast(self, stock_data: dict, grain: str, horizon: str) -> dict:
        """_summary_

        Args:
            stock_data (dict): _description_
            horizon (str): _description_

        Returns:
            dict: _description_
        """
        data_df = self.parse_stock_data(stock_data, grain)
        
        # Instantiate model
        # forecast
        # return
        return data_df.to_json()
        
        # return {}

    def parse_stock_data(self, stock_data: dict, grain:str) -> pd.DataFrame:
        """Helper method to parse out data

        Args:
            stock_data (dict): scotk cata
            grain (str): data grain

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
        out_dict= {'date': date, 'open': open, 'hi': hi, 'low': low,
                    'close': close, 'volume': volume}

        # Now put into data frame and return
        out_df = pd.DataFrame.from_dict(out_dict)
        out_df['date'] = pd.to_datetime(out_df['date'], format='%Y-%m-%d')
        return out_df


