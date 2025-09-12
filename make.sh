#!/usr/bin/env bash


if [[ "$OSTYPE" == "linux-gnu"* ]]; then
./venv/bin/pros build-compile-commands --no-analytics all
./venv/bin/pros make
elif [[ "$OSTYPE" == "msys" ]]; then
pros build-compile-commands --no-analytics all
pros make
else
	echo "What Operating System!!"
fi
