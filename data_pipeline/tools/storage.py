import json
import traceback


def create_storage(path=None):

    # try to load in json or crate empty object
    if path:
        try:
            with open(path, 'r') as f:
                output = json.load(f)
        except:
            traceback.print_exc()
            # output = None
            output = dict()
            output.setdefault('TVL', 0)
            output.setdefault('data', [])
            output.setdefault('l2s', {})

    else:
        output = dict()
        output.setdefault('TVL', 0)
        output.setdefault('data', [])
        output.setdefault('l2s', {})
    
    return output
