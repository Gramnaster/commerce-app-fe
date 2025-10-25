// scripts/inject-last-commit.js
// This script gets the last git commit date and writes it to .env file for Vite

const { execSync } = require('child_process');
const fs = require('fs');

try {
  const date = execSync('git log -1 --format=%cd --date=short').toString().trim();
  // Format: YYYY-MM-DD to 'DD Mon YYYY'
  const [year, month, day] = date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatted = `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  const envLine = `VITE_LAST_COMMIT_DATE=${formatted}\n`;
  // Write or update .env.local
  let env = '';
  if (fs.existsSync('.env.local')) {
    env = fs.readFileSync('.env.local', 'utf8');
    // Remove any previous VITE_LAST_COMMIT_DATE
    env = env.replace(/^VITE_LAST_COMMIT_DATE=.*$/m, '');
  }
  env += envLine;
  fs.writeFileSync('.env.local', env);
  console.log('Injected last commit date:', formatted);
} catch (e) {
  console.error('Failed to inject last commit date:', e);
  process.exit(1);
}
