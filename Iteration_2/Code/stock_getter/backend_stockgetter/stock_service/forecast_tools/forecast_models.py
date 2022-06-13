###################################################################
# This file defines the forecast model wrappers
# (For now just Facebook Prophet, but can be extended to other
# model types)
###################################################################
from typing import Any, Dict, List, Optional, Tuple, Union

from prophet import Prophet
import pandas as pd

###################################################################
# ProphetModel Class
###################################################################
class ProphetModel():
    def __init__(self, model_data: pd.DataFrame, grain: str) -> None:
        """Wrapper class for Facebook prophet model

        Args:
            model_data (pd.DataFrame): model data
            grain (str): grain
        """
        self.model_data = model_data
        self.grain = self.process_grain(grain)

    def run_individual_forecast(self, 
                                df: pd.DataFrame, 
                                horizon: int) -> pd.DataFrame:
        """Helper method to run forecasts for individual series

        Args:
            df (pd.DataFrame): df with individual series
            horizon (int): forecast horizon

        Returns:
            pd.DataFrame: forecast of individual series
        """
        # Instantiate prophet and fit the model
        model = Prophet()
        model.fit(df)
        
        # Make future dataframe and generate forecast
        future_df = model.make_future_dataframe(
            periods=horizon, freq=self.grain, include_history=True)
        forecast_df = model.predict(future_df)

        # Wrangle into a nice df and return
        forecast_df = forecast_df[['ds', 'yhat']]
        forecast_df = forecast_df.sort_values(by='ds', ascending=False)
        forecast_df = forecast_df.merge(df, on='ds', how='outer')
        return forecast_df

    def run_forecast(self, horizon: int) -> pd.DataFrame:
        """Driver method to run forecast

        Args:
            horizon (int): forecast horizon

        Returns:
            pd.DataFrame: pandas df with forecast
        """

        # Get a list of columns without the date column
        col_list = [
            col for col in self.model_data.columns if col not in ['date']]

        out_list = []
        # Forecast individual series
        for col in col_list:
            # Construct individual data df for prophet
            in_df = pd.DataFrame()
            in_df['ds'] = self.model_data['date']
            in_df['y'] = self.model_data[col]

            # Forecast individual series
            fcst_df = self.run_individual_forecast(in_df, horizon)

            # Update columnn names
            fcst_df = fcst_df.rename(columns={'ds': 'date', 'y': col,
                'yhat': f'{col}_forecast'})
            fcst_df = fcst_df.set_index('date')
            out_list.append(fcst_df)

        # Concatenate and return
        out_df = pd.concat(out_list, axis=1)
        return out_df.reset_index()

    def process_grain(self, grain:str) -> str:
        """Helper method to convert grain to string required by prophet
        """
        # Convert our grain to string required by prophet
        if grain == 'daily':
            return 'D'
        elif grain == 'weekly':
            return 'W'
        elif grain == 'monthly':
            return 'M'
        else:
            msg = "***ERROR: unrecognized grain specified"
            raise Exception(msg)
