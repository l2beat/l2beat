module.exports = {
  extends: '../../.eslintrc.json',
  plugins: ['custom-rules'],
  rules: {
    // 'eslint-plugin-custom-rules/db_ts_no_tz': 'error',
    'custom-rules/db_ts_no_tz': 'error',
  },
}
