const PHOTO_BASE = "https://fkpxolnsqjfgcbkiqbld.supabase.co/storage/v1/object/public/cafe-photos"

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  heroImage: string
  heroAlt: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-cafes-bandung-2026",
    title: "Best Cafes in Bandung 2026 — The Complete Guide",
    excerpt: "Our hand-picked selection of the best cafes in Bandung for 2026, from hidden gems to iconic rooftops. Work spots, aesthetic interiors, mountain views, and specialty coffee — all in one guide.",
    date: "2026-03-01",
    readTime: "12 min read",
    heroImage: `${PHOTO_BASE}/652_rumamenak/hero.jpg`,
    heroAlt: "Rumamenak — panoramic mountain view rooftop cafe in North Bandung",
    content: `
<p>Bandung has quietly become one of Southeast Asia's most exciting cafe cities. With nearly 600 cafes spread across the city — from the misty hills of North Bandung to the heritage streets of Braga — there's a spot for every mood, budget, and vibe.</p>

<p>We spent months visiting, reviewing, and cataloging every notable cafe in Bandung. Here are our top picks for 2026, organized by what you're actually looking for.</p>

<h2>Best for Work & Productivity</h2>

<figure>
  <img src="${PHOTO_BASE}/604_the-copy-room/hero.jpg" alt="The Copy Room — coworking cafe in Bandung with minimalist interior" width="1200" height="800" loading="lazy" />
  <figcaption>The Copy Room — Bandung's gold standard for working from a cafe</figcaption>
</figure>

<p>Bandung's cafe-and-laptop culture is thriving. These spots offer reliable WiFi, power outlets, and an atmosphere that actually lets you focus.</p>

<h3><a href="/cafe/604-the-copy-room">The Copy Room</a></h3>
<p>A dedicated coworking-cafe hybrid that takes productivity seriously. The Copy Room offers fast, stable WiFi, plenty of outlets, and a quiet atmosphere that's designed for deep work. Their specialty coffee is excellent too — you won't need to compromise on quality while you grind through emails. The minimalist interior keeps distractions low.</p>

<h3><a href="/cafe/362-two-hands-full">Two Hands Full</a></h3>
<p>Consistently rated as one of Bandung's best specialty coffee shops, Two Hands Full is also a fantastic work spot. The clean, minimalist design and quiet atmosphere make it easy to settle in for hours. Their pour-over selection is among the city's best.</p>

<h3><a href="/cafe/481-fuels-coffee">Fuels Coffee</a></h3>
<p>Another coworking-friendly cafe with a dedicated work area. Fuels Coffee attracts a mix of freelancers and students, with reliable WiFi and a menu that goes beyond just coffee. The atmosphere is relaxed but focused — perfect for a full day of remote work.</p>

<h2>Best Aesthetic & Instagrammable Cafes</h2>

<figure>
  <img src="${PHOTO_BASE}/570_afterstory/hero.jpg" alt="Afterstory — modern minimalist aesthetic cafe in Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Afterstory — one of Bandung's most talked-about aesthetic cafes</figcaption>
</figure>

<p>Bandung's cafe designers don't hold back. These spots are as photogenic as the coffee is good.</p>

<h3><a href="/cafe/570-afterstory">Afterstory</a></h3>
<p>Modern, minimalist, and impossibly aesthetic. Afterstory has become one of Bandung's most talked-about cafes for a reason. The interior design is striking without being overdone, and the specialty coffee program is legit. Great for solo visits or a quiet date.</p>

<h3><a href="/cafe/256-sender-coffee">Sender Coffee</a></h3>
<p>A hidden gem with a minimalist aesthetic that photographers love. Sender Coffee keeps things simple — clean lines, natural light, and excellent specialty coffee. The parking situation is good, making it an easy stop even if you're driving.</p>

<h3><a href="/cafe/679-latteria-gelato">Latteria Gelato</a></h3>
<p>Not a traditional cafe, but Latteria Gelato's minimalist design and artisanal gelato make it one of Bandung's most aesthetic dessert spots. Their matcha offerings are particularly popular. A must-visit for anyone who appreciates both design and dessert.</p>

<h2>Best Mountain View & Hillside Cafes</h2>

<figure>
  <img src="${PHOTO_BASE}/652_rumamenak/hero.jpg" alt="Rumamenak — hillside rooftop cafe overlooking Bandung mountains" width="1200" height="800" loading="lazy" />
  <figcaption>Rumamenak — our top pick for mountain views in Bandung</figcaption>
</figure>

<p>Bandung's geography is its superpower. Surrounded by volcanic mountains and tea plantations, the northern parts of the city offer cafe views that rival anything in Bali.</p>

<h3><a href="/cafe/652-rumamenak">Rumamenak</a></h3>
<p>Our top pick for views. Rumamenak sits high in the hills above Bandung with a rooftop terrace overlooking the city. The combination of premium food, tropical garden setting, and panoramic mountain views makes it worth the drive. Popular with both locals and visitors — book ahead on weekends.</p>

<h3><a href="/cafe/443-neo-amsterdam-cafe">Neo Amsterdam Cafe</a></h3>
<p>A rustic hillside gem with a European-inspired design set against Bandung's mountain backdrop. Neo Amsterdam feels like stepping into a different world. The cozy interior and dramatic views make it one of the most memorable cafe experiences in the city. Reservations recommended.</p>

<h3><a href="/cafe/436-coffee-90">Coffee 90</a></h3>
<p>Perched on the hillside with mountain views visible from most seats, Coffee 90 is a work-friendly cafe that happens to have incredible scenery. Their specialty coffee is solid, the WiFi works, and you can actually get things done while looking at volcanoes. Hard to beat.</p>

<h3><a href="/cafe/444-searah">Searah</a></h3>
<p>A minimalist hillside cafe popular with students and young professionals. Searah combines mountain views with excellent specialty coffee and a calm, focused atmosphere. The fresh juice selection is a nice bonus.</p>

<h2>Best Hidden Gems</h2>

<figure>
  <img src="${PHOTO_BASE}/683_skorz/hero.jpg" alt="Skorz — hidden gem cafe in Bandung with cozy minimalist interior" width="1200" height="800" loading="lazy" />
  <figcaption>Skorz — a quiet, cozy hidden gem that deserves more attention</figcaption>
</figure>

<p>These are the cafes that don't show up on every tourist list — but probably should.</p>

<h3><a href="/cafe/683-skorz">Skorz</a></h3>
<p>Quiet, cozy, and genuinely hidden. Skorz offers a work-friendly environment with AC, good food (including Western options), and a late-night schedule that's perfect for night owls. The minimalist modern interior is clean and comfortable. One of our favorite discoveries in Bandung.</p>

<h3><a href="/cafe/416-brown-house">Brown House</a></h3>
<p>A romantic, quiet restaurant-cafe with elegant vintage decor. Brown House is perfect for a date or a quiet dinner. The Western food menu is solid, and the atmosphere feels intimate without being stuffy. A hidden gem in every sense.</p>

<h3><a href="/cafe/673-tansah-rahayu-coffee">Tansah Rahayu Coffee</a></h3>
<p>A specialty coffee spot that prioritizes quality and atmosphere over Instagram appeal. Tansah Rahayu attracts serious coffee lovers with their carefully sourced beans and knowledgeable baristas. The vintage interior adds character without pretension.</p>

<h2>Best Premium & Fine Dining Cafes</h2>

<figure>
  <img src="${PHOTO_BASE}/612_braga-permai/hero.jpg" alt="Braga Permai — heritage fine dining restaurant on Jalan Braga, Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Braga Permai — a piece of Bandung history you can sit in</figcaption>
</figure>

<p>When you want to treat yourself or impress someone, these are Bandung's top-tier options.</p>

<h3><a href="/cafe/641-miss-bee-providore">Miss Bee Providore</a></h3>
<p>A Bandung institution. Miss Bee Providore is consistently rated as one of the city's best brunch spots, with a menu that blends Western and Indonesian flavors. The atmosphere is warm and inviting, and the weekend brunch is legendary. Reservations are essential.</p>

<h3><a href="/cafe/612-braga-permai">Braga Permai</a></h3>
<p>A heritage restaurant on Bandung's most famous street. Braga Permai has been serving since the colonial era, and the elegant rustic interior reflects that history. Come for the atmosphere and stay for the surprisingly good food. A piece of Bandung history you can actually sit in.</p>

<h3><a href="/cafe/603-the-18th-restaurant">The 18th Restaurant</a></h3>
<p>Fine dining with a rooftop view. The 18th offers one of Bandung's most sophisticated dining experiences, with panoramic city views, an extensive wine list, and a menu that matches the setting. Dress up for this one — it's worth it.</p>

<h2>Best for Groups & Families</h2>

<figure>
  <img src="${PHOTO_BASE}/404_bloemen-kedai-rumah/hero.jpg" alt="Bloemen Kedai Rumah — garden cafe in Bandung for families and groups" width="1200" height="800" loading="lazy" />
  <figcaption>Bloemen Kedai Rumah — charming garden setting, perfect for families</figcaption>
</figure>

<h3><a href="/cafe/404-bloemen-kedai-rumah">Bloemen Kedai Rumah</a></h3>
<p>A charming cafe-restaurant with a garden setting and kid-friendly atmosphere. Bloemen Kedai Rumah combines modern aesthetics with vintage warmth, and the menu has something for everyone. Great for family outings or group gatherings.</p>

<h3><a href="/cafe/352-marvel-boardgame-cafe">MARVEL Boardgame Cafe</a></h3>
<p>Exactly what it sounds like — a cafe with an extensive board game collection. MARVEL is perfect for groups who want something more interactive than just sitting and talking. The atmosphere is relaxed, the games are well-maintained, and the food is better than you'd expect from a themed cafe.</p>

<h2>Explore All 600+ Cafes</h2>

<p>This guide barely scratches the surface. Bandung has nearly 600 cafes, and we've cataloged all of them on Cafepedia — complete with photos, hours, directions, and tags so you can filter by exactly what you're looking for.</p>

<p><a href="/">Search all cafes on Cafepedia</a> or try our <a href="/search?q=hidden+gem">hidden gems</a>, <a href="/search?q=work+cafes">work-friendly spots</a>, or <a href="/search?q=mountain+view">mountain view cafes</a>.</p>

<h3>Explore More</h3>
<ul>
  <li><a href="/best-cafes-bandung">Best Cafes in Bandung</a></li>
  <li><a href="/aesthetic-cafes-bandung">Aesthetic Cafes in Bandung</a></li>
  <li><a href="/cheap-cafes-bandung">Cheap Cafes in Bandung</a></li>
  <li><a href="/cafes-dago-bandung">Cafes in Dago</a></li>
  <li><a href="/cafes-braga-bandung">Cafes in Braga</a></li>
</ul>
`,
  },
  {
    slug: "work-friendly-cafes-bandung",
    title: "Best Work-Friendly Cafes in Bandung — WiFi, Power & Good Coffee",
    excerpt: "The definitive guide to remote work cafes in Bandung. Fast WiFi, power outlets, quiet atmosphere, and specialty coffee — everything a digital nomad or freelancer needs.",
    date: "2026-03-03",
    readTime: "9 min read",
    heroImage: `${PHOTO_BASE}/362_two-hands-full/hero.jpg`,
    heroAlt: "Two Hands Full — minimalist specialty coffee shop and work cafe in Bandung",
    content: `
<p>Whether you're a digital nomad passing through, a freelancer based in Bandung, or a student looking for a change of scenery, finding the right work cafe matters. You need reliable WiFi, accessible power outlets, a quiet enough atmosphere, and — ideally — good coffee to keep you going.</p>

<p>Bandung has dozens of work-friendly cafes, but not all are created equal. We tested WiFi speeds, checked outlet availability, and spent full work days at each of these spots. Here are the ones that actually deliver.</p>

<h2>Best Overall: Coworking-Cafe Hybrids</h2>

<figure>
  <img src="${PHOTO_BASE}/604_the-copy-room/hero.jpg" alt="The Copy Room — best coworking cafe in Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>The Copy Room — the gold standard for working from a cafe in Bandung</figcaption>
</figure>

<p>These cafes are designed for work. They understand that you're not just here for a latte — you're here to get things done.</p>

<h3><a href="/cafe/604-the-copy-room">The Copy Room</a></h3>
<p>The gold standard for working in a cafe in Bandung. The Copy Room is a proper coworking space that happens to serve excellent specialty coffee. The WiFi is fast and stable, every seat has outlet access, and the atmosphere is quiet without being sterile. They understand the laptop crowd and welcome long stays. The minimalist interior keeps you focused, and the parking situation is sorted. If you can only pick one work cafe in Bandung, make it this one.</p>

<h3><a href="/cafe/322-betah-space">Betah Space</a></h3>
<p>The name says it all — "betah" means comfortable in Indonesian. This coworking-cafe hybrid is designed for people who need to spend hours working. Reliable WiFi, good outlets, and an atmosphere that balances focus with comfort. Less of a traditional cafe vibe, more of a modern workspace that serves coffee.</p>

<h3><a href="/cafe/207-bermula-coffee-and-space">Bermula Coffee and Space</a></h3>
<p>A coworking space with serious coffee credentials. Bermula combines a proper workspace environment with a specialty coffee program that would stand on its own. The "space" part of the name isn't marketing — they've genuinely thought about what people need to work effectively.</p>

<h2>Best for Quiet, Focused Work</h2>

<figure>
  <img src="${PHOTO_BASE}/362_two-hands-full/hero.jpg" alt="Two Hands Full — quiet specialty coffee shop in Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Two Hands Full — calm, quiet, and one of Bandung's best pour-overs</figcaption>
</figure>

<p>Sometimes you need silence more than speed. These cafes keep the noise down and let you concentrate.</p>

<h3><a href="/cafe/362-two-hands-full">Two Hands Full</a></h3>
<p>One of Bandung's most respected specialty coffee shops is also one of its quietest. Two Hands Full attracts a calm, focused crowd, and the minimalist interior doesn't create unnecessary distractions. The coffee is exceptional — their single-origin pour-overs are worth trying even if you're normally an espresso person. Work-friendly without explicitly advertising it.</p>

<h3><a href="/cafe/256-sender-coffee">Sender Coffee</a></h3>
<p>Hidden, quiet, and minimal. Sender Coffee is the kind of place where you can disappear into your work for hours without anyone bothering you. The specialty coffee is excellent, the atmosphere is calm, and the modern aesthetic keeps things pleasant without being distracting. Good parking, too.</p>

<h3><a href="/cafe/39-cafe-dante">Cafe Dante</a></h3>
<p>A truly quiet work spot with a minimalist modern interior. Cafe Dante is solo-friendly, has AC, and serves decent Western food alongside their specialty coffee. The smoking area is separate, so non-smokers can breathe easy. One of the more underrated work cafes in Bandung.</p>

<h2>Best for Students & Budget Workers</h2>

<figure>
  <img src="${PHOTO_BASE}/345_kopi-poka/hero.jpg" alt="Kopi Poka — budget-friendly student cafe in Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Kopi Poka — reliable WiFi and great coffee at student-friendly prices</figcaption>
</figure>

<p>Not everyone can afford to spend Rp 50k+ on coffee every day. These spots are wallet-friendly without cutting corners on the work environment.</p>

<h3><a href="/cafe/345-kopi-poka">Kopi Poka</a></h3>
<p>Popular with students for good reason — Kopi Poka offers a quiet work environment, reliable WiFi, and budget-friendly prices. The specialty coffee is surprisingly good for the price point, and the modern minimalist interior is comfortable for long sessions. A solid everyday work spot.</p>

<h3><a href="/cafe/513-sudut-kopi">Sudut Kopi</a></h3>
<p>Another budget-friendly option that students love. Sudut Kopi keeps things simple — good coffee, quiet atmosphere, and prices that won't drain your wallet. The aesthetic interior is a nice bonus. Great for students who need a change from the library.</p>

<h3><a href="/cafe/329-finz-coffee-id-surapati-engineers-hub-authentic-coffee-shop">FINZ COFFEE.ID Surapati</a></h3>
<p>Self-described as an "Engineers Hub," FINZ is a coworking-cafe that caters specifically to students and tech workers. Budget-friendly prices, late-night hours, and a community of like-minded people make it feel more like a shared office than a cafe. The specialty coffee is solid for the price.</p>

<h2>Best Views While You Work</h2>

<figure>
  <img src="${PHOTO_BASE}/436_coffee-90/hero.jpg" alt="Coffee 90 — hillside work cafe with mountain views in Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Coffee 90 — mountain views, reliable WiFi, and solid specialty coffee</figcaption>
</figure>

<p>Why stare at a wall when you can stare at mountains? These hillside cafes prove that productivity and scenery aren't mutually exclusive.</p>

<h3><a href="/cafe/636-jabarano-unpar">Jabarano UNPAR</a></h3>
<p>Located near the UNPAR university campus in the hills, Jabarano UNPAR combines a serious work environment with mountain views. The WiFi is reliable, the specialty coffee is good, and the hillside location means you get natural light and greenery. Popular with students from the nearby campus, but spacious enough to find a quiet corner.</p>

<h3><a href="/cafe/372-dago-coffee">DAGO COFFEE</a></h3>
<p>A hillside cafe on the famous Dago strip with mountain views and a genuinely work-friendly atmosphere. DAGO COFFEE offers specialty coffee, solo-friendly seating, and a quiet vibe that welcomes laptops. The views are a pleasant distraction when you need a mental break from work.</p>

<h3><a href="/cafe/436-coffee-90">Coffee 90</a></h3>
<p>Mountain views from a minimalist, work-friendly cafe. Coffee 90 is proof that you don't have to choose between scenery and productivity. The WiFi works, the outlets are accessible, and the specialty coffee keeps you sharp. Solo-friendly and quiet — ideal for a full work day with a view.</p>

<h2>Tips for Working from Cafes in Bandung</h2>

<ul>
<li><strong>Peak hours:</strong> Most cafes get busy between 1-3 PM on weekdays and all day on weekends. Arrive early for the best seats.</li>
<li><strong>Power banks:</strong> Even in work-friendly cafes, outlet access can be limited during peak times. Bring a backup.</li>
<li><strong>Order regularly:</strong> If you're staying 3+ hours, order something every 1-2 hours. It's good etiquette and keeps you caffeinated.</li>
<li><strong>Check hours:</strong> Some cafes close early (by 5 PM). If you need evening work sessions, look for spots with late-night hours.</li>
<li><strong>Mobile data backup:</strong> Even the best cafe WiFi can drop. Keep your phone hotspot ready as a backup.</li>
</ul>

<p>Want to find more work-friendly cafes? <a href="/search?q=work+cafes">Search for work-friendly cafes on Cafepedia</a> or explore <a href="/search?q=coworking">coworking spaces</a> across Bandung.</p>

<h3>Explore More</h3>
<ul>
  <li><a href="/best-cafes-to-work-bandung">Best Cafes to Work in Bandung</a></li>
  <li><a href="/cafes-to-work-dago-bandung">Work Cafes in Dago</a></li>
  <li><a href="/quiet-cafes-bandung">Quiet Cafes in Bandung</a></li>
  <li><a href="/best-cafes-bandung">Best Cafes in Bandung</a></li>
  <li><a href="/cheap-cafes-bandung">Cheap Cafes in Bandung</a></li>
</ul>
`,
  },
  {
    slug: "bandung-cafe-guide-by-area",
    title: "Bandung Cafe Guide by Area — Dago, Braga, North Bandung & More",
    excerpt: "A neighborhood-by-neighborhood guide to Bandung's cafe scene. From the heritage streets of Braga to the mountain views of North Bandung, find the best cafes in every area.",
    date: "2026-03-05",
    readTime: "10 min read",
    heroImage: `${PHOTO_BASE}/272_kopi-toko-djawa/hero.jpg`,
    heroAlt: "Kopi Toko Djawa — heritage coffee shop on Jalan Braga, Bandung",
    content: `
<p>Bandung's cafe scene isn't concentrated in one area — it's spread across distinct neighborhoods, each with its own character. Understanding the geography helps you find the right cafe without driving across town. Here's your area-by-area guide.</p>

<h2>Dago — The University & Lifestyle Hub</h2>

<figure>
  <img src="${PHOTO_BASE}/372_dago-coffee/hero.jpg" alt="DAGO COFFEE — hillside cafe with mountain views on Jalan Dago, Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>DAGO COFFEE — quintessential upper Dago vibes with mountain views</figcaption>
</figure>

<p>Dago is Bandung's most popular cafe strip, running from the flatlands near ITB (Bandung Institute of Technology) up into the hills. The lower part is buzzing with student energy; the upper part offers hillside views and cooler temperatures. This is where you'll find the highest concentration of cafes in the city.</p>

<h3>Best Picks in Dago</h3>

<h4><a href="/cafe/372-dago-coffee">DAGO COFFEE</a></h4>
<p>A hillside cafe with mountain views, work-friendly vibes, and specialty coffee. DAGO COFFEE is quintessential upper Dago — quiet, scenic, and perfect for settling in with a laptop or a good conversation. The solo-friendly atmosphere makes it ideal for independent visitors.</p>

<h4><a href="/cafe/341-kisah-manis-dago">Kisah Manis Dago</a></h4>
<p>A stylish dessert-and-coffee spot on the Dago strip. Kisah Manis ("Sweet Story") combines a minimalist modern interior with excellent specialty coffee and Instagram-worthy desserts. Great for dates or catching up with friends. The hillside location adds mountain views to the mix.</p>

<h4><a href="/cafe/364-wheels-coffee-roasters-juanda-dago">Wheels Coffee Roasters (Dago)</a></h4>
<p>A serious specialty coffee roaster with an elegant, work-friendly space. Wheels is where Bandung's coffee nerds come to geek out over single-origin beans and brewing methods. Reservations recommended on weekends.</p>

<h4><a href="/cafe/650-gedongan-dago">Gedongan Dago</a></h4>
<p>A vintage-meets-modern cafe with breakfast options and a cozy hillside setting. Gedongan Dago is popular with students and families alike, offering a rustic atmosphere that feels authentic rather than manufactured. Good for weekend brunch.</p>

<p><strong>Dago tip:</strong> Upper Dago (above the ITB area) is 5-10 degrees cooler than central Bandung. On hot days, head uphill for natural AC and mountain breezes.</p>

<h2>Braga — The Heritage District</h2>

<figure>
  <img src="${PHOTO_BASE}/272_kopi-toko-djawa/hero.jpg" alt="Kopi Toko Djawa — rustic heritage coffee shop on Jalan Braga" width="1200" height="800" loading="lazy" />
  <figcaption>Kopi Toko Djawa — timeless Indonesian coffee traditions on Braga</figcaption>
</figure>

<p>Jalan Braga is Bandung's most historic street, lined with Art Deco buildings from the colonial era. The cafe scene here reflects that heritage — expect vintage interiors, rustic charm, and a sense of history. Walking Braga on a weekend evening, hopping between cafes, is one of Bandung's best experiences.</p>

<h3>Best Picks in Braga</h3>

<h4><a href="/cafe/612-braga-permai">Braga Permai</a></h4>
<p>The grande dame of Braga cafes. Braga Permai has been serving since the Dutch colonial period, and the elegant interior hasn't lost its charm. This is premium dining in a heritage setting — come for the history, stay for the surprisingly refined menu. Reservations recommended, especially on weekends.</p>

<h4><a href="/cafe/272-kopi-toko-djawa">Kopi Toko Djawa</a></h4>
<p>A rustic coffee shop that celebrates Indonesian coffee traditions. Kopi Toko Djawa serves local beans in a heritage building, creating an atmosphere that feels timeless. Popular with students and coffee enthusiasts, it's one of the most authentic cafe experiences on Braga.</p>

<h4><a href="/cafe/611-braga-huis">Braga Huis</a></h4>
<p>A romantic, rustic cafe in a restored colonial building. Braga Huis captures the nostalgic atmosphere of old Bandung with vintage decor, warm lighting, and a cozy interior. Popular for dates and evening coffee. The vintage photography on the walls tells stories of Braga's past.</p>

<h4><a href="/cafe/499-goedang-kopi-braga">Goedang Kopi Braga</a></h4>
<p>A work-friendly cafe on Braga with a quiet atmosphere and decent WiFi. Goedang Kopi bridges the gap between heritage charm and modern functionality — you get the rustic Braga setting with the practical amenities a remote worker needs.</p>

<p><strong>Braga tip:</strong> Visit on a weekend evening when the street becomes partially pedestrianized. The atmosphere is magical — live music spills from doorways, and the Art Deco buildings are lit up. Start at one end and walk the full strip.</p>

<h2>North Bandung — Mountain Views & Fresh Air</h2>

<figure>
  <img src="${PHOTO_BASE}/652_rumamenak/hero.jpg" alt="Rumamenak — premium rooftop dining with panoramic mountain views" width="1200" height="800" loading="lazy" />
  <figcaption>Rumamenak — 180-degree mountain views from North Bandung's best rooftop</figcaption>
</figure>

<p>North Bandung (Bandung Utara) climbs into the mountains toward Lembang and Dago Atas. This is where you come for views, fresh air, and an escape from the city heat. Cafes here tend to have gardens, terraces, and panoramic vistas. The tradeoff: it's a 20-40 minute drive from central Bandung.</p>

<h3>Best Picks in North Bandung</h3>

<h4><a href="/cafe/652-rumamenak">Rumamenak</a></h4>
<p>Our top pick for the entire North Bandung area. Rumamenak offers premium dining on a rooftop terrace with 180-degree mountain views. The tropical garden setting feels like a resort, and the food lives up to the view. Popular on weekends — arrive early or book ahead.</p>

<h4><a href="/cafe/697-kampung-daun">Kampung Daun</a></h4>
<p>A premium dining experience set in a tropical hillside garden. Kampung Daun serves Sundanese and Western food in private gazebos surrounded by greenery and running water. It's more restaurant than cafe, but the setting is so unique it belongs on any Bandung list. Romantic and group-friendly at the same time.</p>

<h4><a href="/cafe/639-kopi-kohi-ciumbuleuit">Kopi Kohi Ciumbuleuit</a></h4>
<p>A work-friendly specialty coffee shop in the Ciumbuleuit hills. Kopi Kohi combines mountain views with a quiet, studious atmosphere. Popular with university students from the nearby campus. The specialty coffee is among the best in the hillside area, and the prices remain reasonable.</p>

<h4><a href="/cafe/443-neo-amsterdam-cafe">Neo Amsterdam Cafe</a></h4>
<p>A hillside cafe with European-inspired rustic design and dramatic mountain views. Neo Amsterdam feels like it belongs in the Dutch countryside — which, given Bandung's colonial history, is oddly fitting. The cozy interior and instagrammable exterior make it worth the drive. Reservations needed on weekends.</p>

<p><strong>North Bandung tip:</strong> Traffic heading north gets heavy on weekends, especially toward Lembang. Leave before 9 AM or go on a weekday. The temperature drops noticeably as you climb — bring a light jacket.</p>

<h2>Pasir Kaliki & Central West</h2>

<figure>
  <img src="${PHOTO_BASE}/295_ruckerpark-coffee-and-culture/hero.jpg" alt="Ruckerpark Coffee and Culture — community cafe in Pasir Kaliki, Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Ruckerpark Coffee and Culture — a community hub in Pasir Kaliki</figcaption>
</figure>

<p>The Pasir Kaliki area, west of the train station, has a growing cafe scene that's less touristy than Dago or Braga. You'll find local favorites and some genuine hidden gems here, often at lower prices.</p>

<h3>Best Picks in Pasir Kaliki</h3>

<h4><a href="/cafe/295-ruckerpark-coffee-and-culture">Ruckerpark Coffee and Culture</a></h4>
<p>A cafe that takes both coffee and culture seriously. Ruckerpark has carved out a niche as a community gathering spot with good specialty coffee and regular events. The atmosphere is relaxed and welcoming — more neighborhood cafe than destination spot.</p>

<h4><a href="/cafe/675-daily-breu">Daily Breu</a></h4>
<p>A newer addition to the Pasir Kaliki scene. Daily Breu serves quality coffee in a clean, modern setting. Good for a quick stop or a short work session. The prices are fair and the vibe is unpretentious.</p>

<h4><a href="/cafe/287-ben-and-lou-coffee">Ben and Lou Coffee</a></h4>
<p>A cozy neighborhood cafe with a loyal local following. Ben and Lou Coffee doesn't try to be fancy — it focuses on good coffee, friendly service, and a comfortable atmosphere. The kind of place where regulars know the barista's name.</p>

<p><strong>Pasir Kaliki tip:</strong> This area is close to Bandung Station (Stasiun Bandung), making it convenient if you're arriving by train from Jakarta. Walk from the station to explore the local cafe scene before heading to your hotel.</p>

<h2>Buah Batu & South Bandung</h2>

<figure>
  <img src="${PHOTO_BASE}/203_tri-tangtu-kopi-roasters/hero.jpg" alt="Tri Tangtu Kopi Roasters — specialty coffee roaster in Buah Batu, Bandung" width="1200" height="800" loading="lazy" />
  <figcaption>Tri Tangtu Kopi Roasters — serious coffee craft in south Bandung</figcaption>
</figure>

<p>South Bandung is primarily residential, with cafes that cater to locals rather than tourists. The prices tend to be lower, and you'll find a more authentic, everyday Bandung cafe experience.</p>

<h3>Best Picks in Buah Batu</h3>

<h4><a href="/cafe/619-buah-batu-coffee">Buah Batu Coffee</a></h4>
<p>The neighborhood coffee shop. Buah Batu Coffee is straightforward — good coffee, fair prices, and a relaxed atmosphere. It's the kind of local spot that anchors a neighborhood. No frills, no Instagram traps, just coffee done right.</p>

<h4><a href="/cafe/203-tri-tangtu-kopi-roasters">Tri Tangtu Kopi Roasters</a></h4>
<p>A specialty coffee roaster with a focus on quality and craft. Tri Tangtu stands out in the south Bandung scene for their serious approach to sourcing and roasting. If you care about where your coffee comes from and how it's prepared, this is your spot in the area.</p>

<h4><a href="/cafe/202-kinokimi-backyard">Kinokimi Backyard</a></h4>
<p>A charming backyard cafe with a garden setting. Kinokimi Backyard brings a touch of whimsy to south Bandung with its outdoor seating and relaxed atmosphere. A nice escape from the busier central areas.</p>

<p><strong>Buah Batu tip:</strong> The area is best explored by car or motorcycle. Grab (ride-hailing) works well here, and you'll often find parking easier than in Dago or Braga.</p>

<h2>How to Navigate Bandung's Cafe Scene</h2>

<ul>
<li><strong>For first-time visitors:</strong> Start with Braga for the heritage experience, then head to Dago for the mountain vibes. That covers Bandung's two signature cafe areas.</li>
<li><strong>For remote workers:</strong> Pick a base area and explore nearby cafes. Moving between areas during the day wastes time in traffic.</li>
<li><strong>For cafe-hopping:</strong> Braga is the best area for walking between cafes — everything is within a 500-meter stretch.</li>
<li><strong>For views:</strong> Head north. The further up you go, the better the views — but also the worse the traffic.</li>
</ul>

<p>Ready to explore? <a href="/">Search all 600+ cafes on Cafepedia</a> and filter by what matters to you — vibe, area, features, or just let our <a href="/search?q=hidden+gem">hidden gems search</a> surprise you.</p>

<h3>Explore More</h3>
<ul>
  <li><a href="/cafes-dago-bandung">Cafes in Dago</a></li>
  <li><a href="/cafes-braga-bandung">Cafes in Braga</a></li>
  <li><a href="/cafes-riau-bandung">Cafes in Riau</a></li>
  <li><a href="/cafes-ciumbuleuit-bandung">Cafes in Ciumbuleuit</a></li>
  <li><a href="/best-cafes-bandung">Best Cafes in Bandung</a></li>
</ul>
`,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map(p => p.slug)
}
