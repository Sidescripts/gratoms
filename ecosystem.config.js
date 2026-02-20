module.exports = {
  apps: [{
    name: 'gratom-app',
    script: './server/app.js',          // Your actual app entry point
    instances: 'max',
    exec_mode: 'cluster',               // No comma after this
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],  // Fixed 'git' → '.git'
    max_memory_restart: '1G',
    autorestart: true,
    out_file: './logs/out.log',
    error_file: './logs/err.log',
    merge_logs: true,
    time: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3000                        // No trailing comma
    }
  }]
};