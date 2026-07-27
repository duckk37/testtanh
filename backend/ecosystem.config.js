module.exports = {
  apps: [
    {
      name: 'english-backend',
      script: 'uvicorn',
      args: 'main:app --host 127.0.0.1 --port 8000 --workers 2',
      interpreter: 'venv/bin/python',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      }
    }
  ]
};
