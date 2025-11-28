import { User, Pet, Booking, Message, UserRole, BookingStatus, Review } from '../types';

// Seed Data
const MOCK_USERS: User[] = [
  {
    id: 'owner1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: UserRole.OWNER,
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    location: 'San Francisco, CA'
  },
  {
    id: 'lover1',
    name: 'Mike Ross',
    email: 'mike@example.com',
    role: UserRole.LOVER,
    avatarUrl: 'https://i.pravatar.cc/150?u=mike',
    location: 'San Francisco, CA'
  },
  {
    id: 'owner2',
    name: 'David Kim',
    email: 'david@example.com',
    role: UserRole.OWNER,
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    location: 'San Mateo, CA'
  },
  {
    id: 'lover2',
    name: 'Emily Chen',
    email: 'emily@example.com',
    role: UserRole.LOVER,
    avatarUrl: 'https://i.pravatar.cc/150?u=emily',
    location: 'Oakland, CA'
  },
  {
    id: 'owner3',
    name: 'Jessica Wong',
    email: 'jessica@example.com',
    role: UserRole.OWNER,
    avatarUrl: 'https://i.pravatar.cc/150?u=jessica',
    location: 'Berkeley, CA'
  },
  {
    id: 'lover3',
    name: 'Tom Holland',
    email: 'tom@example.com',
    role: UserRole.LOVER,
    avatarUrl: 'https://i.pravatar.cc/150?u=tom',
    location: 'Daly City, CA'
  }
];

const MOCK_PETS: Pet[] = [
  {
    id: 'pet1',
    ownerId: 'owner1',
    name: 'Bella',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    description: 'Friendly, loves balls, hates the vacuum. Very good with kids.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's1', title: 'Feeding', instruction: '2 cups of kibble at 8am and 6pm.' },
      { id: 's2', title: 'Walks', instruction: 'Needs 30 mins walk twice a day.' }
    ]
  },
  {
    id: 'pet2',
    ownerId: 'owner1',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 5,
    description: 'Vocal, independent, loves high places. Will tap you for food.',
    imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's3', title: 'Litter', instruction: 'Scoop daily.' }
    ]
  },
  {
    id: 'pet3',
    ownerId: 'owner2',
    name: 'Rocky',
    species: 'Dog',
    breed: 'French Bulldog',
    age: 2,
    description: 'Lazy but lovable. Snorting is normal. Do not over-exercise.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's4', title: 'Temperature', instruction: 'Keep him cool, he overheats easily.' }
    ]
  },
  {
    id: 'pet4',
    ownerId: 'owner2',
    name: 'Coco',
    species: 'Bird',
    breed: 'Cockatiel',
    age: 1,
    description: 'Sings the Addams Family theme song. Loves seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's5', title: 'Cage', instruction: 'Cover cage at 8pm sharp.' }
    ]
  },
  {
    id: 'pet5',
    ownerId: 'owner1',
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 4,
    description: 'Very protective but gentle with family. Loves frisbee.',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's6', title: 'Exercise', instruction: 'Needs lots of running.'}
    ]
  },
  {
    id: 'pet6',
    ownerId: 'owner3',
    name: 'Thumper',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: 1,
    description: 'Loves cilantro. Hops everywhere. Watch your cables!',
    imageUrl: 'https://images.unsplash.com/photo-1585110396065-ec326e297097?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's7', title: 'Diet', instruction: 'Unlimited hay. 1/4 cup pellets.' },
      { id: 's8', title: 'Handling', instruction: 'Support the bum when holding.' }
    ]
  },
  {
    id: 'pet7',
    ownerId: 'owner3',
    name: 'Shadow',
    species: 'Cat',
    breed: 'Bombay',
    age: 4,
    description: 'A void that stares back. Very cuddly though.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's9', title: 'Toys', instruction: 'Laser pointer is life.' }
    ]
  },
  {
    id: 'pet8',
    ownerId: 'owner2',
    name: 'Cooper',
    species: 'Dog',
    breed: 'Australian Shepherd',
    age: 2,
    description: 'High energy! Needs a job to do or he gets bored.',
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9205?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's10', title: 'Activity', instruction: 'At least 1 hour of fetch.' }
    ]
  },
  {
    id: 'pet9',
    ownerId: 'owner3',
    name: 'Nemo',
    species: 'Fish',
    breed: 'Clownfish',
    age: 1,
    description: 'Just keep swimming. Lives in a saltwater tank.',
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's11', title: 'Feeding', instruction: 'Tiny pinch of flakes once a day.' }
    ]
  },
  {
    id: 'pet10',
    ownerId: 'owner1',
    name: 'Daisy',
    species: 'Dog',
    breed: 'Beagle',
    age: 6,
    description: 'Driven by her nose. Will eat anything she finds.',
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    sops: [
      { id: 's12', title: 'Leash', instruction: 'Never off-leash outside fenced area.' }
    ]
  }
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    petId: 'pet1',
    ownerId: 'owner1',
    loverId: 'lover1',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    status: BookingStatus.PENDING,
    totalPrice: 150
  },
  {
    id: 'b2',
    petId: 'pet3',
    ownerId: 'owner2',
    loverId: 'lover1',
    startDate: '2023-10-01',
    endDate: '2023-10-03',
    status: BookingStatus.COMPLETED,
    totalPrice: 200
  },
  {
    id: 'b3',
    petId: 'pet2',
    ownerId: 'owner1',
    loverId: 'lover2',
    startDate: '2023-12-05',
    endDate: '2023-12-06',
    status: BookingStatus.ACCEPTED,
    totalPrice: 80
  },
  {
    id: 'b4',
    petId: 'pet6',
    ownerId: 'owner3',
    loverId: 'lover3',
    startDate: '2023-11-20',
    endDate: '2023-11-22',
    status: BookingStatus.PENDING,
    totalPrice: 100
  }
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', bookingId: 'b1', senderId: 'lover1', text: 'Hi! Is Bella good with other dogs?', timestamp: 1698750000000 },
  { id: 'm2', bookingId: 'b1', senderId: 'owner1', text: 'Yes, she loves them!', timestamp: 1698750500000 },
  { id: 'm3', bookingId: 'b2', senderId: 'lover1', text: 'Rocky was a joy to sit!', timestamp: 1696320000000 },
  { id: 'm4', bookingId: 'b2', senderId: 'owner2', text: 'Thanks Mike! He misses you already.', timestamp: 1696325000000 },
  { id: 'm5', bookingId: 'b4', senderId: 'lover3', text: 'Does Thumper chew on furniture?', timestamp: 1700438400000 },
  { id: 'm6', bookingId: 'b4', senderId: 'owner3', text: 'Sometimes baseboards. Keep an eye on him.', timestamp: 1700442000000 }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    bookingId: 'b2',
    reviewerId: 'owner2',
    targetId: 'lover1',
    rating: 5,
    comment: 'Mike was fantastic with Rocky. He sent daily updates and followed all instructions.',
    createdAt: '2023-10-04'
  },
  {
    id: 'r2',
    bookingId: 'b2',
    reviewerId: 'lover1',
    targetId: 'owner2',
    rating: 4,
    comment: 'Great owner, clear instructions. Rocky is a bit stubborn on walks though.',
    createdAt: '2023-10-04'
  }
];

class MockStore {
  private load<T>(key: string, seed: T): T {
    const stored = localStorage.getItem(`pawpal_${key}`);
    if (!stored) {
      localStorage.setItem(`pawpal_${key}`, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(stored);
  }

  private save(key: string, data: any) {
    localStorage.setItem(`pawpal_${key}`, JSON.stringify(data));
  }

  // --- Auth ---
  login(email: string): User | null {
    const users = this.load<User[]>('users', MOCK_USERS);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  register(user: User): boolean {
      const users = this.load<User[]>('users', MOCK_USERS);
      if (users.find(u => u.email === user.email)) {
          return false; // User exists
      }
      users.push(user);
      this.save('users', users);
      return true;
  }
  
  getUser(id: string): User | undefined {
    return this.load<User[]>('users', MOCK_USERS).find(u => u.id === id);
  }

  // --- Pets ---
  getPets(): Pet[] {
    return this.load<Pet[]>('pets', MOCK_PETS);
  }

  getPetsByOwner(ownerId: string): Pet[] {
    return this.getPets().filter(p => p.ownerId === ownerId);
  }

  getPetById(id: string): Pet | undefined {
    return this.getPets().find(p => p.id === id);
  }

  addPet(pet: Pet) {
    const pets = this.getPets();
    pets.push(pet);
    this.save('pets', pets);
  }

  updatePet(pet: Pet) {
    const pets = this.getPets();
    const index = pets.findIndex(p => p.id === pet.id);
    if (index !== -1) {
      pets[index] = pet;
      this.save('pets', pets);
    }
  }

  deletePet(id: string) {
    let pets = this.getPets();
    pets = pets.filter(p => p.id !== id);
    this.save('pets', pets);
  }

  // --- Bookings ---
  getBookings(): Booking[] {
    return this.load<Booking[]>('bookings', MOCK_BOOKINGS);
  }

  getBookingsForUser(userId: string, role: UserRole): Booking[] {
    const bookings = this.getBookings();
    return bookings.filter(b => role === UserRole.OWNER ? b.ownerId === userId : b.loverId === userId);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  createBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.save('bookings', bookings);
  }

  updateBookingStatus(bookingId: string, status: BookingStatus) {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx].status = status;
      this.save('bookings', bookings);
    }
  }

  // --- Messages ---
  getMessages(bookingId: string): Message[] {
    const allMsgs = this.load<Message[]>('messages', MOCK_MESSAGES);
    return allMsgs.filter(m => m.bookingId === bookingId).sort((a, b) => a.timestamp - b.timestamp);
  }

  getLastMessage(bookingId: string): Message | undefined {
    const msgs = this.getMessages(bookingId);
    return msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
  }

  sendMessage(msg: Message) {
    const msgs = this.load<Message[]>('messages', MOCK_MESSAGES);
    msgs.push(msg);
    this.save('messages', msgs);
  }

  // --- Reviews ---
  getReviews(targetId: string): Review[] {
    const reviews = this.load<Review[]>('reviews', MOCK_REVIEWS);
    return reviews.filter(r => r.targetId === targetId);
  }

  addReview(review: Review) {
    const reviews = this.load<Review[]>('reviews', MOCK_REVIEWS);
    reviews.push(review);
    this.save('reviews', reviews);
  }
}

export const db = new MockStore();