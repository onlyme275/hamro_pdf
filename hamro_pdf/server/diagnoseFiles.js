require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { File, UserSignature } = require('./models');

async function diagnoseFiles() {
  console.log('\n📋 Diagnosing Files and Signatures...\n');

  try {
    // Check Files
    console.log('=== FILES ===');
    const files = await File.findAll({});
    console.log(`Total files in database: ${files.length}\n`);

    for (const file of files) {
      const exists = fs.existsSync(file.filePath);
      console.log(`${exists ? '✅' : '❌'} ${file.fileName} (${file.id})`);
      console.log(`   Path: ${file.filePath}`);
      console.log(`   Exists: ${exists}\n`);
    }

    // Check Signatures
    console.log('=== SIGNATURES ===');
    const signatures = await UserSignature.findAll({});
    console.log(`Total signatures in database: ${signatures.length}\n`);

    for (const sig of signatures) {
      const exists = fs.existsSync(sig.filePath);
      console.log(`${exists ? '✅' : '❌'} Signature ${sig.id}`);
      console.log(`   Path: ${sig.filePath}`);
      console.log(`   Exists: ${exists}\n`);
    }

    // Check directories
    console.log('=== DIRECTORIES ===');
    const uploadDir = path.join(__dirname, 'uploads');
    const filesDir = path.join(uploadDir, 'user-files');
    const signaturesDir = path.join(uploadDir, 'user-signatures');

    console.log(`Upload dir exists: ${fs.existsSync(uploadDir) ? '✅' : '❌'}`);
    console.log(`Files dir exists: ${fs.existsSync(filesDir) ? '✅' : '❌'}`);
    console.log(`Signatures dir exists: ${fs.existsSync(signaturesDir) ? '✅' : '❌'}\n`);

    if (fs.existsSync(filesDir)) {
      const filesOnDisk = fs.readdirSync(filesDir);
      console.log(`Files on disk: ${filesOnDisk.length}`);
      filesOnDisk.slice(0, 10).forEach(f => console.log(`  - ${f}`));
      if (filesOnDisk.length > 10) console.log(`  ... and ${filesOnDisk.length - 10} more`);
    }

    if (fs.existsSync(signaturesDir)) {
      const sigsOnDisk = fs.readdirSync(signaturesDir);
      console.log(`\nSignatures on disk: ${sigsOnDisk.length}`);
      sigsOnDisk.forEach(f => console.log(`  - ${f}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

diagnoseFiles();
