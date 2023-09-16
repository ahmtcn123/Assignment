#!/bin/sh
# wait-for-mysql.sh

set -e

host="$1"
shift
cmd="$@"

# Function to check if MySQL is ready
check_mysql() {
  mysqladmin ping -h "$host" -u root -p"${MYSQL_ROOT_PASSWORD}" 2>/dev/null
}

until check_mysql "$host"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
