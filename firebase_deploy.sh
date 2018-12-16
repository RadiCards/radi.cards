#!/usr/bin/env bash

npm run build;

echo "Deploying radi.cards"
firebase use radi-cards;
firebase deploy;
