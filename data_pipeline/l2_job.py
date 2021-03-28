from tools.storage import create_storage
from tools.pull_data import pull_l2_data
import sys
import json


def run_l2beat(config=None):

    with open(sys.argv[1]) as json_data:
        config = json.load(json_data)

    # create object to store data
    output_object = create_storage(path=config['output'])

    # get the earliest bridge deploy date
    config_l2s = [l2 for l2 in config['l2s'].keys()]

    output = pull_l2_data(output=output_object,
                            config_l2s=config_l2s,
                            config=config)

    return output


if sys.argv and len(sys.argv) == 2:
    with open(sys.argv[1]) as json_data:
        config = json.load(json_data)
    
    output = run_l2beat(config=config)

    with open(config['output'], 'w') as output_file:
        json.dump(output, output_file)

else:
    print('Please pass one and only one argument (a .json config file)')
