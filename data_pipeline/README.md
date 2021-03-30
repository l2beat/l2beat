# L2Beat Data pipeline

Python scripts to get/update data used by l2beat frontend.

## Running

1. Create `env` file:

```
BQ_CREDENTIALS=relative path to a file with google big query credentails
BC_NODE=url to rpc archive node
```

2. Create venv, activate it and install deps:

```sh
python3 -m venv env
. env/bin/activate
pip3 install -r requirements.txt
```

3. Run script:

```sh
python l2_job.py config.json
```
