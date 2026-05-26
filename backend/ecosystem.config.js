module.exports = {
  apps: [
    {
      name: 'sena-image-backend',
      script: 'dist/main.js',
      instances: 1, // Chạy 1 instance vì dùng database SQLite để tránh tranh chấp ghi (lock DB)
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 33412,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
