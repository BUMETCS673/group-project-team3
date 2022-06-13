import requests
from django.test import Client, TestCase
from django.urls import resolve, reverse
from parameterized import parameterized

from .views import StockDataServiceAPIView, StockListServiceAPIView

'''
Unit tests for stock list and stock data objects.

Tests are using parametrized.expand function for removing unnecessary repetition
for similar tests. It specifies a list of tuples that will be used in each of the
tests and storing them in the test function parameter values
'''


class TestUrls(TestCase):

    @parameterized.expand([('stock_service:stock_list', StockListServiceAPIView),
                           ('stock_service:stock_data', StockDataServiceAPIView)])
    def test_stock_url_is_valid(self, path, view):
        url = reverse(path)
        self.assertEqual(resolve(url).func.view_class, view)


class TestStockListServiceAPIView(TestCase):

    def test_response_stock_list_is_successful(self):
        response = Client().get(reverse('stock_service:stock_list'))
        # More about status 200: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
        self.assertEquals(response.status_code, 200)


class TestStockDataServiceAPIView(TestCase):

    @parameterized.expand(['DAILY', 'WEEKLY', 'MONTHLY'])
    def test_post_request_for_fsr_stock_is_successful(self, aggregation):
        data_url = \
            'https://www.alphavantage.co/query?function=TIME_SERIES_{}&outputsize=full&apikey=Q5SUUT82ASKLSWB1&symbol={}'.format(aggregation,
                'fsr')
        response = requests.get(data_url)
        self.assertEquals(response.status_code, 200)
