from web3 import Web3
from datetime import datetime

from google.cloud import bigquery
import os
from dotenv import load_dotenv

from chain import chain

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


def eod_balance_of(token, address, day=None):

    ABI = """[{"constant":true,
            "inputs":[{"name":"src","type":"address"}],
            "name":"balanceOf",
            "outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function"}]"""
    block = None

    try:
        token_contract = chain.eth.contract(address=Web3.toChecksumAddress(token), abi=ABI)
        if day:
            block = get_max_block_for_date(day)
        balance = token_contract.functions.balanceOf(Web3.toChecksumAddress(address)).call(block_identifier=block)

    except Exception as e:
        print(e)
        print('token: {}'.format(token))
        print('address: {}'.format(address))
        print('date: {}'.format(day))
        balance = None

    return balance

# tool to compare results: https://etherscan.io/tokencheck-tool
