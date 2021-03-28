from coinpaprika import client
from datetime import datetime


def get_prices_for_token(day_zero, token, config):

    coinpaprika_client = client.Client()
    prices_in_usd = dict()
    
    # get token prices from coinpaprika
    coinpaprika_id = config['tokens'][token]['coinpaprika_id']
    prices_array = coinpaprika_client.historical(coinpaprika_id, start=datetime.strftime(day_zero, '%Y-%m-%d'), quote='usd', interval='1d')
    
    prices_in_usd[token] = prices_array
    
    # transform informations about tokens prices into more handy object
    prices_dict = dict()
    for token in prices_in_usd:
        for record in prices_in_usd[token]:
            
            prices_dict.setdefault(record['timestamp'][:10], {})
            prices_dict[record['timestamp'][:10]][token] = record['price']
    
    return prices_dict