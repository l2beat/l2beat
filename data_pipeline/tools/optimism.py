import json
import sys
from datetime import datetime, timedelta
import requests
from google.cloud import bigquery
import os
from dotenv import load_dotenv


load_dotenv()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.environ.get('BQ_CREDENTIALS')


def bq_query(query):

    client = bigquery.Client()
    query_job = client.query(query)
    rows = list(query_job.result())

    return rows


def get_max_block_for_date(date):

    query = """SELECT MAX(number)
            FROM bigquery-public-data.crypto_ethereum.blocks
            WHERE date(timestamp) = '{}'; """.format(date)

    max_block = bq_query(query)
    if max_block[0][0]:
        return int(max_block[0][0])
    else:
        return None


def get_optimism_batches(date):

    query = """select l.block_timestamp, l.block_number, tx.`hash`, tx.gas, tx.gas_price, l.`data`
            from bigquery-public-data.crypto_ethereum.logs as l 
            left join bigquery-public-data.crypto_ethereum.transactions tx
            on l.transaction_hash = tx.`hash`
            where date(l.block_timestamp) = '{}'
            and date(tx.block_timestamp) = '{}'
            and tx.to_address = '0xed2701f7135eab0d7ca02e6ab634ad6cbe159ffb'
            and topics[safe_offset(0)] in ('0x127186556e7be68c7e31263195225b4de02820707889540969f62c05cf73525e')
            order by l.block_number;
            """.format(date, date)
    
    batches = bq_query(query)

    return batches


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
