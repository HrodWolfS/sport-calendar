#!/bin/bash

# Créer la base de données
createdb sport_calendar

# Appliquer les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate 