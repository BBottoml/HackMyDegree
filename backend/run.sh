#! /bin/bash

nohup sudo python3 app.py &>> log.out &

if [[ "$#" -eq 1 ]]; then
	tail -f log.out
fi
