import mongoose from 'mongoose';

const uri = 'mongodb+srv://quangyeuhang3278_db_user:ncvKudWsMDX2jYw1@cluster0.sti4gp5.mongodb.net/?appName=Cluster0';

async function readSchema() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Default database
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`, collections.map(c => c.name));
    
    for (const collection of collections) {
      const name = collection.name;
      console.log(`\n--- Collection: ${name} ---`);
      const sample = await db.collection(name).findOne({});
      if (sample) {
        console.log(JSON.stringify(sample, null, 2));
      } else {
        console.log('Empty collection');
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected');
  }
}

readSchema();
