#!/bin/bash
set -e

echo "=== System Update & Dependencies ==="
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx git curl -y

echo "=== Install Node.js (v20) ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "=== Install PM2 ==="
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "=== Setup Repository ==="
cd ~
if [ -d "testtanh" ]; then
    echo "Updating existing repo..."
    cd testtanh
    # discard any local changes on the server before pulling
    git reset --hard HEAD
    git clean -fd
    git pull origin main
else
    echo "Cloning repo..."
    git clone https://github.com/duckk37/testtanh.git
    cd testtanh
fi

echo "=== Setup Backend ==="
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Check if .env exists, if not, copy from a local example or create empty
if [ ! -f ".env" ]; then
    echo 'GEMINI_API_KEY=""' > .env
fi

# Apply migrations
python3 -c "import migrations; from database import engine; migrations.apply_migrations(engine)" || true

# Stop existing pm2 if any
pm2 delete english-backend || true

# Start backend with PM2
pm2 start "uvicorn main:app --host 127.0.0.1 --port 8000" --name "english-backend"
pm2 save

echo "=== Setup Frontend ==="
cd ~/testtanh/frontend
echo "VITE_API_URL=/api" > .env
npm install
npm run build

echo "=== Deploy to Nginx ==="
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

echo "=== Configure Nginx ==="
cat << 'EOF' | sudo tee /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;
    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo systemctl restart nginx
echo "=== Deployment Complete ==="
