// Import the auth options
const { authOptions } = require('./app/api/auth/[...nextauth]/route');

async function testAuthorize() {
  // Mock credentials
  const credentials = {
    username: 'admin@example.com',
    password: 'admin123@'
  };

  try {
    // Test the authorize function directly
    const result = await authOptions.providers[0].authorize(credentials);
    console.log('Authorize result:', result);
  } catch (error) {
    console.error('Authorize error:', error);
  }
}

testAuthorize();