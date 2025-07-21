#!/bin/bash

# Start the application only (connect to external database)
docker-compose -f docker-compose.app-only.yml up -d
