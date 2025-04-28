import { db } from '../server/db';
import { avatars } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedAvatars() {
  console.log('Starting avatar seeding...');
  
  // Clear existing avatars
  console.log('Clearing existing avatars...');
  await db.delete(avatars);
  
  // Define our avatars
  const avatarData = [
    { 
      name: "Purple Hair", 
      imageUrl: "/avatars/avatar1.svg", 
      isDefault: true, 
      streakRequired: 0 
    },
    { 
      name: "Orange Glasses", 
      imageUrl: "/avatars/avatar2.svg", 
      isDefault: true, 
      streakRequired: 0 
    },
    { 
      name: "Robot", 
      imageUrl: "/avatars/avatar3.svg", 
      isDefault: false, 
      streakRequired: 3 
    },
    { 
      name: "Kitty", 
      imageUrl: "/avatars/avatar4.svg", 
      isDefault: false, 
      streakRequired: 7 
    },
    { 
      name: "Alien", 
      imageUrl: "/avatars/avatar5.svg", 
      isDefault: false, 
      streakRequired: 14 
    },
    { 
      name: "Ninja", 
      imageUrl: "/avatars/avatar6.svg", 
      isDefault: false, 
      streakRequired: 21 
    },
    { 
      name: "Royal", 
      imageUrl: "/avatars/avatar7.svg", 
      isDefault: false, 
      streakRequired: 30 
    },
    { 
      name: "Wizard", 
      imageUrl: "/avatars/avatar8.svg", 
      isDefault: false, 
      streakRequired: 60 
    }
  ];
  
  // Insert avatars
  console.log('Inserting avatars...');
  for (const avatar of avatarData) {
    await db.insert(avatars).values(avatar);
  }
  
  // Verify insertions
  const insertedAvatars = await db.select().from(avatars);
  console.log(`Successfully inserted ${insertedAvatars.length} avatars!`);
  
  // List them
  console.log('Inserted avatars:');
  insertedAvatars.forEach(avatar => {
    console.log(`ID: ${avatar.id}, Name: ${avatar.name}, Image: ${avatar.imageUrl}, Default: ${avatar.isDefault}, Streak Required: ${avatar.streakRequired}`);
  });
}

seedAvatars()
  .then(() => {
    console.log('Avatar seeding completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during avatar seeding:', error);
    process.exit(1);
  });