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

def get_date_for_block(block):
    block = chain.eth.get_block(block_identifier=block)
    block.timestamp

    return datetime.fromtimestamp(block.timestamp)

def eod_balance_of(token, address, day=None, deployed_at_block=None):
    if token == '0x0': # means native eth
        block = None
        if day:
            block = get_max_block_for_date(day)

        eth_balance = chain.eth.get_balance(Web3.toChecksumAddress(address), block_identifier=block)
        return eth_balance

    ABI = """[{"constant":true,
            "inputs":[{"name":"src","type":"address"}],
            "name":"balanceOf",
            "outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function"}]"""
    block = None

    token_contract = chain.eth.contract(address=Web3.toChecksumAddress(token), abi=ABI)
    if day:
        block = get_max_block_for_date(day)

    # if token was not yet deployed just return 0
    if block and deployed_at_block and deployed_at_block > block:
        return 0
    balance = token_contract.functions.balanceOf(Web3.toChecksumAddress(address)).call(block_identifier=block)

    return balance

# tool to compare results: https://etherscan.io/tokencheck-tool
