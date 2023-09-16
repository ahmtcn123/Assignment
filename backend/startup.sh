#!/bin/sh

# Run the health check
./wait-for-mysql.sh mysql

# Run the Prisma migrations
npm run db:migrate

# Run the database seed script
npm run db:seed

# Build the application
npm run build

# Start the Node.js application
npm run start