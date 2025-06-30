const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up SmartLearn database...\n');

  // First, connect to PostgreSQL without specifying a database
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    // Check if database exists
    const dbExistsResult = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'smartlearn_db']
    );

    if (dbExistsResult.rows.length === 0) {
      console.log('📦 Creating database...');
      await adminPool.query(
        `CREATE DATABASE ${process.env.DB_NAME || 'smartlearn_db'}`
      );
      console.log('✅ Database created successfully!');
    } else {
      console.log('✅ Database already exists!');
    }

    await adminPool.end();

    // Now connect to the specific database
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'smartlearn_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    });

    // Read and execute the initialization SQL
    const sqlPath = path.join(__dirname, 'config', 'init-db.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📋 Initializing database schema...');
    await pool.query(sqlContent);
    console.log('✅ Database schema initialized successfully!');

    // Test the connection
    const testResult = await pool.query('SELECT COUNT(*) as user_count FROM users');
    console.log(`📊 Database test successful! Found ${testResult.rows[0].user_count} users.`);

    await pool.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the backend server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure PostgreSQL is running and accessible.');
      console.log('   - Check if PostgreSQL service is started');
      console.log('   - Verify connection details in .env file');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed. Check your database credentials in .env file.');
    }
    
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 