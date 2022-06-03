###################################################################
# File for testing Forecaster class
###################################################################
import unittest
from ..forecaster import Forecaster
import json


###################################################################
# Class implementing Forecaster tests
###################################################################
class TestForecaster(unittest.TestCase):
    TURN_OFF_ALL_TESTS = False

    def setUp(self) -> None:
        """This runs before every test and sets up needed objects
        and artifacts for testing
        """
        # Load JSON with stock data for testing
        fp = './backend_stockgetter/stock_service/forecast_tools'
        fp += '/tests_forecast_tools/test_data/aapl_stk.json'
        self.stock_data = self.load_json(fp)
        self.grain = 'daily'
        self.horizon = 30
        print('Starting tests for Forecaster object')

    def tearDown(self) -> None:
        """Terdown function
        for now, we just call the super method. No custom logic
        here"""
        return super().tearDown()


###################################################################
# Helper methods
###################################################################
    def load_json(self, file_pointer):
        with open(file_pointer) as fp:
            return json.load(fp)

###################################################################
# Unit tests
###################################################################
    def test_forecast(self):
        """Test forecast function
        """
        # Instantiate forecaster object and run forecast
        forecaster = Forecaster()
        stock_data_json = forecaster.forecast(
            self.stock_data, self.grain, self.horizon, "Prophet")

        # Run checks here
        msg = "The return object should be a dict"
        self.assertTrue(isinstance(stock_data_json, dict))
        
        msg = "Number of elements in data list should be 5715"
        self.assertEqual(len(stock_data_json['data']), 5715)

        msg = "'date' should be one of the returned fields"
        self.assertTrue('date' in stock_data_json['data'][0])

        msg = "'open' should be one of the returned fields"
        self.assertTrue('open' in stock_data_json['data'][0])

        msg = "'open_forecast' should be one of the returned fields"
        self.assertTrue('open_forecast' in stock_data_json['data'][0])

        msg = "'high' should be one of the returned fields"
        self.assertTrue('high' in stock_data_json['data'][0])

        msg = "'high_forecast' should be one of the returned fields"
        self.assertTrue('high_forecast' in stock_data_json['data'][0])

        msg = "'low' should be one of the returned fields"
        self.assertTrue('low' in stock_data_json['data'][0])

        msg = "'low_forecast' should be one of the returned fields"
        self.assertTrue('low_forecast' in stock_data_json['data'][0])

        msg = "'close' should be one of the returned fields"
        self.assertTrue('close' in stock_data_json['data'][0])

        msg = "'close_forecast' should be one of the returned fields"
        self.assertTrue('close_forecast' in stock_data_json['data'][0])

        msg = "'volume' should be one of the returned fields"
        self.assertTrue('volume' in stock_data_json['data'][0])

        msg = "'volume_forecast' should be one of the returned fields"
        self.assertTrue('volume_forecast' in stock_data_json['data'][0])

        msg = "The last date should be '2022-07-03'"
        self.assertEqual(stock_data_json['data'][0]['date'], '2022-07-03')

        msg = "The last value for open_forecast should be 157.0"
        self.assertEqual(round(
            stock_data_json['data'][0]['open_forecast'], 0), 157.0)

        msg = "The first date should be '2022-07-03'"
        self.assertEqual(stock_data_json['data'][-1]['date'], '1999-11-01')

        msg = "The first value for low_forecast should be 102"
        self.assertEqual(round(
            stock_data_json['data'][-1]['low_forecast'], 0), 102)

    def test_process_stock_data(self):
        """Test process_stock_data function
        """
        # Instantiate forecaster object and run forecast
        forecaster = Forecaster()
        stock_data_json = forecaster.process_stock_data(
            self.stock_data, self.grain)

        # Run checks here
        msg = "The return object should be a dict"
        self.assertTrue(isinstance(stock_data_json, dict))
        
        msg = "Number of elements in data list should be 5685"
        self.assertEqual(len(stock_data_json['data']), 5685)

        msg = "'date' should be one of the returned fields"
        self.assertTrue('date' in stock_data_json['data'][0])

        msg = "'open' should be one of the returned fields"
        self.assertTrue('open' in stock_data_json['data'][0])

        msg = "'high' should be one of the returned fields"
        self.assertTrue('high' in stock_data_json['data'][0])

        msg = "'low' should be one of the returned fields"
        self.assertTrue('low' in stock_data_json['data'][0])

        msg = "'close' should be one of the returned fields"
        self.assertTrue('close' in stock_data_json['data'][0])

        msg = "'volume' should be one of the returned fields"
        self.assertTrue('volume' in stock_data_json['data'][0])

        msg = "The last date should be '2022-06-03'"
        self.assertEqual(stock_data_json['data'][0]['date'], '2022-06-03')

        msg = "The last value for open_forecast should be 146.9000"
        self.assertEqual(stock_data_json['data'][0]['open'], '146.9000')

        msg = "The first date should be '1999-11-01'"
        self.assertEqual(stock_data_json['data'][-1]['date'], '1999-11-01')

        msg = "The first value for low_forecast should be 77.3700'"
        self.assertEqual(stock_data_json['data'][-1]['low'], '77.3700')

