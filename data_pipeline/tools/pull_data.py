from .prices import get_prices_for_token
from datetime import datetime, timedelta, timezone
from utils import eod_balance_of
from tools.optimism import process_batches


def dates_array(data, key):
    dates = []
    for i in data:
        dates.append(i[key])
    
    return dates

def pull_l2_data(output=None,
                config_l2s=None,
                config=None):

    if output['data']:
        total_dates = dates_array(output['data'], 'date')
    else:
        total_dates = []
    
    for l2 in config_l2s:

        if output['l2s'] and l2 in output['l2s']:
            l2_dates = dates_array(output['l2s'][l2]['data'], 'date')
        else:
            l2_dates = []

        output['l2s'].setdefault(l2, {})
        output['l2s'][l2].setdefault('TVL', 0)
        output['l2s'][l2].setdefault('data', [])
        output['l2s'][l2].setdefault('bridges', {})

        for bridge in config['l2s'][l2]['bridges']:

            bridge_address = bridge['address']

            if output['l2s'][l2]['bridges']:
                bridge_dates = dates_array(output['l2s'][l2]['bridges'][bridge_address]['data'], 'date')
            else:
                bridge_dates = []

            output['l2s'][l2]['bridges'].setdefault(bridge_address, {})
            output['l2s'][l2]['bridges'][bridge_address].setdefault('TVL', 0)
            output['l2s'][l2]['bridges'][bridge_address].setdefault('data', [])
            output['l2s'][l2]['bridges'][bridge_address].setdefault('tokens', {})

            # get tracked tokens for bridge from config
            tokens = bridge['tokens']

            for token in tokens:

                output['l2s'][l2]['bridges'][bridge_address]['tokens'].setdefault(token, {})
                output['l2s'][l2]['bridges'][bridge_address]['tokens'][token].setdefault('TVL', 0)
                output['l2s'][l2]['bridges'][bridge_address]['tokens'][token].setdefault('data', [])

                # set starting point for pulling data for token in bridge
                if output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['data']:
                    token_dates = []
                    for i in output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['data']:
                        token_dates.append(i['date'])
                    token_dates.sort()
                    starting_point = datetime.strptime(token_dates[-1], '%Y-%m-%d') + timedelta(days=1)
                else:
                    # get bridge deployment date
                    starting_point = datetime.strptime(bridge['deployed_at_date'][:10], '%Y-%m-%d')
                
                if starting_point.date() - timedelta(days=1) < datetime.utcnow().date() - timedelta(days=1):
                    days_to_process = [starting_point]
                    while days_to_process[-1].date() < datetime.utcnow().date() - timedelta(days=1):
                        days_to_process.append(days_to_process[-1] + timedelta(days=1))

                    # get prices for token
                    prices_dict = get_prices_for_token(starting_point, token, config)

                    for day in days_to_process:
                        
                        day = datetime.strftime(day, '%Y-%m-%d')
                        balance = eod_balance_of(config['tokens'][token]['address'], bridge_address, day)
                        if balance:
                        
                            human_readable_balance = balance / 10 ** config['tokens'][token]['decimals']
                            value = (balance / 10 ** config['tokens'][token]['decimals']) * prices_dict[day][token]

                            output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['data'].append({'date': day, 'usd': value, 'token': human_readable_balance})
                            output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['TVL'] = value
                            
                            # bridge data
                            if output['l2s'][l2]['bridges'][bridge_address]['data']:
                                if day not in bridge_dates:
                                    output['l2s'][l2]['bridges'][bridge_address]['data'].append({'date': day, 'usd': value})
                                    bridge_dates.append(day)
                                else:
                                    for i in output['l2s'][l2]['bridges'][bridge_address]['data']:
                                        if i['date'] == day:
                                            i['usd'] += value
                            else:
                                output['l2s'][l2]['bridges'][bridge_address]['data'].append({'date': day, 'usd': value})

                            # l2 data
                            if output['l2s'][l2]['data']:
                                if day not in l2_dates:
                                    output['l2s'][l2]['data'].append({'date': day, 'usd': value})
                                    l2_dates.append(day)
                                else:
                                    for i in output['l2s'][l2]['data']:
                                        if i['date'] == day:
                                            i['usd'] += value
                            else:
                                output['l2s'][l2]['data'].append({'date': day, 'usd': value})

                            # total data
                            if output['data']:
                                if day not in total_dates:
                                    output['data'].append({'date': day, 'usd': value})
                                    total_dates.append(day)
                                else:
                                    for i in output['data']:
                                        if i['date'] == day:
                                            i['usd'] += value
                            else:
                                output['data'].append({'date': day, 'usd': value})
                            
                            # TVLs
                            if datetime.strptime(day, '%Y-%m-%d') == days_to_process[-1]:
                                
                                if output['TVL'] != 0:
                                    if token in output['l2s'][l2]['bridges'][bridge_address]['tokens']:
                                        for i in output['l2s'][l2]['bridges'][bridge_address]['tokens'][token]['data']:
                                            if datetime.strptime(i['date'], '%Y-%m-%d') == days_to_process[0] - timedelta(days=1):
                                                TVL_to_substract = i['usd']

                                                output['l2s'][l2]['bridges'][bridge_address]['TVL'] -= TVL_to_substract
                                                output['l2s'][l2]['TVL'] -= TVL_to_substract
                                                output['TVL'] -= TVL_to_substract

                                output['l2s'][l2]['bridges'][bridge_address]['TVL'] += value
                                output['l2s'][l2]['TVL'] += value
                                output['TVL'] += value
                        
    return output