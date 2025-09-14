#!/bin/bash

# Quick script to run just the backend
if [ -d ".venv" ]; then
    ./.venv/bin/python app.py
else
    python3 app.py
fi