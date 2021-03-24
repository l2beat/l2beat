from web3 import Web3
from dotenv import load_dotenv
import os

load_dotenv()

# basic connection to the blockchain node
def connect_chain(http_hook=None):
    method = 'HTTP'
    provider = Web3.HTTPProvider
    hook = http_hook

    try:
        w3 = Web3(provider(hook, request_kwargs={'timeout': 60}))
        if w3.isConnected():
            print("Connected to %s: %s with latest block %d." % (method, hook, w3.eth.blockNumber))
            return w3
        else:
            print('%s connection to %s failed.' % (method, hook))
            return None
    except Exception as e:
        print("Error while connecting to chain.")
        print(e)


chain = connect_chain(os.environ.get('BC_NODE'))