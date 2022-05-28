from django.test import TestCase
from django.urls import reverse, resolve
from django.test import Client
from .views import *


class TestUrls(TestCase):
    def test_stock_list_url_resolve(self):
        url = reverse('stock_service:stock_list')
        self.assertEqual(resolve(url).func.view_class, StockListServiceAPIView)

    def test_stock_data_url_resolve(self):
        url = reverse('stock_service:stock_data')
        self.assertEqual(resolve(url).func.view_class, StockDataServiceAPIView)


class TestStockListServiceAPIView(TestCase):

    def setUp(self):
        self.client = Client()
        self.data_url = reverse('stock_service:stock_list')

    def test_response_stock_list(self):
        response = self.client.get(self.data_url)
        # status 200, can be found on internet.
        self.assertEquals(response.status_code, 200)
        self.assertIsNotNone(response)


class TestStockDataServiceAPIView(TestCase):
    def setUp(self):
        self.client = Client()
        self.stock_data_daily_url = \
            'https://www.alphavantage.co/query?function=TIME_' \
            'SERIES_DAILY&outputsize=full&apikey=Q5SUUT82ASKLSWB1'
        self.stock_data_weekly_url = \
            'https://www.alphavantage.co/query?function=T' \
            'IME_SERIES_WEEKLY&apikey=Q5SUUT82ASKLSWB1'
        self.stock_data_monthly_url = \
            'https://www.alphavantage.co/query?function=' \
            'TIME_SERIES_MONTHLY&apikey=Q5SUUT82ASKLSWB1'

    def test_post_request(self):
        symbol = "fsr"
        url = self.stock_data_daily_url + f'&symbol={symbol}'
        response = requests.get(url)
        self.assertEquals(response.status_code, 200)

