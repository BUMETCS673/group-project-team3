###################################################################
# File for testing Forecaster class
###################################################################
import unittest
from ..forecaster import ProphetModel
import pandas as pd


###################################################################
# Class implementing Forecaster tests
###################################################################
class TestProphetModel(unittest.TestCase):
    TURN_OFF_ALL_TESTS = False

    def setUp(self) -> None:
        """This runs before every test and sets up needed objects
        and artifacts for testing
        """
        # Load csv file with stock data for testing
        fp = './backend_stockgetter/stock_service/forecast_tools'
        fp += '/tests_forecast_tools/test_data/aapl_stk.csv'
        self.stock_data = pd.read_csv(fp, parse_dates=['date'])
        self.grain = 'daily'
        self.horizon = 30
        print('Starting tests for ProphetModel object')

    def tearDown(self) -> None:
        """Terdown function
        for now, we just call the super method. No custom logic
        here"""
        return super().tearDown()


###################################################################
# Unit tests
###################################################################
    def test_run_forecast(self):
        """Test run_forecast function
        """
        # Instantiate Prophet model object and run forecast
        forecast_model = ProphetModel(self.stock_data, self.grain)
        fcast_df = forecast_model.run_forecast(self.horizon)

        # Run checks here
        msg = "The return object should be a pandas data frame"
        self.assertTrue(isinstance(fcast_df, pd.DataFrame))
        
        msg = "Number of elements in the data frame should be 5715"
        self.assertEqual(len(fcast_df), 5715)

        msg = "'date' should be one of the data frame columns"
        self.assertTrue('date' in fcast_df.columns)

        msg = "'open' should be one of the data frame columns"
        self.assertTrue('open' in fcast_df.columns)

        msg = "'open_forecast' should be one of the data frame columns"
        self.assertTrue('open_forecast' in fcast_df.columns)

        msg = "'high' should be one of the data frame columns"
        self.assertTrue('high' in fcast_df.columns)

        msg = "'high_forecast' should be one of the data frame columns"
        self.assertTrue('high_forecast' in fcast_df.columns)

        msg = "'low' should be one of the data frame columns"
        self.assertTrue('low' in fcast_df.columns)

        msg = "'low_forecast' should be one of the data frame columns"
        self.assertTrue('low_forecast' in fcast_df.columns)

        msg = "'close' should be one of the data frame columns"
        self.assertTrue('close' in fcast_df.columns)

        msg = "'close_forecast' should be one of the data frame columns"
        self.assertTrue('close_forecast' in fcast_df.columns)

        msg = "'volume' should be one of the data frame columns"
        self.assertTrue('volume' in fcast_df.columns)

        msg = "'volume_forecast' should be one of the data frame columns"
        self.assertTrue('volume_forecast' in fcast_df.columns)

        msg = "The last date should be ''2022-07-03 00:00:00''"
        self.assertEqual(str(fcast_df['date'][0]), '2022-07-03 00:00:00')

        msg = "The last value for open_forecast should be 157.0"
        self.assertEqual(round(
            fcast_df['open_forecast'][0], 0), 157.0)

        msg = "The first date should be '1999-11-01 00:00:00'"
        self.assertEqual(str(
            fcast_df['date'].iloc[len(fcast_df)-1]), '1999-11-01 00:00:00')

        msg = "The first value for low_forecast should be 102"
        self.assertEqual(round(
            fcast_df['low_forecast'].iloc[len(fcast_df)-1], 0), 102)
