module.exports = {
  apps: [
    {
      name: 'vanilla-calendar',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};