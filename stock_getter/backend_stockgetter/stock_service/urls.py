from django.urls import path
from stock_service import views

app_name = 'stock_service'

# Here we specify URL's to our REST API's
urlpatterns = [
    path("stock_list/", views.StockListServiceAPIView.as_view(), 
        name="stock_list"),
    path("stock_data/", views.StockDataServiceAPIView.as_view(), 
        name="stock_data"),
]