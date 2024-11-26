echo 'Building frontend...'
npm run build

echo 'Copying frontend build to server...'
scp -i ../../credentials/WebServerKey.pem -r dist/* ubuntu@18.221.235.12:/home/ubuntu/findful-frontend

echo 'Deploying frontend...'
ssh -i ../../credentials/WebServerKey.pem ubuntu@18.221.235.12 'sudo cp -r /home/ubuntu/findful-frontend/* /var/www/html'

echo 'Frontend deployed successfully!'
