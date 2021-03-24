import json
import sys
from datetime import datetime, timedelta
import requests
from coinpaprika import client

from utils import get_optimism_batches


def process_batches(date):

    batches = get_optimism_batches(date)
    if batches:

        usd_gas_cost = 0
        count_batches = 0

        r = requests.get('https://api.coinbase.com/v2/prices/ETH-USD/spot?date={}'.format(date))
        eth = json.loads(r.text)
        eth_price = eth['data']['amount']

        for i in batches:
            d = i[5]
            _batchSize = int(d[66:130], 16)
            count_batches += _batchSize
            # _prevTotalElements = int(d[130:194], 16)

            gas = i[3] * i[4]
            gas_normalized = gas / 10 ** 18
            gas_cost = float(gas_normalized) * float(eth_price)

            usd_gas_cost += gas_cost

        # print('Total gas cost (USD): {}'.format(usd_gas_cost))
        # print('Number of transactions: {}'.format(len(batches)))
        # print('Sum of batches: {}'.format(count_batches))
        # print('Total batches: {}'.format(int(batches[-1][5][130:194], 16) + int(batches[-1][5][66:130], 16)))
        # print('Batch processing end time: {}'.format(batches[-1][0]))

        output = dict(
            total_gas_cost_usd = usd_gas_cost,
            number_of_transactions = len(batches),
            sum_of_batches = count_batches,
            total_batches = int(batches[-1][5][130:194], 16) + int(batches[-1][5][66:130], 16),
            end_time = batches[-1][0]
            )

        return output
    else:
    
        return None
