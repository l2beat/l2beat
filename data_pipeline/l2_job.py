from tools.storage import create_storage
from tools.pull_data import pull_l2_data
from tools.optimism_batches import pull_optimism_data
import sys
import os
import json


def run_l2beat(config=None, output_file_path=None):

    # create object to store data
    output_object = create_storage(path=output_file_path)

    # get the earliest bridge deploy date
    config_l2s = [l2 for l2 in config['l2s'].keys()]

    output = pull_l2_data(output=output_object,
                            config_l2s=config_l2s,
                            config=config)

    return output


if sys.argv and len(sys.argv) == 2:
    with open(sys.argv[1]) as json_data:
        config = json.load(json_data)
    
    parent_dir = os.path.dirname(os.getcwd())
    output_file_path = os.path.join(parent_dir, config['output'])

    output = run_l2beat(config=config, output_file_path=output_file_path)
    output = pull_optimism_data(output=output)

    with open(output_file_path, 'w') as output_file:
        json.dump(output, output_file)

else:
    print('Please pass one and only one argument (a .json config file)')
