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