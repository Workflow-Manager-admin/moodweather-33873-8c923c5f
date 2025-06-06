#!/bin/bash
cd /home/kavia/workspace/code-generation/moodweather-33873-8c923c5f/moodweather_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

