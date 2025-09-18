module.exports = {
  apps: [
    {
      name: 'webtool',
      script: 'pnpm',
      args: 'start',
      cwd: '/data/html/WebTool',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // 日志配置
      log_file: '/var/log/pm2/webtool.log',
      out_file: '/var/log/pm2/webtool-out.log',
      error_file: '/var/log/pm2/webtool-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 进程管理
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 5,
      restart_delay: 4000,
      
      // 健康检查
      health_check_url: 'http://localhost:3000/api/health',
      health_check_grace_period: 3000,
      
      // 监控
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
      
      // 其他配置
      source_map_support: true,
      instance_var: 'INSTANCE_ID'
    }
  ]
}