// build-scripts/build-win.js - Windows Installer Build

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Windows installer for Time Tracking app...');
console.log('');

// Function to run commands with proper error handling
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Function to check if icon exists
function checkIcon() {
  const assetsPath = path.join(process.cwd(), 'assets');
  const iconPath = path.join(assetsPath, 'icon.ico');
  
  if (!fs.existsSync(assetsPath)) {
    console.log('📁 Creating assets folder...');
    fs.mkdirSync(assetsPath, { recursive: true });
  }
  
  if (fs.existsSync(iconPath)) {
    console.log('✅ Found icon.ico');
  } else {
    console.log('⚠️  No icon.ico found in assets folder');
    console.log('   Add icon.ico (256x256) to assets/ folder for custom icon');
    console.log('   Default Electron icon will be used');
  }
  
  return true;
}

// Function to clean dist folder
function cleanDist() {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (fs.existsSync(distPath)) {
    console.log('🧹 Cleaning previous builds...');
    try {
      // Only remove installer files, keep portable if it exists
      const files = fs.readdirSync(distPath);
      files.forEach(file => {
        if (file.includes('Setup') || file.includes('latest')) {
          const filePath = path.join(distPath, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
      });
      console.log('✅ Previous installer builds cleaned');
    } catch (error) {
      console.log('⚠️  Could not clean previous builds:', error.message);
    }
  }
  
  return true;
}

// Function to show build results
function showResults() {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Dist folder not found');
    return false;
  }
  
  const files = fs.readdirSync(distPath);
  const installerFile = files.find(file => file.includes('Setup') && file.endsWith('.exe'));
  
  if (installerFile) {
    const installerPath = path.join(distPath, installerFile);
    const stats = fs.statSync(installerPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('');
    console.log('🎉 INSTALLER BUILD SUCCESSFUL!');
    console.log('');
    console.log('📄 Build Results:');
    console.log(`   Installer: ${installerFile}`);
    console.log(`   Size: ${fileSizeMB} MB`);
    console.log(`   Location: dist/${installerFile}`);
    console.log('');
    console.log('✅ Features:');
    console.log('   ✓ Fast startup (no extraction needed)');
    console.log('   ✓ Desktop shortcut');
    console.log('   ✓ Start menu entry');
    console.log('   ✓ Proper Windows integration');
    console.log('   ✓ Uninstaller included');
    console.log('');
    console.log('📋 Next: Run the installer to test!');
    
    return true;
  } else {
    console.log('❌ Installer file not found');
    console.log('Available files in dist:', files);
    return false;
  }
}

// Main build process
async function buildInstaller() {
  console.log('='.repeat(50));
  console.log('  TIME TRACKING - WINDOWS INSTALLER');
  console.log('='.repeat(50));
  console.log('');

  // Check icon
  checkIcon();
  console.log('');

  // Clean previous installer builds
  cleanDist();
  console.log('');

  // Install dependencies if needed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    if (!runCommand('npm install', 'Installing dependencies')) {
      process.exit(1);
    }
    console.log('');
  }

  // Build installer
  console.log('🔨 Building Windows installer (NSIS)...');
  console.log('   This creates a fast-loading Windows app');
  if (!runCommand('npx electron-builder --win nsis', 'Building installer')) {
    console.log('');
    console.log('💡 If build failed, try:');
    console.log('   npm install electron-builder --save-dev');
    console.log('   npm run build-installer-direct');
    process.exit(1);
  }

  // Show results
  showResults();
}

// Run the build
buildInstaller().catch(error => {
  console.error('\n❌ Build error:', error.message);
  process.exit(1);
});