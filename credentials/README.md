# Credentials

## Accessing live web app

This section contains the access point for the live version of the web app.

- [Website Url](https://findful.us.to/)
- [Website search page](https://findful.us.to/)

## Connecting to Webserver 

This section explains how to connect to  GSDS-webserver (VM) using SSH and a key located in the same folder.

### Prerequisites

- SSH client installed on your machine.
- Access to the private key file [WebServerKey.pem](WebServerKey.pem).

### Steps

1. **Open Terminal or Command Prompt:**
    - On Windows, you can use Command Prompt or PowerShell.
    - On macOS or Linux, use the Terminal.

2. **Navigate to the Folder Containing the Key:**
    ```sh
    cd credentials/
    ```

3. **(Mac only) Add Read-Write permissions to key file:**
    ```sh
    chmod 600 ./WebServerKey.pem
    ```

4. **Connect to the Webserver:**
    ```sh
    ssh -i WebServerKey.pem ubuntu@18.221.235.12
    ```

## Connection to Database

This section focus on the connection to the MySql CLI.

> **Note:** For security reasons, the connection to the database is close to only the vm hosting the webserver. In order to access the MySql CLI, you have to be [connected to the vm](#connecting-to-webserver).

### Steps

1. **Connect to MySql:**
    ```sh
    mysql -h findful-database.c7ai6quogq0m.us-east-2.rds.amazonaws.com -P 3306 -u admin -p'gdsdadmin123' FindfulDB
    ```
    This will automatically connect to the MySql CLI and use the FindfulDB.

## M2 Vertical prototipe

### Summary of the credentials listed above:
 - Website Url: https://findful.us.to
 - Website Url to search page: https://findful.us.to
 - SSH Url: 
    ```sh
    ssh -i WebServerKey.pem ubuntu@18.221.235.12
    ```
 - SSH username: ubuntu
 - SSH key: [WebServerKey.pem](WebServerKey.pem)
 - Database Url: findful-database.c7ai6quogq0m.us-east-2.rds.amazonaws.com
 - Database username: admin
 - Database password: gdsdadmin123
 - Search source code: [Frontend](../frontend/findful/src/pages/Homepage.jsx) and [Backend](../backend/src/services/listingService.js)

### Additional information
To access the interactive session where the backend is running and showing the logs use this comand:
```sh
tmux attach -t findful-backend
```
To exit the interactive session press:
```sh
Ctrl+B + D
```