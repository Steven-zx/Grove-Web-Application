const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key to add sample data
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addSampleData() {
  try {
    console.log('Adding sample announcements...');
    
    const sampleAnnouncements = [
      {
        title: 'Welcome to Grove Community!',
        description: 'Welcome to our beautiful residential community. We hope you enjoy all the amenities we have to offer, including our swimming pool, basketball court, and clubhouse.',
        category: 'General',
        importance: 'Medium'
      },
      {
        title: 'Pool Maintenance Schedule', 
        description: 'The swimming pool will be undergoing routine maintenance every Sunday from 6:00 AM to 8:00 AM. Please plan your swimming activities accordingly.',
        category: 'Maintenance',
        importance: 'High'
      },
      {
        title: 'New Basketball Court Rules',
        description: 'Please note the new rules for the basketball court: Maximum 2 hours per booking, clean up after use, and respect other residents.',
        category: 'Sports', 
        importance: 'Medium'
      },
      {
        title: 'Security Update',
        description: 'New security measures have been implemented. All visitors must now register through the mobile app or at the security gate.',
        category: 'Security',
        importance: 'Urgent'
      }
    ];

    // First, let's check if data already exists
    const { data: existing, error: checkError } = await supabase
      .from('announcements')
      .select('*');
    
    console.log('Existing announcements:', existing?.length || 0);
    
    if (existing && existing.length > 0) {
      console.log('Data already exists, skipping insert');
      return;
    }

    // Insert new data
    const { data, error } = await supabase
      .from('announcements')
      .insert(sampleAnnouncements)
      .select();
    
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Successfully inserted', data?.length || 0, 'announcements');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.error('Script error:', err);
  }
}

addSampleData();