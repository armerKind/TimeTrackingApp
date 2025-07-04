// build-scripts/build-portable.js - Updated Portable Build Script

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building portable Time Tracking app...');
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

// Function to check if required files exist
function checkRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'main.js',
    'preload.js',
    'src/index.html',
    'src/renderer.js',
    'src/styles.css'
  ];

  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => {
      console.error(`   - ${file}`);
    });
    console.error('');
    console.error('Please make sure all required files are in place before building.');
    return false;
  }

  console.log('✅ All required files found');
  return true;
}

// Function to create assets folder if it doesn't exist
function ensureAssetsFolder() {
  const assetsPath = path.join(process.cwd(), 'assets');
  
  if (!fs.existsSync(assetsPath)) {
    console.log('📁 Creating assets folder...');
    fs.mkdirSync(assetsPath, { recursive: true });
  }
  
  const iconPath = path.join(assetsPath, 'icon.ico');
  if (!fs.existsSync(iconPath)) {
    console.log('⚠️  No icon.ico found in assets folder');
    console.log('   Add icon.ico (256x256) for custom icon');
  } else {
    console.log('✅ Found icon.ico');
  }
  
  return true;
}

// Function to check Node.js and npm versions
function checkEnvironment() {
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    
    console.log(`📋 Environment check:`);
    console.log(`   Node.js: ${nodeVersion}`);
    console.log(`   npm: ${npmVersion}`);
    
    return true;
  } catch (error) {
    console.error('❌ Node.js or npm not found. Please install Node.js from https://nodejs.org');
    return false;
  }
}

// Function to clean previous portable builds
function cleanPreviousBuilds() {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (fs.existsSync(distPath)) {
    console.log('🧹 Cleaning previous portable builds...');
    try {
      const files = fs.readdirSync(distPath);
      files.forEach(file => {
        if (file.includes('Portable') && file.endsWith('.exe')) {
          const filePath = path.join(distPath, file);
          fs.unlinkSync(filePath);
          console.log(`   Removed: ${file}`);
        }
      });
      console.log('✅ Previous portable builds cleaned');
    } catch (error) {
      console.log('⚠️  Could not clean previous builds:', error.message);
    }
  }
  
  return true;
}

// Main build process
async function buildApp() {
  console.log('='.repeat(50));
  console.log('  TIME TRACKING APP - PORTABLE BUILD');
  console.log('='.repeat(50));
  console.log('');

  // Step 1: Environment check
  if (!checkEnvironment()) {
    process.exit(1);
  }
  console.log('');

  // Step 2: Check required files
  if (!checkRequiredFiles()) {
    process.exit(1);
  }
  console.log('');

  // Step 3: Ensure assets folder exists
  ensureAssetsFolder();
  console.log('');

  // Step 4: Clean previous builds
  cleanPreviousBuilds();
  console.log('');

  // Step 5: Install dependencies
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    if (!runCommand('npm install', 'Installing dependencies')) {
      console.log('');
      console.log('💡 Try running these commands manually:');
      console.log('   npm cache clean --force');
      console.log('   rm -rf node_modules package-lock.json');
      console.log('   npm install');
      process.exit(1);
    }
    console.log('');
  }

  // Step 6: Test the app (optional)
  console.log('🧪 Testing app compilation...');
  try {
    // Just check if main files can be loaded without syntax errors
    require(path.join(process.cwd(), 'main.js'));
    console.log('✅ App files loaded successfully');
  } catch (error) {
    console.log('⚠️  Warning: App test failed:', error.message);
    console.log('   Continuing with build...');
  }
  console.log('');

  // Step 7: Build the portable executable
  console.log('🔨 Building portable executable...');
  console.log('   Note: Portable apps have slower startup due to extraction');
  if (!runCommand('npx electron-builder --win portable --publish never', 'Building portable app')) {
    console.log('');
    console.log('💡 Build failed. Try these troubleshooting steps:');
    console.log('   1. Make sure you\'re on Windows or have Windows build tools installed');
    console.log('   2. Check that package.json has correct electron-builder configuration');
    console.log('   3. Try: npm install electron-builder --save-dev');
    console.log('   4. Try: npx electron-builder install-app-deps');
    process.exit(1);
  }
  console.log('');

  // Step 8: Check if build was successful
  const exePath = path.join(process.cwd(), 'dist', 'TimeTracking-Portable.exe');
  if (fs.existsSync(exePath)) {
    const stats = fs.statSync(exePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('🎉 PORTABLE BUILD SUCCESSFUL!');
    console.log('');
    console.log('📄 Build Summary:');
    console.log(`   File: TimeTracking-Portable.exe`);
    console.log(`   Size: ${fileSizeMB} MB`);
    console.log(`   Location: ${path.relative(process.cwd(), exePath)}`);
    console.log('');
    console.log('✅ Your portable time tracking app is ready!');
    console.log('');
    console.log('📋 Portable App Features:');
    console.log('   ✓ No installation required');
    console.log('   ✓ Can run from USB drive');
    console.log('   ✓ Leaves no registry entries');
    console.log('   ✓ Self-contained executable');
    console.log('   ⚠️  Slower startup (15-30s first run)');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Test the .exe file by double-clicking it');
    console.log('   2. The app will create a database in %APPDATA%/timetracking-app/');
    console.log('   3. Global shortcuts Ctrl+1-9 should work when app is running');
    console.log('   4. Distribute the .exe file - no installation required!');
    console.log('');
    console.log('💡 For faster startup, consider using the installer version:');
    console.log('   npm run build-win');
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   - If Windows Defender flags it: Add exception or submit for analysis');
    console.log('   - If shortcuts don\'t work: Check no other app uses same shortcuts');
    console.log('   - For issues: Check the console when running the .exe');
    
  } else {
    console.log('❌ Build completed but executable not found!');
    console.log('   Expected location:', exePath);
    console.log('   Check the dist/ folder for other build outputs.');
    process.exit(1);
  }
}

// Handle process interruption
process.on('SIGINT', () => {
  console.log('\n⚠️  Build interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Build terminated');
  process.exit(1);
});

// Run the build
buildApp().catch(error => {
  console.error('\n❌ Unexpected error during build:', error);
  process.exit(1);
});