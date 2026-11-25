// Josh's Fuel — recipe, plan and shopping data.
// Macros are per serving (grams). Calories are worked out from macros (4/4/9).
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const RECIPES = [
  {
    id: "pb-oats", name: "Peanut Butter Banana Oats", cats: ["breakfast"], prep: false,
    time: 8, p: 40, c: 104, f: 21, emoji: "🥜", img: U("photo-1517673132405-a56a62b18caf"),
    ing: ["80g porridge oats", "300ml semi-skimmed milk", "1 banana, sliced", "20g peanut butter", "150g 0% Greek-style yoghurt"],
    steps: ["Add oats and milk to a pan on medium heat.", "Stir for 4–5 minutes until thick and creamy.", "Take off the heat and stir in the yoghurt.", "Top with sliced banana and a swirl of peanut butter."],
    batch: "Weigh 80g oats into 5 bags or tubs on Sunday so it's grab-and-go every morning."
  },
  {
    id: "overnight-oats", name: "Protein Overnight Oats", cats: ["breakfast"], prep: true,
    time: 5, p: 33, c: 87, f: 9, emoji: "🫐", img: U("photo-1490645935967-10de6ba17061"),
    ing: ["70g porridge oats", "200ml semi-skimmed milk", "170g 0% Greek-style yoghurt", "80g frozen mixed berries", "1 tbsp honey"],
    steps: ["Mix oats, milk, yoghurt and honey in a jar or tub.", "Drop the frozen berries on top (they defrost overnight).", "Lid on, fridge overnight.", "Eat cold, or microwave for 2 minutes if you want it warm."],
    batch: "Make 3 jars on Sunday night. They keep 3 days in the fridge, so make the rest midweek."
  },
  {
    id: "scrambled", name: "Cheesy Scrambled Eggs on Toast", cats: ["breakfast"], prep: false,
    time: 10, p: 41, c: 35, f: 33, emoji: "🍳", img: U("photo-1525351484163-7529414344d8"),
    ing: ["4 eggs", "50ml milk", "30g cheddar, grated", "2 slices wholemeal bread", "Salt and pepper"],
    steps: ["Whisk eggs, milk, salt and pepper.", "Put the toast on.", "Cook eggs in a non-stick pan on low, stirring slowly, for 3–4 minutes.", "Take off the heat while still a bit wet, stir in cheese, pile on toast."],
    batch: "Best fresh — it's a 10-minute weekend breakfast."
  },
  {
    id: "yog-bowl", name: "Greek Yoghurt Power Bowl", cats: ["breakfast", "snack"], prep: false,
    time: 3, p: 30, c: 75, f: 6, emoji: "🍯", img: U("photo-1488477181946-6428a0291777"),
    ing: ["250g 0% Greek-style yoghurt", "40g granola", "1 banana, sliced", "1 tbsp honey"],
    steps: ["Spoon the yoghurt into a bowl.", "Top with banana and granola.", "Drizzle with honey."],
    batch: "Keep granola in a sealed tub so it stays crunchy. Pack the yoghurt in a tub for work and add toppings just before eating."
  },
  {
    id: "burrito-bowl", name: "Chicken Burrito Bowl", cats: ["lunch", "dinner"], prep: true,
    time: 30, p: 58, c: 88, f: 15, emoji: "🌯", img: U("photo-1546069901-ba9599a7e63c"),
    ing: ["150g chicken breast", "75g rice (dry weight)", "100g kidney beans, drained", "80g sweetcorn", "2 tbsp tomato salsa", "30g cheddar, grated", "1 tsp smoked paprika + 1 tsp cumin"],
    steps: ["Cook the rice.", "Rub chicken with paprika, cumin, salt and pepper. Bake at 200°C (180°C fan) for 22–25 minutes until cooked through.", "Slice the chicken.", "Build the bowl: rice, chicken, beans, sweetcorn.", "Add salsa and cheese just before eating."],
    batch: "Make 3 on Sunday. Keep salsa and cheese separate so the bowl doesn't go soggy."
  },
  {
    id: "fajita-wraps", name: "Chicken Fajita Wraps", cats: ["lunch", "dinner"], prep: false,
    time: 20, p: 60, c: 72, f: 26, emoji: "🫓", img: U("photo-1565299585323-38d6b0865b47"),
    ing: ["150g chicken breast, sliced into strips", "2 large tortilla wraps", "1 pepper + ½ onion, sliced", "1 tsp oil", "½ sachet fajita seasoning", "50g 0% Greek-style yoghurt", "30g cheddar, grated"],
    steps: ["Heat oil in a pan on high.", "Fry chicken for 5 minutes until browned.", "Add peppers, onion and seasoning, then cook 5 more minutes until the chicken is cooked through.", "Warm the wraps, fill, and top with yoghurt and cheese."],
    batch: "Cook a double batch of filling. It keeps 2 days in the fridge, so warm it up and wrap it fresh."
  },
  {
    id: "tuna-bake", name: "Tuna Pasta Bake", cats: ["lunch", "dinner"], prep: true,
    time: 30, p: 55, c: 94, f: 18, emoji: "🐟", img: U("photo-1621996346565-e3dbc646d9a9"),
    ing: ["100g pasta (dry weight)", "1 tin tuna, drained", "200g passata", "80g sweetcorn", "40g cheddar, grated", "1 tsp mixed herbs"],
    steps: ["Boil pasta for 2 minutes less than the packet says, then drain.", "Mix with tuna, passata, sweetcorn and herbs.", "Tip into an ovenproof dish and top with cheese.", "Bake at 200°C (180°C fan) for 15 minutes until bubbling."],
    batch: "Make a 3-portion tray and cut it into slabs. It freezes really well."
  },
  {
    id: "fried-rice", name: "Egg Fried Rice with Chicken", cats: ["lunch", "dinner"], prep: true,
    time: 20, p: 51, c: 69, f: 27, emoji: "🍚", img: U("photo-1603133872878-684f208fb84b"),
    ing: ["75g rice (dry weight), cooked and cooled", "120g cooked chicken, chopped", "2 eggs", "100g frozen mixed veg", "1 tbsp soy sauce", "1 tbsp oil", "1 garlic clove"],
    steps: ["Heat oil in a wok or big pan on high.", "Fry garlic and frozen veg for 3 minutes.", "Push to the side, crack in eggs and scramble.", "Add cold rice and chicken, then stir-fry 4–5 minutes until everything is steaming hot.", "Splash in soy sauce."],
    batch: "Day-old rice fries best, but cool it quickly. Cooked rice keeps only 1 day in the fridge, so freeze any portions for later in the week."
  },
  {
    id: "jacket-tuna", name: "Tuna Sweetcorn Jacket Potato", cats: ["lunch"], prep: false,
    time: 12, p: 36, c: 71, f: 10, emoji: "🥔", img: U("photo-1518977676601-b53f82aba655"),
    ing: ["1 large potato (~300g)", "1 tin tuna, drained", "30g light mayo", "60g sweetcorn", "Cucumber, to serve"],
    steps: ["Prick the potato and microwave for 8–10 minutes, turning halfway, until soft.", "Mix tuna, mayo and sweetcorn.", "Split the potato and load it up.", "Serve with sliced cucumber."],
    batch: "Mix the tuna filling for 2 days at once and keep it in the fridge."
  },
  {
    id: "chilli", name: "Beef Chilli Con Carne & Rice", cats: ["dinner", "lunch"], prep: true,
    time: 40, p: 48, c: 97, f: 17, emoji: "🌶️", img: U("photo-1455619452474-d2be8b1e70cd"),
    ing: ["125g 5% fat beef mince", "100g kidney beans, drained", "200g chopped tomatoes", "½ onion, diced", "1 garlic clove", "1 tsp chilli powder + 1 tsp cumin", "90g rice (dry weight)", "30g cheddar, to top"],
    steps: ["Brown the mince with onion and garlic for 5–6 minutes.", "Add spices and stir for 1 minute.", "Add tomatoes and beans, then simmer for 20–25 minutes until thick.", "Serve on rice and top with cheese."],
    batch: "Chilli gets better the next day. Make 2+ portions and freeze them in single tubs."
  },
  {
    id: "bolognese", name: "Mince Bolognese", cats: ["dinner"], prep: true,
    time: 35, p: 46, c: 94, f: 15, emoji: "🍝", img: U("photo-1563379926898-05f4575a45d8"),
    ing: ["125g 5% fat beef mince", "100g spaghetti (dry weight)", "250g passata", "½ onion + 1 carrot, finely diced", "1 garlic clove", "½ beef stock cube", "20g cheddar, to top"],
    steps: ["Brown the mince with onion, carrot and garlic for 6 minutes.", "Add passata and crumble in the stock cube.", "Simmer for 20 minutes.", "Cook spaghetti, then serve the sauce on top with cheese."],
    batch: "Batch the sauce and freeze it. Cook the spaghetti fresh on the day (10 minutes) so it isn't mushy."
  },
  {
    id: "traybake", name: "Chicken & Potato Traybake", cats: ["dinner"], prep: false,
    time: 45, p: 51, c: 68, f: 18, emoji: "🍗", img: U("photo-1598515214211-89d3c73ae83b"),
    ing: ["180g chicken breast", "300g potatoes, chopped into chunks", "1 pepper, ½ onion + 2 carrots, chopped", "1 tbsp oil", "1 tsp garlic granules + 1 tsp paprika"],
    steps: ["Heat the oven to 200°C (180°C fan).", "Toss potatoes in half the oil and roast for 15 minutes.", "Add chicken, the chopped veg, the rest of the oil and the spices.", "Roast 25 more minutes until the chicken is cooked through and the potatoes are golden."],
    batch: "Double it on one tray. The second portion makes tomorrow's lunch."
  },
  {
    id: "curry", name: "Easy Chicken Curry & Rice", cats: ["dinner"], prep: true,
    time: 30, p: 58, c: 81, f: 12, emoji: "🍛", img: U("photo-1565557623262-b51c2513a641"),
    ing: ["150g chicken breast, diced", "1 tbsp curry paste", "200g chopped tomatoes", "100g 0% Greek-style yoghurt", "100g frozen peas", "75g rice (dry weight)", "1 tsp oil"],
    steps: ["Fry chicken in the oil for 4 minutes.", "Stir in curry paste for 1 minute.", "Add tomatoes and peas, then simmer for 15 minutes until the chicken is cooked through.", "Take off the heat and stir in the yoghurt. Serve with rice."],
    batch: "Freezes perfectly. Stir the yoghurt in after reheating, not before."
  },
  {
    id: "beef-noodles", name: "Beef & Broccoli Noodles", cats: ["dinner", "lunch"], prep: true,
    time: 20, p: 48, c: 95, f: 10, emoji: "🍜", img: U("photo-1585032226651-759b368d7246"),
    ing: ["150g 5% fat beef mince", "100g egg noodles (dry weight)", "150g frozen broccoli", "1 tbsp soy sauce", "1 tbsp honey", "1 garlic clove"],
    steps: ["Cook noodles and broccoli together in boiling water for 4 minutes, then drain.", "Brown mince with garlic for 6 minutes.", "Add soy and honey and let it go sticky.", "Toss everything together."],
    batch: "A good use for leftover mince. Keeps 2 days in the fridge, or freeze it."
  },
  {
    id: "pb-shake", name: "PB Banana Protein Shake", cats: ["snack"], prep: false,
    time: 3, p: 41, c: 78, f: 22, emoji: "🥤", img: U("photo-1505252585461-04db1eb84625"),
    ing: ["400ml semi-skimmed milk", "1 banana", "25g peanut butter", "40g porridge oats", "150g 0% Greek-style yoghurt"],
    steps: ["Put everything in a blender.", "Blend for 30–60 seconds until smooth.", "Drink straight away."],
    batch: "Freeze sliced bananas in a bag. They make it thicker and colder."
  },
  {
    id: "tuna-cakes", name: "Tuna Rice Cakes", cats: ["snack"], prep: false,
    time: 3, p: 31, c: 29, f: 6, emoji: "🍙", img: U("photo-1540189549336-e6e99c3679fe"),
    ing: ["1 tin tuna, drained", "4 rice cakes", "15g light mayo", "Sliced cucumber", "Black pepper"],
    steps: ["Mix tuna, mayo and pepper.", "Spread over the rice cakes.", "Top with cucumber."],
    batch: "Mix 2 tins of tuna mayo at once. It keeps 2 days in a sealed tub."
  },
  {
    id: "pb-toast", name: "PB Banana Toast", cats: ["snack", "breakfast"], prep: false,
    time: 4, p: 15, c: 62, f: 14, emoji: "🍞", img: U("photo-1484723091739-30a097e8f929"),
    ing: ["2 slices wholemeal bread", "25g peanut butter", "1 banana, sliced", "Pinch of cinnamon (optional)"],
    steps: ["Toast the bread.", "Spread on the peanut butter.", "Top with banana and a pinch of cinnamon."],
    batch: "Nothing to prep. Keep the loaf in the freezer and toast slices from frozen."
  },
  {
    id: "egg-muffins", name: "Cheesy Egg Muffins (×3)", cats: ["snack", "breakfast"], prep: true,
    time: 25, p: 25, c: 3, f: 23, emoji: "🧁", img: U("photo-1482049016688-2d3e1b311543"),
    ing: ["3 eggs", "25g cheddar, grated", "¼ pepper, diced", "Handful of spinach or spring onion", "Salt and pepper"],
    steps: ["Heat the oven to 190°C (170°C fan) and grease a muffin tin.", "Whisk eggs with salt and pepper.", "Divide the veg and cheese between 3 holes, then pour the egg over.", "Bake for 18–20 minutes until set."],
    batch: "Make 12 at once. They keep 3 days in the fridge and freeze well, so microwave from frozen for 60–90 seconds."
  }
];

// Weekly plan. Index 0 = Sunday … 6 = Saturday.
const SLOTS = [
  ["b", "Breakfast"], ["l", "Lunch"], ["s", "Snack"], ["d", "Dinner"], ["e", "Evening snack"]
];
const PLAN = [
  { b: "pb-oats",        l: "jacket-tuna",  s: "egg-muffins", d: "curry",     e: "pb-shake" },   // Sun
  { b: "overnight-oats", l: "burrito-bowl", s: "yog-bowl",    d: "chilli",    e: "tuna-cakes" }, // Mon
  { b: "pb-oats",        l: "fried-rice",   s: "egg-muffins", d: "bolognese", e: "pb-toast" },   // Tue
  { b: "overnight-oats", l: "burrito-bowl", s: "yog-bowl",    d: "chilli",    e: "tuna-cakes" }, // Wed
  { b: "pb-oats",        l: "fried-rice",   s: "egg-muffins", d: "bolognese", e: "pb-toast" },   // Thu
  { b: "overnight-oats", l: "burrito-bowl", s: "yog-bowl",    d: "tuna-bake", e: "pb-toast" },   // Fri
  { b: "scrambled",      l: "fajita-wraps", s: "egg-muffins", d: "traybake",  e: "pb-shake" }    // Sat
];

const TARGET = { kcal: 2900, p: 140 };

// Sunday batch-cook — covers Mon–Fri lunches + dinners, 3 overnight oats, 12 egg muffins.
const PREP = [
  { t: "0:00", title: "Oven on, rice on", body: "Heat the oven to 200°C (180°C fan). Rinse 555g rice and get it cooking in your biggest pan. That covers 3 burrito bowls, 2 fried rice and 2 chilli portions." },
  { t: "0:05", title: "Season & bake the chicken", body: "Rub 690g chicken breast with paprika, cumin, salt and pepper. Bake on a lined tray for 22–25 minutes until it's cooked through with no pink inside." },
  { t: "0:10", title: "Start both mince sauces", body: "Two pans. Brown 250g mince in each with diced onion and garlic. Pan 1 (chilli): add chilli powder, cumin, 2 tins chopped tomatoes and 200g kidney beans. Pan 2 (bolognese): add diced carrot, 500g passata and the stock cube. Turn both to a low simmer for 25 minutes." },
  { t: "0:20", title: "Cool the rice fast", body: "Once the rice is cooked, spread it thin on a tray to cool within an hour. Fast cooling is what makes batch rice safe." },
  { t: "0:30", title: "Chicken out, muffins in", body: "Take the chicken out to rest. Whisk 12 eggs with salt and pepper, divide diced pepper and 100g cheese across a 12-hole tin, pour in the egg and bake for 18–20 minutes." },
  { t: "0:40", title: "Overnight oats ×3", body: "Three jars: 70g oats, 200ml milk, 170g yoghurt, 1 tbsp honey and frozen berries on top. Lids on, straight into the fridge." },
  { t: "0:50", title: "Egg fried rice ×2", body: "Slice the chicken. Wok on high: frozen veg, scrambled eggs, then 150g rice (dry weight, now cooked) and 240g chicken, plus soy. Split into 2 tubs." },
  { t: "1:05", title: "Burrito bowls ×3", body: "Into 3 tubs: rice, 150g sliced chicken each, kidney beans and sweetcorn. Keep the salsa and cheese aside and add them on the day." },
  { t: "1:15", title: "Portion the sauces", body: "Chilli: 2 tubs with rice. Bolognese: 2 tubs of sauce only. Cook the spaghetti fresh on the night." },
  { t: "1:30", title: "Fridge vs freezer", body: "Fridge: Monday's lunch and dinner. Freezer: everything else. Cooked rice keeps only 1 day in the fridge, and chicken keeps 3. Each night, move the next day's tubs from the freezer to the fridge to defrost." },
  { t: "1:40", title: "Label & clean down", body: "Write the day on each lid. Wash up while the muffins cool, then bag them up: 6 in the fridge, 6 in the freezer." },
  { t: "2:00", title: "Done ✅", body: "10 meals, 3 breakfasts and 12 snacks sorted. Reheat until steaming hot all the way through, and only reheat once." }
];

// Shopping list. price = rough Aldi/Lidl estimate in £. staple = lasts several weeks.
const SHOP = [
  { aisle: "Meat & Fish", items: [
    { n: "Chicken breast fillets", q: "~1.2kg", price: 7.5 },
    { n: "5% fat beef mince", q: "500g", price: 3.3 },
    { n: "Tuna chunks in brine", q: "4-pack", price: 3.2 }
  ]},
  { aisle: "Dairy & Eggs", items: [
    { n: "Eggs", q: "2 × 12", price: 4.3 },
    { n: "0% Greek-style yoghurt", q: "2 × 1kg", price: 4.0 },
    { n: "Semi-skimmed milk", q: "4 pints", price: 1.45 },
    { n: "Mature cheddar", q: "400g", price: 2.7 }
  ]},
  { aisle: "Fruit & Veg", items: [
    { n: "Bananas", q: "11", price: 1.9 },
    { n: "Onions", q: "1kg bag", price: 0.79 },
    { n: "Peppers", q: "3-pack", price: 1.09 },
    { n: "Potatoes", q: "2kg", price: 1.19 },
    { n: "Carrots", q: "1kg", price: 0.49 },
    { n: "Garlic", q: "1 bulb", price: 0.35 },
    { n: "Cucumber", q: "1", price: 0.59 }
  ]},
  { aisle: "Bakery", items: [
    { n: "Wholemeal bread", q: "1 loaf", price: 0.75 },
    { n: "Large tortilla wraps", q: "8-pack", price: 0.99 },
    { n: "Rice cakes", q: "1 pack", price: 0.65 }
  ]},
  { aisle: "Tins & Dry", items: [
    { n: "Porridge oats", q: "1kg", price: 0.85 },
    { n: "Long grain rice", q: "1kg", price: 1.15 },
    { n: "Pasta", q: "500g", price: 0.45 },
    { n: "Spaghetti", q: "500g", price: 0.45 },
    { n: "Kidney beans", q: "3 tins", price: 1.05 },
    { n: "Chopped tomatoes", q: "3 tins", price: 1.35 },
    { n: "Passata", q: "2 × 500g", price: 1.1 },
    { n: "Sweetcorn", q: "2 tins", price: 1.0 },
    { n: "Granola", q: "1 bag", price: 1.49 }
  ]},
  { aisle: "Frozen", items: [
    { n: "Frozen mixed berries", q: "500g", price: 1.99 },
    { n: "Frozen mixed veg", q: "1kg", price: 0.95 },
    { n: "Frozen peas", q: "1 bag", price: 0.89 }
  ]},
  { aisle: "Cupboard Staples (buy once)", items: [
    { n: "Peanut butter", q: "340g", price: 1.15, staple: true },
    { n: "Honey", q: "1 jar", price: 1.19, staple: true },
    { n: "Soy sauce", q: "1 bottle", price: 0.69, staple: true },
    { n: "Light mayo", q: "1 jar", price: 0.99, staple: true },
    { n: "Curry paste", q: "1 jar", price: 1.09, staple: true },
    { n: "Tomato salsa", q: "1 jar", price: 0.89, staple: true },
    { n: "Fajita seasoning", q: "1 sachet", price: 0.45, staple: true },
    { n: "Chilli powder, cumin, paprika", q: "3 jars", price: 1.65, staple: true },
    { n: "Beef stock cubes", q: "1 box", price: 0.35, staple: true }
  ]}
];
