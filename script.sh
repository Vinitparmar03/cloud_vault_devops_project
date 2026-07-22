#!/bin/bash

echo "Starting all services..."

# User Service
(
  cd user-service || exit
  npm run start
) &

# Vault Service
(
  cd vault-service || exit
  npm run start
) &

# Gateway
(
  cd gateway || exit
  npm run start
) &

# Frontend
(
  cd frontend || exit
  npm run dev
)

wait