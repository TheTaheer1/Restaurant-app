export const MENU_ITEMS = [
  { id: 1,  name: 'Raan-e-Sikandari',   category: 'Chef\'s Special',  description: 'Slow-roasted whole leg of lamb marinated 48 hours in yoghurt, saffron & royal spices.',  price: 1650, emoji: '🍖', spice: 2, isVeg: false, isPopular: true },
  { id: 2,  name: 'Dal Makhani',         category: 'Village Classic',  description: 'Black lentils slow-cooked overnight in a wood-fired pot with hand-churned cream and ghee.', price: 480,  emoji: '🫕', spice: 1, isVeg: true,  isPopular: true },
  { id: 3,  name: 'Seekh Kebab Platter', category: 'From the Tandoor', description: 'Minced lamb with fresh herbs, charred over live charcoal and served with mint chutney.',    price: 720,  emoji: '🔥', spice: 3, isVeg: false, isPopular: true },
  { id: 4,  name: 'Paneer Tikka',        category: 'Starters', description: 'Marinated cottage cheese cubes grilled in a tandoor, served with coriander chutney.', price: 420, emoji: '🧀', spice: 2, isVeg: true,  isPopular: false },
  { id: 5,  name: 'Butter Chicken',      category: 'Mains',    description: 'Tender chicken in a rich, creamy tomato-butter sauce. Our most-loved dish.',        price: 560,  emoji: '🍗', spice: 1, isVeg: false, isPopular: false },
  { id: 6,  name: 'Palak Paneer',        category: 'Mains',    description: 'Cottage cheese in a spiced spinach gravy, finished with a touch of cream.',         price: 380,  emoji: '🥬', spice: 1, isVeg: true,  isPopular: false },
  { id: 7,  name: 'Gulab Jamun',         category: 'Desserts', description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup.',                   price: 180,  emoji: '🍮', spice: 0, isVeg: true,  isPopular: false },
  { id: 8,  name: 'Kulfi Falooda',       category: 'Desserts', description: 'Traditional Indian ice cream with rose syrup, basil seeds, and vermicelli.',        price: 220,  emoji: '🍦', spice: 0, isVeg: true,  isPopular: false },
  { id: 9,  name: 'Masala Chai',         category: 'Drinks',   description: 'Freshly brewed spiced tea with cardamom, ginger, cinnamon, and frothed milk.',      price: 120,  emoji: '☕', spice: 1, isVeg: true,  isPopular: false },
  { id: 10, name: 'Mango Lassi',         category: 'Drinks',   description: 'Chilled yoghurt blended with fresh Alphonso mangoes and a hint of cardamom.',       price: 160,  emoji: '🥭', spice: 0, isVeg: true,  isPopular: false },
  { id: 11, name: 'Garlic Naan',         category: 'Breads',   description: 'Pillowy leavened bread with roasted garlic and butter, baked in the tandoor.',      price: 80,   emoji: '🫓', spice: 0, isVeg: true,  isPopular: false },
  { id: 12, name: 'Laccha Paratha',      category: 'Breads',   description: 'Multi-layered flaky whole-wheat flatbread with a crisp exterior.',                  price: 70,   emoji: '🫓', spice: 0, isVeg: true,  isPopular: false },
];

export const REVIEWS = [
  { 
    id: 1, 
    name: 'Priya M.', 
    location: 'Bengaluru', 
    rating: 5, 
    text: "The Raan-e-Sikandari was unlike anything I've tasted. Fell right off the bone. The whole ambiance takes you back in time.", 
    date: '2 weeks ago',
    avatar: 'P'
  },
  { 
    id: 2, 
    name: 'Arjun & Kavitha', 
    location: 'Chennai', 
    rating: 5, 
    text: "We celebrated our anniversary here and it was magical. The private room, the attentive service, the food — perfection.", 
    date: '1 month ago',
    avatar: 'AK'
  },
  { 
    id: 3, 
    name: 'Rahul S.', 
    location: 'Mumbai', 
    rating: 5, 
    text: "Best dal makhani in the city. No contest. I've been coming every month for two years and it never disappoints.", 
    date: '3 months ago',
    avatar: 'R'
  }
];
