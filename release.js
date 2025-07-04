#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`📦 ${description}...`, colors.blue);
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, colors.red);
    return false;
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function updateVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
  log(`📝 Updated package.json version to ${newVersion}`, colors.green);
}

function validateVersion(version) {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return versionRegex.test(version);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('🚀 Time Tracking App Release Helper', colors.bold);
    log('');
    log('Usage:', colors.yellow);
    log('  node release.js <version>     Create a new release');
    log('  node release.js patch         Bump patch version (1.0.0 → 1.0.1)');
    log('  node release.js minor         Bump minor version (1.0.0 → 1.1.0)'); 
    log('  node release.js major         Bump major version (1.0.0 → 2.0.0)');
    log('');
    log('Examples:', colors.yellow);
    log('  node release.js 1.2.3');
    log('  node release.js patch');
    log('');
    log(`Current version: ${getCurrentVersion()}`, colors.blue);
    process.exit(0);
  }

  const currentVersion = getCurrentVersion();
  let newVersion;
  
  if (args[0] === 'patch' || args[0] === 'minor' || args[0] === 'major') {
    // Auto increment version
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (args[0]) {
      case 'patch':
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
    }
  } else {
    // Use provided version
    newVersion = args[0];
    if (!validateVersion(newVersion)) {
      log(`❌ Invalid version format: ${newVersion}`, colors.red);
      log('Version must be in format: x.y.z (e.g., 1.2.3)', colors.yellow);
      process.exit(1);
    }
  }

  log('🚀 Creating release for Time Tracking App', colors.bold);
  log('');
  log(`📊 Version: ${currentVersion} → ${newVersion}`, colors.blue);
  log('');

  // Check if git is clean
  try {
    execSync('git diff --exit-code', { stdio: 'ignore' });
    execSync('git diff --cached --exit-code', { stdio: 'ignore' });
  } catch (error) {
    log('❌ Git working directory is not clean. Please commit your changes first.', colors.red);
    process.exit(1);
  }

  // Update version in package.json
  updateVersion(newVersion);

  // Create git commit and tag
  if (!runCommand('git add package.json', 'Staging package.json')) {
    process.exit(1);
  }

  if (!runCommand(`git commit -m "chore: bump version to ${newVersion}"`, 'Creating version commit')) {
    process.exit(1);
  }

  if (!runCommand(`git tag -a v${newVersion} -m "Release v${newVersion}"`, 'Creating release tag')) {
    process.exit(1);
  }

  log('');
  log('🎉 Release prepared successfully!', colors.green);
  log('');
  log('📋 Next steps:', colors.yellow);
  log(`   1. Push the changes: git push origin main`);
  log(`   2. Push the tag: git push origin v${newVersion}`);
  log(`   3. GitHub Actions will automatically build and create the release`);
  log('');
  log('🔗 Or push everything at once:', colors.yellow);
  log(`   git push origin main v${newVersion}`);
  log('');
  log('📦 The release will include:', colors.blue);
  log('   • TimeTracking-Setup.exe (Windows installer)');
  log('   • TimeTracking-Portable.exe (Portable version)');
  log('   • Automatic release notes');
  log('');
}

if (require.main === module) {
  main();
}