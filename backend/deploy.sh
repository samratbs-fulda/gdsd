#!/bin/bash

PROJECT_NAME="findful-backend"       
VM_USER="ubuntu"              
VM_IP="18.221.235.12"              
VM_PATH="/home/$VM_USER/$PROJECT_NAME"   

echo "Transferring files to the VM..."
scp -i ../credentials/WebServerKey.pem -r ./*  $VM_USER@$VM_IP:$VM_PATH

echo "Deploying on the VM..."
ssh -i ../credentials/WebServerKey.pem $VM_USER@$VM_IP << EOF
    cd $VM_PATH
    rm deploy.sh
EOF

echo "Backend deployed successfully!"
