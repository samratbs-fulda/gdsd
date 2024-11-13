# Connecting to Webserver 

This guide explains how to connect to  GSDS-webserver (VM) using SSH and a key located in the same folder.

## Prerequisites

- SSH client installed on your machine.
- Access to the private key file (`WebServerKey.pem`).

## Steps

1. **Open Terminal or Command Prompt:**
    - On Windows, you can use Command Prompt or PowerShell.
    - On macOS or Linux, use the Terminal.

2. **Navigate to the Folder Containing the Key:**
    ```sh
    cd credentials/
    ```

3. **Mac only: Add Read-Write permissions to key file**
```sh
chmod 600 ./WebServerKey.pem
```

4. **Connect to the Webserver:**
    ```sh
    ssh -i WebServerKey.pem ubuntu@18.221.235.12
    ```

## Troubleshooting
- Verify the IP address and username are correct.
- Check your network connection.

## Additional Resources
- [SSH Documentation](https://www.ssh.com/ssh/)
