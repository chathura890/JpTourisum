export interface Destination {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  popularTag?: string;
  recommendedDays: number;
}

export interface Attraction {
  id: string;
  destinationId: string;
  name: string;
  category: 'Heritage' | 'Nature & Wildlife' | 'Beach' | 'Scenic' | 'Cultural' | 'Adventure';
  durationHours: number;
  entranceFeeUSD: number;
  image: string;
  description: string;
  mustSee?: boolean;
}

export interface TourVehicle {
  id: string;
  name: string;
  type: string;
  maxPassengers: number;
  maxLuggage: number;
  pricePerDayUSD: number;
  fuelIncluded: boolean;
  image: string;
  description: string;
  features: string[];
}

export interface TourGuideOption {
  type: 'none' | 'chauffeur' | 'licensed_guide';
  title: string;
  pricePerDayUSD: number;
  description: string;
  languagesAvailable: string[];
}

export interface AdditionalService {
  id: string;
  title: string;
  category: 'Safari' | 'Transfer' | 'Activity' | 'Special';
  priceUSD: number;
  perPerson: boolean;
  description: string;
  icon: string;
}

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cultural' | 'Wildlife' | 'Scenic' | 'Romance' | 'All-Rounder';
  badge?: string;
  durationDays: number;
  durationNights: number;
  pricePerPersonUSD: number;
  image: string;
  destinations: string[];
  vehicleType: string;
  guideIncluded: boolean;
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    highlights: string[];
  }[];
}

// ----------------------------------------------------
// DESTINATIONS
// ----------------------------------------------------
export const DESTINATIONS: Destination[] = [
  {
    id: 'galle',
    name: 'Galle & Southern Coast',
    region: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    description: '17th-century UNESCO World Heritage Dutch fort, golden tropical beaches, stilt fishermen, and colonial cafes.',
    popularTag: 'UNESCO Heritage',
    recommendedDays: 2
  },
  {
    id: 'ella',
    name: 'Ella & Highlands',
    region: 'Uva Province',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Nine Arch Bridge, misty mountain peaks, tea hills, cascading waterfalls, and world-famous train routes.',
    popularTag: 'Scenic & Hiking',
    recommendedDays: 2
  },
  {
    id: 'kandy',
    name: 'Kandy & Cultural Capital',
    region: 'Central Province',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    description: 'Sacred Temple of the Tooth Relic, serene royal lake, lush botanical gardens, and traditional cultural arts.',
    popularTag: 'Sacred Culture',
    recommendedDays: 2
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya & Dambulla',
    region: 'Cultural Triangle',
    image: 'https://images.unsplash.com/photo-1582239459520-410a568bba06?auto=format&fit=crop&w=800&q=80',
    description: 'The ancient 5th-century Lion Rock fortress, cave monastery frescoes, and majestic elephant gathering corridors.',
    popularTag: 'World Wonder',
    recommendedDays: 2
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya (Little England)',
    region: 'Central Highlands',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Cool crisp climate, endless emerald Ceylon tea plantations, colonial bungalows, and dramatic World’s End cliff.',
    popularTag: 'Tea Country',
    recommendedDays: 1
  },
  {
    id: 'yala',
    name: 'Yala & Tissamaharama',
    region: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac3ac11c?auto=format&fit=crop&w=800&q=80',
    description: 'World’s highest concentration of leopards, wild elephant herds, sloth bears, and untouched coastal lagoons.',
    popularTag: 'Wildlife Safari',
    recommendedDays: 2
  },
  {
    id: 'mirissa',
    name: 'Mirissa & Weligama',
    region: 'Southern Coast',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Blue whale watching safaris, coconut tree hill sunsets, beginner-friendly surfing bays, and beachside dining.',
    popularTag: 'Whales & Surf',
    recommendedDays: 2
  },
  {
    id: 'colombo',
    name: 'Colombo & Negombo',
    region: 'Western Province',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant modern capital, Galle Face promenade, historic Dutch canal, Lotus Tower, and authentic street food.',
    popularTag: 'City & Transit',
    recommendedDays: 1
  }
];

// ----------------------------------------------------
// ATTRACTIONS (Linked dynamically by destinationId)
// ----------------------------------------------------
export const ATTRACTIONS: Attraction[] = [
  // GALLE ATTRACTIONS (Exactly as requested)
  {
    id: 'galle-fort',
    destinationId: 'galle',
    name: 'Galle Fort',
    category: 'Heritage',
    durationHours: 3,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80',
    description: 'Centuries-old fortified ramparts built by the Portuguese and Dutch overlooking the Indian Ocean.',
    mustSee: true
  },
  {
    id: 'galle-lighthouse',
    destinationId: 'galle',
    name: 'Galle Lighthouse',
    category: 'Heritage',
    durationHours: 1,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic 1939 full white lighthouse standing majestically against tropical palms and crashing waves.',
    mustSee: true
  },
  {
    id: 'dutch-reformed-church',
    destinationId: 'galle',
    name: 'Dutch Reformed Church',
    category: 'Heritage',
    durationHours: 1,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
    description: 'Historic 1755 church with gravestone-paved floors and Dutch colonial colonial architectural grandeur.'
  },
  {
    id: 'maritime-museum',
    destinationId: 'galle',
    name: 'Maritime Archaeology Museum',
    category: 'Cultural',
    durationHours: 1.5,
    entranceFeeUSD: 5,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    description: 'Treasures and shipwreck artifacts recovered from the historic maritime trade route of Galle port.'
  },
  {
    id: 'unawatuna-beach',
    destinationId: 'galle',
    name: 'Unawatuna Beach',
    category: 'Beach',
    durationHours: 3,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Golden horseshoe bay renowned for calm swimming waters, beach cafes, and watersports.',
    mustSee: true
  },
  {
    id: 'jungle-beach',
    destinationId: 'galle',
    name: 'Jungle Beach',
    category: 'Beach',
    durationHours: 2,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Secluded tropical cove flanked by lush forest, perfect for snorkeling amidst colorful reef fish.'
  },
  {
    id: 'peace-pagoda',
    destinationId: 'galle',
    name: 'Japanese Peace Pagoda',
    category: 'Cultural',
    durationHours: 1,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
    description: 'Stunning white stupa built atop Rumassala hill offering panoramic vistas across Galle harbor.'
  },
  {
    id: 'dalawella-beach',
    destinationId: 'galle',
    name: 'Dalawella Beach & Palm Rope Swing',
    category: 'Beach',
    durationHours: 2,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Famous palm tree rope swing, natural protective lagoon pool with wild sea turtles swimming by.'
  },
  {
    id: 'mihiripenna-beach',
    destinationId: 'galle',
    name: 'Mihiripenna Beach',
    category: 'Beach',
    durationHours: 1.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Peaceful coral reef barrier creating calm natural swimming baths and scenic golden sand.'
  },
  {
    id: 'koggala-lake',
    destinationId: 'galle',
    name: 'Koggala Lake & Cinnamon Island',
    category: 'Nature & Wildlife',
    durationHours: 2.5,
    entranceFeeUSD: 15,
    image: 'https://images.unsplash.com/photo-1544256673-db66894c7e6c?auto=format&fit=crop&w=600&q=80',
    description: 'Scenic mangrove boat safari visiting traditional cinnamon peelers, spice groves, and bird havens.'
  },
  {
    id: 'stilt-fishermen',
    destinationId: 'galle',
    name: 'Traditional Stilt Fishermen of Koggala',
    category: 'Cultural',
    durationHours: 1,
    entranceFeeUSD: 10,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80',
    description: 'World-famous crossbar pole fishing spectacle, a unique heritage tradition unique to Sri Lanka.',
    mustSee: true
  },

  // ELLA ATTRACTIONS (Exactly as requested)
  {
    id: 'nine-arch-bridge',
    destinationId: 'ella',
    name: 'Nine Arch Bridge',
    category: 'Scenic',
    durationHours: 2.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80',
    description: 'Magnificent colonial stone viaduct bridge hidden among dense tea fields, where trains pass across the jungle.',
    mustSee: true
  },
  {
    id: 'little-adams-peak',
    destinationId: 'ella',
    name: 'Little Adam’s Peak',
    category: 'Adventure',
    durationHours: 2,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Rewarding gentle mountain trail with breathtaking 360-degree views across Ella Gap and ravines.',
    mustSee: true
  },
  {
    id: 'ella-rock',
    destinationId: 'ella',
    name: 'Ella Rock Trek',
    category: 'Adventure',
    durationHours: 4.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Adventurous morning hike passing railway tracks, rubber woods, and eucalyptus forests to a towering cliff.'
  },
  {
    id: 'ravana-falls',
    destinationId: 'ella',
    name: 'Ravana Falls',
    category: 'Nature & Wildlife',
    durationHours: 1,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    description: 'One of Sri Lanka’s widest cascades, shrouded in the legendary Ramayana epic tales.'
  },
  {
    id: 'demodara-loop',
    destinationId: 'ella',
    name: 'Demodara Railway Loop',
    category: 'Scenic',
    durationHours: 1.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80',
    description: 'Genius early 20th-century spiral rail engineering marvel where the train circles around a hill and passes under itself.'
  },
  {
    id: 'ella-spice-garden',
    destinationId: 'ella',
    name: 'Ella Spice Garden & Cooking Session',
    category: 'Cultural',
    durationHours: 2,
    entranceFeeUSD: 10,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80',
    description: 'Hands-on garden walkthrough learning how cardamom, cloves, and Ceylon vanilla grow, followed by cooking.'
  },

  // KANDY ATTRACTIONS (Exactly as requested)
  {
    id: 'temple-tooth',
    destinationId: 'kandy',
    name: 'Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)',
    category: 'Heritage',
    durationHours: 2.5,
    entranceFeeUSD: 15,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
    description: 'The golden-roofed royal shrine housing the sacred tooth relic of the Buddha, heart of Sri Lankan Buddhism.',
    mustSee: true
  },
  {
    id: 'kandy-lake',
    destinationId: 'kandy',
    name: 'Kandy Lake & Royal Walk',
    category: 'Scenic',
    durationHours: 1.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
    description: 'Picturesque artificial lake created in 1807 by King Sri Wickrama Rajasinghe, perfect for evening strolls.'
  },
  {
    id: 'peradeniya-botanical',
    destinationId: 'kandy',
    name: 'Royal Botanical Gardens, Peradeniya',
    category: 'Nature & Wildlife',
    durationHours: 3,
    entranceFeeUSD: 15,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Renowned 147-acre garden featuring over 4,000 plant species, giant Javan fig tree, and magnificent orchid collection.',
    mustSee: true
  },
  {
    id: 'bahirawakanda-buddha',
    destinationId: 'kandy',
    name: 'Bahirawakanda Giant Buddha Statue',
    category: 'Cultural',
    durationHours: 1,
    entranceFeeUSD: 3,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
    description: 'Colossal 88-foot white Buddha perched on hill overlooking Kandy city with panoramic sunset viewing terrace.'
  },
  {
    id: 'udawatta-kele',
    destinationId: 'kandy',
    name: 'Udawatta Kele Sanctuary',
    category: 'Nature & Wildlife',
    durationHours: 2,
    entranceFeeUSD: 5,
    image: 'https://images.unsplash.com/photo-1544256673-db66894c7e6c?auto=format&fit=crop&w=600&q=80',
    description: 'Historic royal forest ridge sanctuary harboring endemic bird species, wild monkeys, and ancient meditation caves.'
  },

  // SIGIRIYA ATTRACTIONS
  {
    id: 'sigiriya-rock',
    destinationId: 'sigiriya',
    name: 'Sigiriya Lion Rock Fortress',
    category: 'Heritage',
    durationHours: 3.5,
    entranceFeeUSD: 36,
    image: 'https://images.unsplash.com/photo-1582239459520-410a568bba06?auto=format&fit=crop&w=600&q=80',
    description: 'Soaring 200m ancient citadel with 5th-century frescoes, mirror wall, and palace ruins atop a monolith.',
    mustSee: true
  },
  {
    id: 'pidurangala-rock',
    destinationId: 'sigiriya',
    name: 'Pidurangala Rock Sunrise Hike',
    category: 'Adventure',
    durationHours: 2.5,
    entranceFeeUSD: 5,
    image: 'https://images.unsplash.com/photo-1582239459520-410a568bba06?auto=format&fit=crop&w=600&q=80',
    description: 'Thrilling climb offering the absolute best panoramic sunrise view of Sigiriya Rock Fortress directly opposite.',
    mustSee: true
  },
  {
    id: 'dambulla-caves',
    destinationId: 'sigiriya',
    name: 'Dambulla Golden Cave Temple',
    category: 'Heritage',
    durationHours: 2,
    entranceFeeUSD: 10,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
    description: 'UNESCO World Heritage complex of 5 sacred cave sanctuaries filled with 150+ gilded statues and vivid murals.'
  },
  {
    id: 'minneriya-safari',
    destinationId: 'sigiriya',
    name: 'Minneriya National Park (The Elephant Gathering)',
    category: 'Nature & Wildlife',
    durationHours: 4,
    entranceFeeUSD: 40,
    image: 'https://images.unsplash.com/photo-1544605927-4632ce6fdbfa?auto=format&fit=crop&w=600&q=80',
    description: 'Witness up to 300 Asian elephants congregate on grassy tank shores in one of nature’s greatest wildlife spectacles.',
    mustSee: true
  },

  // NUWARA ELIYA ATTRACTIONS
  {
    id: 'pedro-tea-estate',
    destinationId: 'nuwara-eliya',
    name: 'Pedro Tea Estate & Tasting Lounge',
    category: 'Cultural',
    durationHours: 2,
    entranceFeeUSD: 6,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    description: 'Walk through pristine tea plantations, see 19th-century manufacturing machinery, and taste fresh pure Ceylon teas.',
    mustSee: true
  },
  {
    id: 'horton-plains',
    destinationId: 'nuwara-eliya',
    name: 'Horton Plains National Park & World’s End',
    category: 'Adventure',
    durationHours: 4.5,
    entranceFeeUSD: 35,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Misty plateau trek ending at a sheer 880-meter vertical drop cliff, cloud forest, and Baker’s Falls.',
    mustSee: true
  },
  {
    id: 'gregory-lake',
    destinationId: 'nuwara-eliya',
    name: 'Gregory Lake & Park',
    category: 'Scenic',
    durationHours: 2,
    entranceFeeUSD: 3,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    description: 'Charming lake park offering swan boat rides, pony trails, and British-style landscaped gardens.'
  },

  // YALA ATTRACTIONS
  {
    id: 'yala-safari-game-drive',
    destinationId: 'yala',
    name: 'Yala National Park 4x4 Leopard Safari',
    category: 'Nature & Wildlife',
    durationHours: 4.5,
    entranceFeeUSD: 45,
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac3ac11c?auto=format&fit=crop&w=600&q=80',
    description: 'Thrilling open-roof safari through Block 1 & 2 in search of leopards, wild elephants, sloth bears, and crocodiles.',
    mustSee: true
  },
  {
    id: 'bundala-safari',
    destinationId: 'yala',
    name: 'Bundala UNESCO Ramsar Wetland Safari',
    category: 'Nature & Wildlife',
    durationHours: 3.5,
    entranceFeeUSD: 30,
    image: 'https://images.unsplash.com/photo-1629731697334-01047eef090d?auto=format&fit=crop&w=600&q=80',
    description: 'Paradise for bird lovers featuring greater flamingos, pelicans, water monitors, and untouched sand dunes.'
  },
  {
    id: 'kirinda-temple',
    destinationId: 'yala',
    name: 'Kirinda Rock Temple & Beach',
    category: 'Heritage',
    durationHours: 1.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Historic temple high atop a boulder-strewn coastline commemorating Queen Vihara Maha Devi.'
  },

  // MIRISSA ATTRACTIONS
  {
    id: 'whale-watching-mirissa',
    destinationId: 'mirissa',
    name: 'Mirissa Blue Whale & Dolphin Safari',
    category: 'Nature & Wildlife',
    durationHours: 4,
    entranceFeeUSD: 50,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Cruise off the southern shelf to observe the largest animal on earth: magnificent blue whales and acrobatic dolphins.',
    mustSee: true
  },
  {
    id: 'coconut-tree-hill',
    destinationId: 'mirissa',
    name: 'Coconut Tree Hill Sunset Point',
    category: 'Scenic',
    durationHours: 1,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Scenic headland dome with swaying red-dirt coconut palms looking out into the turquoise ocean.',
    mustSee: true
  },

  // COLOMBO ATTRACTIONS
  {
    id: 'gangaramaya-temple',
    destinationId: 'colombo',
    name: 'Gangaramaya Buddhist Temple & Lake Pavilion',
    category: 'Cultural',
    durationHours: 1.5,
    entranceFeeUSD: 4,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    description: 'Eclectic city sanctuary featuring a library, museum of antiques, and the serene Seema Malaka floating temple on Beira Lake.',
    mustSee: true
  },
  {
    id: 'galle-face-green',
    destinationId: 'colombo',
    name: 'Galle Face Green Promenade',
    category: 'Scenic',
    durationHours: 1.5,
    entranceFeeUSD: 0,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    description: 'Open oceanfront promenade beloved for flying kites, sea breezes, and tasting crispy Isso Vadai street snacks.'
  }
];

// ----------------------------------------------------
// VEHICLES
// ----------------------------------------------------
export const TOUR_VEHICLES: TourVehicle[] = [
  {
    id: 'car',
    name: 'Comfort Sedan (Axio / Prius)',
    type: 'Car',
    maxPassengers: 3,
    maxLuggage: 2,
    pricePerDayUSD: 45,
    fuelIncluded: true,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    description: 'Ideal for couples or solo explorers. Smooth hybrid ride, dual A/C, and excellent fuel efficiency.',
    features: ['Dual A/C', 'Chauffeur Included', 'Free Onboard WiFi', 'Fuel Included']
  },
  {
    id: 'kdh-van',
    name: 'Toyota KDH Super Roof Van',
    type: 'Van',
    maxPassengers: 8,
    maxLuggage: 6,
    pricePerDayUSD: 65,
    fuelIncluded: true,
    image: 'https://images.unsplash.com/photo-1542318721-a53d6ebef427?auto=format&fit=crop&w=600&q=80',
    description: 'Our most popular option for families and groups. High-roof spacious seating, huge tinted windows, and reclining seats.',
    features: ['Individual A/C Vents', 'Ample Luggage Bay', 'Reclining Seats', 'Phone Charging Ports']
  },
  {
    id: 'suv-prado',
    name: 'Toyota Land Cruiser / Prado',
    type: 'Luxury SUV',
    maxPassengers: 4,
    maxLuggage: 4,
    pricePerDayUSD: 95,
    fuelIncluded: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    description: 'Premium off-road luxury for high comfort across highland mountain hairpin bends and coastal highways.',
    features: ['Leather Upholstery', '4WD Terrain Control', 'Panoramic Sunroof', 'Chilled Mini Cooler']
  },
  {
    id: 'mini-bus',
    name: 'Toyota Coaster / Rosa Mini-Bus',
    type: 'Bus',
    maxPassengers: 20,
    maxLuggage: 18,
    pricePerDayUSD: 140,
    fuelIncluded: true,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    description: 'Full comfort coach for tour parties, corporate retreats, or multi-family trips across Sri Lanka.',
    features: ['PA Sound System', 'Overhead Luggage Racks', 'High-Capacity A/C', 'Experienced Highway Driver']
  }
];

// ----------------------------------------------------
// TOUR GUIDE OPTIONS
// ----------------------------------------------------
export const TOUR_GUIDE_OPTIONS: TourGuideOption[] = [
  {
    type: 'none',
    title: 'Without Dedicated Guide (Driver Only)',
    pricePerDayUSD: 0,
    description: 'Your courteous private chauffeur will safely navigate, provide road assistance, and share general local tips.',
    languagesAvailable: ['English', 'Sinhala']
  },
  {
    type: 'licensed_guide',
    title: 'With Professional SLTDA Licensed Guide',
    pricePerDayUSD: 35,
    description: 'A certified Sri Lanka Tourism Development Authority (SLTDA) Tourist Guide Lecturer with deep historical, wildlife, and cultural knowledge.',
    languagesAvailable: ['English', 'German', 'French', 'Italian', 'Spanish', 'Russian', 'Chinese', 'Japanese']
  }
];

// ----------------------------------------------------
// ADDITIONAL SERVICES
// ----------------------------------------------------
export const ADDITIONAL_SERVICES: AdditionalService[] = [
  {
    id: 'yala-safari-addon',
    title: 'Yala Half-Day Safari Jeep & Tracker',
    category: 'Safari',
    priceUSD: 65,
    perPerson: false,
    description: 'Exclusive private modified 4x4 safari jeep with experienced wild tracker in Yala National Park.',
    icon: 'fa-paw'
  },
  {
    id: 'airport-pickup',
    title: 'Airport VIP Meet & Greet (BIA Katunayake)',
    category: 'Transfer',
    priceUSD: 25,
    perPerson: false,
    description: 'Personalized arrival pickup with nameboard inside arrival hall, bottled water, and immediate luggage assistance.',
    icon: 'fa-plane-arrival'
  },
  {
    id: 'scenic-train-tickets',
    title: 'Kandy to Ella Scenic Train 1st/2nd Class Tickets',
    category: 'Activity',
    priceUSD: 20,
    perPerson: true,
    description: 'Guaranteed advance seat reservation on the legendary blue hill-country train through tea plantations and viaducts.',
    icon: 'fa-train'
  },
  {
    id: 'madu-river-boat',
    title: 'Madu River / Koggala Lake Eco Boat Safari',
    category: 'Activity',
    priceUSD: 30,
    perPerson: false,
    description: 'Private motorboat tour through mangrove tunnels, fish spa islands, and traditional cinnamon peeling gardens.',
    icon: 'fa-ship'
  },
  {
    id: 'accommodation-assistance',
    title: 'Handpicked Boutique Hotels & Villas Booking',
    category: 'Special',
    priceUSD: 0,
    perPerson: false,
    description: 'We negotiate and secure verified 3-star, 4-star, or luxury 5-star boutique stays at exclusive partner rates.',
    icon: 'fa-hotel'
  }
];

// ----------------------------------------------------
// COMPANY-CREATED PACKAGES (Our Tour Packages)
// ----------------------------------------------------
export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'classic-ceylon-7d',
    title: 'Classic Wonders of Ceylon',
    subtitle: 'Heritage, Tea Country & Wildlife in 7 Unforgettable Days',
    category: 'All-Rounder',
    badge: 'Most Popular',
    durationDays: 7,
    durationNights: 6,
    pricePerPersonUSD: 540,
    image: 'https://images.unsplash.com/photo-1582239459520-410a568bba06?auto=format&fit=crop&w=800&q=80',
    destinations: ['Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle'],
    vehicleType: 'Private A/C Sedan or KDH Van',
    guideIncluded: true,
    inclusions: [
      'Private A/C Vehicle & Dedicated Chauffeur throughout',
      'Daily fuel, highway tolls & driver accommodation',
      'English-speaking licensed Tour Guide Lecturer',
      'Sigiriya Rock Fortress & Dambulla Caves entry',
      'Temple of the Tooth Relic visit in Kandy',
      'Scenic Kandy-to-Ella train ride',
      'Yala National Park 4x4 Jeep Safari with tracker',
      'Galle Fort colonial walking tour'
    ],
    exclusions: [
      'International flights & visa fees',
      'Personal expenses & tipping',
      'Meals not specified in itinerary'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Colombo & Transfer to Sigiriya',
        description: 'Meet & greet at BIA Airport. Scenic drive to the cultural triangle, stopping by Pinnawala and Dambulla Cave Temple.',
        highlights: ['Airport Welcome', 'Dambulla Golden Cave Temple', 'Evening Sunset at Lake']
      },
      {
        day: 2,
        title: 'Climb the Lion Rock Citadel & Village Safari',
        description: 'Early morning ascent of Sigiriya Rock before the sun gets hot. Afternoon traditional ox-cart village tour and catamaran ride.',
        highlights: ['Sigiriya Lion Rock', 'Ancient Frescoes', 'Hiriwadunna Village Lunch']
      },
      {
        day: 3,
        title: 'Kandy Royal Heritage & Temple of the Tooth',
        description: 'Drive to the hill capital of Kandy. Visit Matale spice groves, Kandy Lake, and the revered Temple of the Sacred Tooth Relic.',
        highlights: ['Matale Spice Gardens', 'Temple of the Tooth Relic', 'Kandy Lake Walk']
      },
      {
        day: 4,
        title: 'Tea Plantations of Nuwara Eliya & Scenic Train',
        description: 'Wind through rolling emerald tea estates, visit Ramboda Falls, tour a heritage tea factory, and board the scenic train to Ella.',
        highlights: ['Tea Factory Tasting', 'Ramboda Falls', 'Famous Hill-Country Train Journey']
      },
      {
        day: 5,
        title: 'Ella Peaks, Nine Arch Bridge & Yala Safari',
        description: 'Hike Little Adam’s Peak and walk along Nine Arch Bridge. Descend towards southern plains for an afternoon leopard safari in Yala.',
        highlights: ['Nine Arch Bridge', 'Ravana Falls', 'Yala 4x4 Leopard Game Drive']
      },
      {
        day: 6,
        title: 'Southern Coastal Haven & Historic Galle Fort',
        description: 'Drive along the turquoise southern coastline. Witness Koggala stilt fishermen and explore the cobble streets of Galle Fort.',
        highlights: ['Stilt Fishermen', 'Galle Fort Ramparts & Lighthouse', 'Unawatuna Beach Sunset']
      },
      {
        day: 7,
        title: 'Colombo City Highlights & Airport Departure',
        description: 'Scenic highway return to Colombo. Explore Gangaramaya Temple and Galle Face Green before drop-off at BIA Airport.',
        highlights: ['Gangaramaya Temple', 'Lotus Tower Views', 'Safe Airport Drop-off']
      }
    ]
  },
  {
    id: 'wild-south-5d',
    title: 'Wild Leopards & Southern Coast',
    subtitle: 'Big Cats, Ocean Giants & Sun-Kissed Beaches',
    category: 'Wildlife',
    badge: 'Wildlife Focus',
    durationDays: 5,
    durationNights: 4,
    pricePerPersonUSD: 420,
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac3ac11c?auto=format&fit=crop&w=800&q=80',
    destinations: ['Yala', 'Mirissa', 'Galle', 'Bentota'],
    vehicleType: 'Private A/C Vehicle',
    guideIncluded: false,
    inclusions: [
      'Private vehicle with English-speaking chauffeur',
      'Yala National Park half-day 4x4 safari with park tickets',
      'Mirissa Blue Whale watching boat tour',
      'Madu River mangrove boat safari',
      'Galle Fort exploration',
      'All fuel, tolls & parking'
    ],
    exclusions: [
      'Hotel stays (available upon request)',
      'Meals and drinks',
      'Tips & gratuities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport to Yala National Park Gateway',
        description: 'Comfortable transfer directly to Tissamaharama bordering Yala National Park. Relax by the scenic lake.',
        highlights: ['Expressway Transfer', 'Tissa Wewa Sunset Walk']
      },
      {
        day: 2,
        title: 'Dawn Leopard Safari in Yala & Drive to Mirissa',
        description: 'Early 6:00 AM game drive inside Yala Block 1. Spot leopards, elephants, and crocodiles before heading to Mirissa.',
        highlights: ['Yala Leopard Safari', 'Bird watching', 'Coconut Tree Hill Sunset']
      },
      {
        day: 3,
        title: 'Ocean Safari: Blue Whales & Surfing Bays',
        description: 'Morning boat expedition in search of colossal blue whales and spinner dolphins. Afternoon leisure in Weligama Bay.',
        highlights: ['Blue Whale Watching', 'Secret Beach Relaxing', 'Fresh Seafood Dinner']
      },
      {
        day: 4,
        title: 'Stilt Fishermen & UNESCO Galle Fort',
        description: 'Watch traditional stilt fishermen along the reef. Explore the Dutch ramparts, lighthouse, and artisan shops inside Galle Fort.',
        highlights: ['Stilt Fishermen of Koggala', 'Galle Fort Heritage Tour', 'Unawatuna Beach']
      },
      {
        day: 5,
        title: 'Madu River Mangrove Safari & Departure',
        description: 'Boat through 64 islands of Madu River, visit Cinnamon Island, and return to Colombo or BIA Airport.',
        highlights: ['Madu River Mangroves', 'Fish Therapy', 'Airport Return']
      }
    ]
  },
  {
    id: 'misty-hills-4d',
    title: 'Misty Hills & Tea Trails',
    subtitle: 'Waterfalls, Tea Estates & Mountain Escapes',
    category: 'Scenic',
    badge: 'Best for Nature',
    durationDays: 4,
    durationNights: 3,
    pricePerPersonUSD: 310,
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    destinations: ['Kandy', 'Nuwara Eliya', 'Ella'],
    vehicleType: 'Comfort Hybrid Sedan or Van',
    guideIncluded: true,
    inclusions: [
      'Private transport throughout the central highlands',
      'Kandy Temple of the Tooth & Peradeniya Gardens',
      'Tea factory tour with premium tea tasting',
      'Scenic Kandy to Ella train tickets reserved',
      'Nine Arch Bridge & Little Adam’s Peak trek',
      'Professional English-speaking guide'
    ],
    exclusions: [
      'Personal expenses',
      'Entrance tickets not mentioned in inclusions'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Colombo to Kandy: The Royal Gateway',
        description: 'Drive into the misty hills. Tour Peradeniya Royal Botanical Gardens and witness the evening puja ceremony at Temple of the Tooth.',
        highlights: ['Peradeniya Gardens', 'Temple of the Tooth', 'Kandy Lake']
      },
      {
        day: 2,
        title: 'Nuwara Eliya: Little England & Tea Country',
        description: 'Ascend into the highest tea valleys. Tour a working tea factory, walk through Gregory Lake park, and admire colonial architecture.',
        highlights: ['Tea Factory Tour', 'Ramboda Waterfalls', 'Gregory Lake']
      },
      {
        day: 3,
        title: 'Iconic Train Journey to Ella',
        description: 'Board the world’s most scenic mountain train from Nanu Oya to Ella. Evening walk to Nine Arch Bridge.',
        highlights: ['Scenic Hill Train Ride', 'Nine Arch Bridge', 'Ella Cafe Culture']
      },
      {
        day: 4,
        title: 'Little Adam’s Peak, Ravana Falls & Return',
        description: 'Morning panoramic hike up Little Adam’s Peak. Stop by roaring Ravana Falls before relaxing journey back to Colombo.',
        highlights: ['Little Adam’s Peak Hike', 'Ravana Falls', 'Return Journey']
      }
    ]
  },
  {
    id: 'heritage-triangle-5d',
    title: 'Ancient Kingdoms & Cultural Triangle',
    subtitle: '2,500 Years of Buddhist Architecture & Monoliths',
    category: 'Cultural',
    durationDays: 5,
    durationNights: 4,
    pricePerPersonUSD: 460,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    destinations: ['Anuradhapura', 'Sigiriya', 'Dambulla', 'Kandy'],
    vehicleType: 'Private A/C Sedan or Van',
    guideIncluded: true,
    inclusions: [
      'Comprehensive cultural triangle ticket access',
      'Sigiriya Rock Fortress admission',
      'Dambulla Golden Cave Temple',
      'Temple of the Tooth Relic in Kandy',
      'Dedicated licensed Archaeological Guide Lecturer',
      'Comfort vehicle with unlimited chilled bottled water'
    ],
    exclusions: [
      'Accommodation (can be packaged on request)',
      'Camera fees at sacred sights if applicable'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Colombo to Sigiriya Cultural Triangle',
        description: 'Direct pickup and travel north through lush coconut estates. Afternoon visit to Dambulla Cave Temple.',
        highlights: ['Dambulla Buddha Murals', 'Sunset over Kandalama Lake']
      },
      {
        day: 2,
        title: 'Sigiriya Lion Rock & Pidurangala Viewpoint',
        description: 'Climb the colossal 5th-century citadel of King Kashyapa. Later in the afternoon, hike Pidurangala for epic sunset photos.',
        highlights: ['Lion Rock Summit', 'Water Gardens', 'Pidurangala Panoramic Views']
      },
      {
        day: 3,
        title: 'Ancient Polonnaruwa / Minneriya Elephants',
        description: 'Explore the 11th-century royal capital of Polonnaruwa with stone-carved Gal Vihara Buddhas. Afternoon wild elephant safari.',
        highlights: ['Gal Vihara Carvings', 'Minneriya Wild Elephants', 'Parakrama Samudra']
      },
      {
        day: 4,
        title: 'Matale Spice Route to Royal Kandy',
        description: 'Journey south into Kandy. Explore ancient ayurvedic spice groves and witness the sacred tooth relic procession at dusk.',
        highlights: ['Matale Spice Garden', 'Kandy Lake Walk', 'Sacred Tooth Shrine']
      },
      {
        day: 5,
        title: 'Royal Peradeniya & Return Journey',
        description: 'Stroll under the towering palms of Peradeniya Botanical Gardens. Leisurely return to Colombo or airport.',
        highlights: ['Giant Orchid House', 'Peradeniya Palm Avenues', 'Safe Return']
      }
    ]
  }
];
