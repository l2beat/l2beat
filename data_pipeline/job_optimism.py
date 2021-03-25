import json
import sys
from datetime import datetime, timedelta, timezone

from coinpaprika import client
from utils import eod_balance_of
from optimism import process_batches

job_start = datetime.now()
print("Job started at {}".format(datetime.strftime(job_start, '%Y-%m-%d %H:%M:%S')))

def pull_l2_data():

    #TODO: add config file validation
    if sys.argv and len(sys.argv) == 2:
        
        with open(sys.argv[1]) as json_data:
            config = json.load(json_data)
        
        # try to load in json or crate empty object
        try:
            with open(config['output'], 'r') as f:
                final_output = json.load(f)
            
            processed_dates = []
            for i in final_output['data']:
                processed_dates.append(datetime.strptime(i['date'], '%Y-%m-%d'))
            
            processed_dates.sort()
            # day_zero: if json file exists, pick the last date and set it as a starting point for update : datetime object
            day_zero = processed_dates[-1] + timedelta(days=1)
            if day_zero.date() >= datetime.utcnow().date():
                print('Nothing to do. Dataset is up to date.')
                job_end = datetime.now()
                print("Job ended at {}".format(datetime.strftime(job_end, '%Y-%m-%d %H:%M:%S')))
                print("Job duration: {}".format(job_end - job_start))
                return
        except:
            final_output = dict()

        config_l2s = [l2 for l2 in config['l2s'].keys()]

        init_dates = []
        for l2 in config_l2s:
            for bridge in config['l2s'][l2]['bridges']:
                if day_zero and day_zero > datetime.strptime(bridge['deployed_at_date'][:10], '%Y-%m-%d'):
                    if day_zero not in init_dates:
                        init_dates.append(datetime.strftime(day_zero, '%Y-%m-%d'))
                else:
                    init_dates.append(bridge['deployed_at_date'][:10])
        
        init_dates.sort()

        coinpaprika_client = client.Client()
        prices_in_usd = dict()
        
        # get tokens prices from coinpaprika
        start_day = init_dates[0]
        for token in config['tokens'].keys():
            coinpaprika_id = config['tokens'][token]['coinpaprika_id']
            prices_array = coinpaprika_client.historical(coinpaprika_id, start=start_day, quote='usd', interval='1d')
            
            prices_in_usd[token] = prices_array
        
        # transform informations about tokens prices into more handy object
        prices_dict = dict()
        for token in prices_in_usd:
            for record in prices_in_usd[token]:
                
                prices_dict.setdefault(record['timestamp'][:10], {})
                prices_dict[record['timestamp'][:10]][token] = record['price']

        final_output.setdefault('TVL', 0)
        final_output.setdefault('data', [])
        final_output.setdefault('l2s', {})

        l2beat_days = []
        l2_days = []
        for l2 in config_l2s:

            final_output['l2s'].setdefault(l2, {})
            final_output['l2s'][l2].setdefault('TVL', 0)
            final_output['l2s'][l2].setdefault('data', [])
            final_output['l2s'][l2].setdefault('bridges', {})

            bridge_days = []
            for bridge in config['l2s'][l2]['bridges']:

                bridge_address = bridge['address']

                if day_zero and day_zero > datetime.strptime(bridge['deployed_at_date'][:10], '%Y-%m-%d'):
                    starting_point = day_zero
                else:
                    starting_point = datetime.strptime(bridge['deployed_at_date'][:10], '%Y-%m-%d')
                
                final_output['l2s'][l2]['bridges'].setdefault(bridge_address, {})
                final_output['l2s'][l2]['bridges'][bridge_address].setdefault('TVL', 0)
                final_output['l2s'][l2]['bridges'][bridge_address].setdefault('data', [])
                final_output['l2s'][l2]['bridges'][bridge_address].setdefault('tokens', {})

                # get tracked tokens for bridge from config
                tokens = bridge['tokens']
                
                # create array of days to process
                days_to_process = [datetime.strftime(starting_point, "%Y-%m-%d")]
                while days_to_process[-1] != datetime.strftime((datetime.now().date() - timedelta(days=1)), "%Y-%m-%d"):
                    days_to_process.append(
                        datetime.strftime(datetime.strptime(days_to_process[-1], "%Y-%m-%d") + timedelta(days=1), "%Y-%m-%d")
                    )
                
                print(days_to_process)

                for token in tokens:

                    final_output['l2s'][l2]['bridges'][bridge_address]['tokens'].setdefault(token, {})
                    final_output['l2s'][l2]['bridges'][bridge_address]['tokens'][token].setdefault('TVL', 0)
                    final_output['l2s'][l2]['bridges'][bridge_address]['tokens'][token].setdefault('data', [])

                for day in days_to_process:

                    for token in tokens:
                        
                        balance = eod_balance_of(config['tokens'][token]['address'], bridge_address, day)
                        if balance:
                        
                            human_readable_balance = balance / 10 ** config['tokens'][token]['decimals']
                            value = (balance / 10 ** config['tokens'][token]['decimals']) * prices_dict[day][token]

                            final_output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['data'].append({'date': day, 'usd': value, 'token': human_readable_balance})

                            final_output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['TVL'] = value

                            # bridge TVL data
                            if final_output['l2s'][l2]['bridges'][bridge_address]['data']:
                                if day not in bridge_days:
                                    final_output['l2s'][l2]['bridges'][bridge_address]['data'].append({'date': day, 'usd': value})
                                    bridge_days.append(day)
                                else:
                                    for i in final_output['l2s'][l2]['bridges'][bridge_address]['data']:
                                        if i['date'] == day:
                                            i['usd'] += value
                            else:
                                final_output['l2s'][l2]['bridges'][bridge_address]['data'].append({'date': day, 'usd': value})

                            # l2 TVL data
                            if final_output['l2s'][l2]['data']:
                                if day not in l2_days:
                                    final_output['l2s'][l2]['data'].append({'date': day, 'usd': value})
                                    l2_days.append(day)
                                else:
                                    for i in final_output['l2s'][l2]['data']:
                                        if i['date'] == day:
                                            i['usd'] += value
                            else:
                                final_output['l2s'][l2]['data'].append({'date': day, 'usd': value})

                            # total TVL data
                            if final_output['data']:
                                if day not in l2beat_days:
                                    final_output['data'].append({'date': day, 'usd': value})
                                    l2beat_days.append(day)
                                else:
                                    for i in final_output['data']:
                                        if i['date'] == day:
                                            i['usd'] += value
                            else:
                                final_output['data'].append({'date': day, 'usd': value})
                            
                            if day == days_to_process[-1]:
                                final_output['l2s'][l2]['bridges'][bridge_address]['TVL'] += value
                                final_output['l2s'][l2]['TVL'] += value
                                final_output['TVL'] += value

        # process batches for Optimism
        optimism_init_dates = []
        for l2 in config_l2s:
            for bridge in config['l2s']['Optimism']['bridges']:
                if day_zero and day_zero > datetime.strptime(bridge['deployed_at_date'][:10], '%Y-%m-%d'):
                    if day_zero not in optimism_init_dates:
                        optimism_init_dates.append(datetime.strftime(day_zero, '%Y-%m-%d'))
                else:
                    optimism_init_dates.append(bridge['deployed_at_date'][:10])
        
        optimism_init_dates.sort()

        days_to_process = [datetime.strftime(datetime.strptime(optimism_init_dates[0], "%Y-%m-%d"), "%Y-%m-%d")]
        while days_to_process[-1] != datetime.strftime((datetime.now().date() - timedelta(days=1)), "%Y-%m-%d"):
            days_to_process.append(
                datetime.strftime(datetime.strptime(days_to_process[-1], "%Y-%m-%d") + timedelta(days=1), "%Y-%m-%d")
            )
        
        start_batches_processing = days_to_process[0]
        end_batches_porcessing = days_to_process[-1]
        tps_helper = []

        batches_processing_date = start_batches_processing

        while batches_processing_date <= end_batches_porcessing:

            batches_info = process_batches(batches_processing_date)
            if batches_info:

                for i in final_output['l2s']['Optimism']['data']:
                    
                    if i['date'] == batches_processing_date:
                        
                        # TPS
                        if tps_helper:
                            time_passed = batches_info['end_time'] - tps_helper[-1]
                            tps = batches_info['number_of_transactions'] / round(time_passed.total_seconds())
                            tps_helper.append(batches_info['end_time'])
                        else:
                            time_passed = batches_info['end_time'] - datetime.strptime(start_batches_processing, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                            tps = batches_info['number_of_transactions'] / round(time_passed.total_seconds())
                            tps_helper.append(batches_info['end_time'])

                        i.update(
                            total_gas_cost_usd = batches_info['total_gas_cost_usd'],
                            number_of_transactions = batches_info['number_of_transactions'],
                            gas_per_tx_in_batch = batches_info['total_gas_cost_usd'] / batches_info['number_of_transactions'],
                            sum_of_batches = batches_info['sum_of_batches'],
                            total_batches = batches_info['total_batches'],
                            end_time = datetime.strftime(batches_info['end_time'], '%Y-%m-%d %H:%M:%S'),
                            tps = tps
                            )

            next_day = datetime.strftime(datetime.strptime(batches_processing_date, '%Y-%m-%d') + timedelta(days=1), '%Y-%m-%d')
            batches_processing_date = next_day

        # print(final_output)
        with open(config['output'], 'w') as output_file:
            json.dump(final_output, output_file)
        
        job_end = datetime.now()
        print("Job ended at {}".format(datetime.strftime(job_end, '%Y-%m-%d %H:%M:%S')))
        print("Job duration: {}".format(job_end - job_start))

    else:
        print('Please pass one and only one argument (a .json config file)')
        # print('Pass .json job configuration as first argument to run the script')
    
    return


pull_l2_data()