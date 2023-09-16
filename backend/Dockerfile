FROM node:18

WORKDIR /usr/src/app

# Install the MySQL client package
RUN apt-get update && apt-get install -y default-mysql-client

COPY package*.json ./

RUN npm install

COPY . .

# Copy the health check script into the image
COPY wait-for-mysql.sh /usr/src/app/wait-for-mysql.sh

# Make the script executable
RUN chmod +x /usr/src/app/wait-for-mysql.sh

COPY startup.sh /usr/src/app/startup.sh
RUN chmod +x /usr/src/app/startup.sh

# Expose the port your app runs on (replace 3000 with your app's port)
EXPOSE 3000

CMD ["/usr/src/app/startup.sh"]