import unittest
import configparser

# Test if local configuration file meets the requirements and ready to use in app 
config = configparser.ConfigParser()
config.read('api_keys.ini')

class TestConfigurationFile(unittest.TestCase):
   
    def test_file_exists(self):
        # test if configuration file exists
        self.assertTrue(config)

    def test_section_name(self):
        # test if configuration file contains correct section
        section_name = 'API_URLS'
        assert section_name in config
    
    def test_urls(self):
        # test if configuration file contains all required urls
        section_name = 'API_URLS'
        self.assertTrue(config[section_name]['stock_list'])
        self.assertTrue(config[section_name]['stock_data_daily'])
        self.assertTrue(config[section_name]['stock_data_weekly'])
        self.assertTrue(config[section_name]['stock_data_monthly'])
    
if __name__ == '__main__':
    unittest.main()
