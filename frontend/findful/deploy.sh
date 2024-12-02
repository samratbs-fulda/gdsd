#!/bin/bash

PROJECT_NAME="findful-frontend"       
VM_USER="ubuntu"              
VM_IP="18.221.235.12"              
VM_PATH="/home/$VM_USER/$PROJECT_NAME" 

echo 'Building frontend...'
npm run build

echo 'Copying frontend build to server...'
scp -i ../../credentials/WebServerKey.pem -r dist/* $VM_USER@$VM_IP:$VM_PATH

echo 'Deploying frontend...'
ssh -i ../../credentials/WebServerKey.pem $VM_USER@$VM_IP << EOF 
    sudo cp -r /home/ubuntu/findful-frontend/* /var/www/html
    sudo systemctl restart nginx
EOF

echo 'Frontend deployed successfully!'
