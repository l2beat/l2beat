from datetime import datetime, timedelta, timezone
from .optimism import process_batches


def pull_optimism_data(output=None):
    optimism_batches_processed_dates = []
    for i in output['l2s']['Optimism']['data']:
        if 'tps' in i:
            optimism_batches_processed_dates.append(i['date'])
    
    optimism_batches_processed_dates.sort()

    optimism_processed_dates = []
    for i in output['l2s']['Optimism']['data']:
        optimism_processed_dates.append(i['date'])
    
    optimism_processed_dates.sort()

    if optimism_batches_processed_dates == []:
        start_batches_processing = optimism_processed_dates[0]
    else:
        start_batches_processing = datetime.strftime(datetime.strptime(optimism_batches_processed_dates[-1], '%Y-%m-%d') + timedelta(days=1), '%Y-%m-%d')

    end_batches_porcessing = optimism_processed_dates[-1]
    tps_helper = []

    batches_processing_date = start_batches_processing

    while batches_processing_date <= end_batches_porcessing:
        
        print(batches_processing_date)

        batches_info = process_batches(batches_processing_date)
        if batches_info:

            for i in output['l2s']['Optimism']['data']:
                
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
    
    return output