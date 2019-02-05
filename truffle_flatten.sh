#!/usr/bin/env bash

node ./node_modules/.bin/truffle-flattener ./contracts/Migrations.sol > ./flat/Migrations.sol;

node ./node_modules/.bin/truffle-flattener ./contracts/RadiCards.sol > ./flat/RadiCards-V2.0.sol;
