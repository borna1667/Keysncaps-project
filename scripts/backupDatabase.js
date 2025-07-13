import { connectDB, disconnectDB } from '../config/database.js';
import fs from 'fs';
import path from 'path';

const backupDatabase = async () => {
  try {
    console.log('💾 Creating database backup...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    const db = (await import('../config/database.js')).getDB();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupData = {
      timestamp,
      database: process.env.MONGODB_DB_NAME || 'keysncaps_development',
      collections: {}
    };
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`📂 Backing up collection: ${collectionName}`);
      
      const data = await db.collection(collectionName).find({}).toArray();
      backupData.collections[collectionName] = data;
      
      console.log(`✅ Backed up ${data.length} documents from ${collectionName}`);
    }
    
    // Write backup file
    const backupFileName = `backup-${timestamp}.json`;
    const backupFilePath = path.join(backupDir, backupFileName);
    
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
    
    console.log('🎉 Database backup completed successfully!');
    console.log(`📁 Backup saved to: ${backupFilePath}`);
    console.log(`📊 Collections backed up: ${Object.keys(backupData.collections).length}`);
    
    // Display summary
    for (const [collectionName, data] of Object.entries(backupData.collections)) {
      console.log(`  - ${collectionName}: ${data.length} documents`);
    }
    
  } catch (error) {
    console.error('❌ Database backup failed:', error);
    throw error;
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

backupDatabase().catch(console.error);
