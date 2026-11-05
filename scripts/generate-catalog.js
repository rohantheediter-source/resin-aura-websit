const fs = require('fs');
const path = require('path');

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

const photoPool = {
  keychains: [
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  ],
  jewellery: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
  ],
  gifts: [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1000&auto=format&fit=crop',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1000&auto=format&fit=crop',
  ]
};

const categoryDefinitions = [
  {
    category: 'Resin Alphabet Keychains',
    prefix: 'RA-AK',
    photos: photoPool.keychains,
    items: [
      { name: '24K Gold Leaf Initial Alphabet Resin Keychain', price: 349, orig: 499, disc: 30, desc: 'Bespoke crystal-clear alphabet initial keychain hand-poured with non-yellowing UV art resin, encapsulated with genuine 24K gold foil flakes, micro-pearls, and matching gold tassel charm.' },
      { name: 'Pressed Wildflower & Daisy Alphabet Resin Keychain', price: 399, orig: 549, disc: 27, desc: 'A miniature eternal botanical garden encased in glass-like resin with baby’s breath and lavender petals.' },
      { name: 'Rose Quartz Shimmer Alphabet Resin Keychain', price: 379, orig: 499, disc: 24, desc: 'Blush pink translucent resin letter laced with crushed rose quartz dust and rose gold foil.' },
      { name: 'Celestial Starry Night Alphabet Resin Keychain', price: 369, orig: 499, disc: 26, desc: 'Midnight navy resin embedded with holographic stars, silver foils, and miniature constellation flakes.' },
      { name: 'Emerald Forest Botanical Letter Resin Keychain', price: 389, orig: 529, disc: 26, desc: 'Deep pine green translucent resin initial with real micro-moss, gold flakes, and satin green tassel.' },
      { name: 'Iridescent Pearl Cloud Alphabet Resin Keychain', price: 359, orig: 489, disc: 27, desc: 'White pearlescent mica resin casting giving off a dreamy opalescent cloud effect with gold hardware.' },
      { name: 'Sunset Amber Leaf Initial Resin Keychain', price: 379, orig: 519, disc: 27, desc: 'Warm amber tones featuring dehydrated marigold petals and autumn bronze metallic foils.' },
      { name: 'Turquoise Ocean Wave Initial Resin Keychain', price: 399, orig: 549, disc: 27, desc: 'Caribbean blue resin layered with natural white sea cells and fine shoreline sand.' },
      { name: 'Lavender & Amethyst Crystal Letter Keychain', price: 389, orig: 529, disc: 26, desc: 'French lavender sprigs and crushed raw amethyst chips encased in glass-grade optical epoxy.' },
      { name: 'Gilded Marble Monogram Resin Keychain', price: 369, orig: 499, disc: 26, desc: 'Italian white marble swirl effect hand-drawn with veins of molten gold liquid gilding.' },
      { name: 'Midnight Obsidian & 24K Gold Letter Keychain', price: 399, orig: 549, disc: 27, desc: 'Jet black pigment contrasted with high-density floating 24K imitation gold leaf.' },
      { name: 'Baby Pink Baby Breath Floral Initial Keychain', price: 349, orig: 479, disc: 27, desc: 'Pastel baby pink resin encasing dried white gypsophila flowers and micro-glitter.' },
      { name: 'Ruby Wine Crimson Petal Alphabet Keychain', price: 379, orig: 519, disc: 27, desc: 'Deep red rose botanicals set in crystal clear UV-stabilized resin with a golden charm.' },
      { name: 'Golden Sunflower Summer Letter Resin Keychain', price: 389, orig: 529, disc: 26, desc: 'Vibrant yellow preserved sunflower petals encased with golden mica flakes.' },
    ]
  },
  {
    category: 'Custom Name Keychains',
    prefix: 'RA-CK',
    photos: photoPool.keychains,
    items: [
      { name: 'Personalized Custom Name Resin Bar Keychain', price: 449, orig: 599, disc: 25, desc: 'Sleek rectangular resin bar embedded with your custom embossed name in floating 3D metallic gold vinyl.' },
      { name: 'Hexagon Couple Name & Anniversary Date Resin Keychain', price: 499, orig: 699, disc: 28, desc: 'Geometric hexagon resin keepsake customized with couple names and anniversary date.' },
      { name: 'Circular Floral Custom Name Tag Resin Keychain', price: 469, orig: 629, disc: 25, desc: 'Circular medallion preserving pastel baby’s breath with personalized name in gold script.' },
      { name: 'Custom Spotify Code & Song Title Resin Keychain', price: 499, orig: 699, disc: 28, desc: 'Scannable Spotify wave code embedded in clear resin with gold flakes that plays your special song on phone.' },
      { name: 'Pet Silhouette & Name Tag Resin Keychain', price: 429, orig: 579, disc: 26, desc: 'Custom paw-shaped or bone-shaped resin tag personalized with pet name and emergency contact.' },
      { name: 'Heart Shaped Personalized Couple Resin Keychain', price: 479, orig: 649, disc: 26, desc: 'Interlocking heart shape with two names preserved in shimmering mica and gold foil.' },
      { name: 'Minimalist Transparent Name Strip Resin Keychain', price: 399, orig: 549, disc: 27, desc: 'Crystal clear slim resin bar with black minimalist typography and subtle gold specks.' },
      { name: 'Calacatta Marble Name Bar Resin Keychain', price: 459, orig: 619, disc: 26, desc: 'White marble resin finish with embossed 3D mirror gold acrylic name.' },
      { name: 'Ocean Beachfront Name Tag Resin Keychain', price: 489, orig: 659, disc: 26, desc: 'Real white sand and turquoise sea foam with personalized golden cursive lettering.' },
      { name: 'Rose Gold Flake Custom Bar Keychain', price: 469, orig: 629, disc: 25, desc: 'High-density floating rose gold leaf in clear resin with personalized inscription.' },
      { name: 'Bespoke Zodiac Sign & Name Resin Charm', price: 439, orig: 589, disc: 25, desc: 'Constellation zodiac symbol alongside your name cast in deep starry resin.' },
      { name: 'Double-Sided Milestone Year & Name Keychain', price: 499, orig: 699, disc: 28, desc: 'Commemorates graduation or milestone years with custom engraved text.' },
      { name: 'Golden Glitter Monogram Square Keychain', price: 449, orig: 599, disc: 25, desc: 'Chunky square block with cascading liquid gold flakes and custom initials.' },
      { name: 'Botanical Fern & Script Name Resin Bar', price: 479, orig: 649, disc: 26, desc: 'Real dried forest fern sprig encapsulated with golden cursive calligraphy.' },
    ]
  },
  {
    category: 'Resin Earrings',
    prefix: 'RA-RE',
    photos: photoPool.jewellery,
    items: [
      { name: 'Celestial Opal Shimmer Resin Drop Earrings', price: 649, orig: 899, disc: 28, desc: 'Mesmerizing iridescent resin earrings mirroring Australian fire opals with 925 sterling silver hooks.' },
      { name: 'Pressed Hydrangea Petal Resin Huggie Hoops', price: 599, orig: 799, disc: 25, desc: 'Delicate blue and lilac hydrangea petals encased in miniature crescent charms on 18K gold-plated hoops.' },
      { name: 'Emerald Geode Agate Resin Dangle Earrings', price: 699, orig: 949, disc: 26, desc: 'Rich emerald alcohol ink swirls with crushed quartz crystals and hand-gilded gold leaf edges.' },
      { name: 'Blush Pink Rose Petal Teardrop Earrings', price: 629, orig: 849, disc: 26, desc: 'Hand-pressed organic pink rose petals encased in multifaceted crystal drops.' },
      { name: 'Gold Flake Geometric Hexagon Resin Studs', price: 499, orig: 699, disc: 29, desc: 'Dainty everyday geometric studs packed with dense 24K imitation gold leaf.' },
      { name: 'Ocean Lagoon Turquoise Resin Dangles', price: 649, orig: 879, disc: 26, desc: 'Two-tone ocean water layers with golden sea cells and delicate 14K gold filled wires.' },
      { name: 'Midnight Black & Molten Gold Hoop Earrings', price: 679, orig: 929, disc: 27, desc: 'Dramatic black resin crescent hoops edged in textured liquid gold gilding.' },
      { name: 'Dried Baby Breath Spherical Orb Earrings', price: 589, orig: 799, disc: 26, desc: 'Perfect glass-like spherical resin orbs holding delicate white baby’s breath blooms.' },
      { name: 'Lavender Sprig Arch Resin Drop Earrings', price: 619, orig: 849, disc: 27, desc: 'Art deco curved arches holding real French lavender sprigs and micro-gold glitter.' },
      { name: 'Champagne Shimmer Resin Chandelier Earrings', price: 749, orig: 999, disc: 25, desc: 'Tiered geometric resin elements with champagne metallic mica and sparkling fringe.' },
      { name: 'Pressed Yellow Daisy Floral Resin Studs', price: 479, orig: 649, disc: 26, desc: 'Sunny micro-daisies frozen in clear round resin with hypoallergenic titanium posts.' },
      { name: 'Crimson Poppy Resin Statement Earrings', price: 699, orig: 949, disc: 26, desc: 'Vibrant crimson poppy petal inclusions creating a fiery, bold evening accessory.' },
      { name: 'Tortoise Agate Resin Oval Drops', price: 639, orig: 869, disc: 26, desc: 'Warm amber, mocha, and caramel resin swirls creating a modern tortoise shell effect.' },
      { name: 'Raw Crystal & Gold Dust Resin Ear Climbers', price: 679, orig: 919, disc: 26, desc: 'Curved ear contouring resin pieces studded with miniature raw quartz crystals.' },
    ]
  },
  {
    category: 'Resin Pendants',
    prefix: 'RA-RP',
    photos: photoPool.jewellery,
    items: [
      { name: 'Emerald Aurora Resin & Gold Teardrop Pendant', price: 899, orig: 1299, disc: 31, desc: 'Handcrafted teardrop pendant featuring swirling deep emerald alcohol inks, cosmic gold mica dust, and 24K gold foil.' },
      { name: 'Ocean Wave Turquoise Resin Wave Pendant', price: 849, orig: 1199, disc: 29, desc: 'Caribbean blue resin layered with natural white sea cells and fine shoreline sand on 18K gold chain.' },
      { name: 'Real Baby Breath Glass Orb Resin Pendant', price: 799, orig: 1099, disc: 27, desc: 'Spherical crystal orb containing whole white baby’s breath blossoms suspended in timeless clarity.' },
      { name: 'Raw Amethyst Geode Slice Resin Pendant', price: 949, orig: 1349, disc: 30, desc: 'Simulated purple geode slice with crushed raw amethyst crystals and electroplated gold rim.' },
      { name: 'Cosmic Galaxy Swirl Resin Teardrop Pendant', price: 879, orig: 1249, disc: 30, desc: 'Deep violet and starry blue cosmic vortex with color-shifting chameleon sparkle flakes.' },
      { name: 'Red Rose Petal & Gold Leaf Heart Pendant', price: 829, orig: 1149, disc: 28, desc: 'Sweet heart-shaped optical pendant encasing real scarlet rose petals and fine gold dust.' },
      { name: 'Calacatta Gold Marble Oval Resin Pendant', price: 859, orig: 1199, disc: 28, desc: 'Faux Italian marble elegance with hand-poured golden veins and smooth glass polish.' },
      { name: 'Sunset Gradient Resin Horizon Pendant', price: 839, orig: 1179, disc: 29, desc: 'Warm sunset gradient moving from orange to deep pink, framed in brushed brass.' },
      { name: 'Wild Fern & Moss Forest Resin Pendant', price: 819, orig: 1149, disc: 29, desc: 'Intricate dried botanical fern branch and reindeer moss sealed in clear teardrop.' },
      { name: 'Molten Gold Vein Black Obsidian Pendant', price: 899, orig: 1299, disc: 31, desc: 'Glossy pitch-black resin split by a jagged river of molten liquid gold.' },
      { name: 'Preserved Blue Cornflower Resin Pendant', price: 849, orig: 1199, disc: 29, desc: 'Intense cobalt blue petals of dried cornflower preserved in crystal resin.' },
      { name: 'Iridescent Mermaid Scale Resin Pendant', price: 799, orig: 1099, disc: 27, desc: 'Hexagonal resin medallion that changes color from teal to violet with movement.' },
      { name: 'Golden Marigold Solar Resin Pendant', price: 829, orig: 1149, disc: 28, desc: 'Preserved marigold petal shards capturing bright warm sunlight in amber resin.' },
      { name: 'White Opal Crystal Point Resin Pendant', price: 889, orig: 1249, disc: 29, desc: 'Hexagonal prismatic crystal point cast in clear resin packed with opalescent flakes.' },
    ]
  },
  {
    category: 'Resin Necklaces',
    prefix: 'RA-RN',
    photos: photoPool.jewellery,
    items: [
      { name: 'Floating Gold Vein Crescent Resin Necklace', price: 949, orig: 1399, disc: 32, desc: 'Striking crescent moon pendant cast in alabaster resin laced with veins of molten gold leaf on box chain.' },
      { name: 'Vintage Botanical Wildflower Resin Locket Necklace', price: 999, orig: 1499, disc: 33, desc: 'Antique-style oval brass locket with a crystal-clear resin window revealing dried lavender and gold leaf.' },
      { name: 'Sunset Amber Resin Bar Necklace', price: 899, orig: 1299, disc: 31, desc: 'Horizontal floating bar necklace with amber translucency and warm bronze foils.' },
      { name: 'Triple Gem Floral Resin Layering Necklace', price: 1099, orig: 1599, disc: 31, desc: 'Three delicate resin pendants graduated in size holding pressed forget-me-not petals.' },
      { name: 'Raw Quartz Crystal Shard Resin Choker', price: 979, orig: 1399, disc: 30, desc: 'Modern minimalist choker with a single resin-encapsulated raw quartz stone.' },
      { name: 'Ocean Coral & Turquoise Bead Resin Necklace', price: 1049, orig: 1499, disc: 30, desc: 'Poured resin disc mimicking coral reef waters paired with freshwater pearls.' },
      { name: 'Geometric Triangle 24K Leaf Resin Necklace', price: 879, orig: 1249, disc: 30, desc: 'Contemporary minimalist triangle charm drenched in pure gold leafing.' },
      { name: 'Pressed Four-Leaf Clover Luck Resin Necklace', price: 929, orig: 1299, disc: 28, desc: 'Genuine rare four-leaf clover preserved inside a circular glass-smooth resin amulet.' },
      { name: 'Emerald Velvet Mica Ribbon Resin Necklace', price: 999, orig: 1449, disc: 31, desc: 'Deep forest green shimmering liquid resin framed in a dainty bezel setting.' },
      { name: 'Midnight Celestial Constellation Resin Bar', price: 949, orig: 1349, disc: 30, desc: 'Horizontal bar carrying the Ursa Major constellation depicted in silver stars and blue resin.' },
      { name: 'Blush Pearl Resin Medallion Necklace', price: 899, orig: 1299, disc: 31, desc: 'Soft pastel pink pearlescent shimmer set on a diamond-cut cable chain.' },
      { name: 'Botanical Eucalyptus & Gold Flake Necklace', price: 919, orig: 1319, disc: 30, desc: 'Aromatic eucalyptus leaf cutting encapsulated with floating 24K leaf flakes.' },
      { name: 'Calacatta Hexagon Choker Resin Necklace', price: 969, orig: 1389, disc: 30, desc: 'Geometric white marble hexagon with gold veins on a modern rigid gold collar.' },
      { name: 'Scarlet Rose Diamond Cut Resin Necklace', price: 949, orig: 1349, disc: 30, desc: 'Faceted resin teardrop catching reflections around vibrant preserved rose petals.' },
    ]
  },
  {
    category: 'Pressed Flower Resin Jewellery',
    prefix: 'RA-PF',
    photos: photoPool.jewellery,
    items: [
      { name: 'Preserved Red Rose Petal Faceted Resin Ring', price: 499, orig: 699, disc: 29, desc: 'An actual red rose petal preserved forever inside a multifaceted crystal clear resin band with 24K gold dust.' },
      { name: 'Forget-Me-Not Botanical Resin Charm Bracelet', price: 749, orig: 999, disc: 25, desc: 'Dainty charm bracelet carrying five bezel-set resin droplets with authentic azure blue forget-me-not flowers.' },
      { name: 'Dried Fern Leaf Geometric Resin Brooch', price: 599, orig: 799, disc: 25, desc: 'Lush green botanical fern frond set into an elegant gold-rimmed lapel pin brooch.' },
      { name: 'Daisy Blossom Resin Hairpin Set of 2', price: 449, orig: 599, disc: 25, desc: 'Real white miniature daisies frozen in clear round resin cabochons on gold bobby pins.' },
      { name: 'Lavender & Gold Leaf Statement Resin Ring', price: 549, orig: 749, disc: 27, desc: 'Chunky clear resin dome holding fragrant dried purple lavender petals and gold leaf.' },
      { name: 'Cornflower Petal Resin Cuff Bracelet', price: 899, orig: 1249, disc: 28, desc: 'Open cuff bracelet encasing hundreds of tiny bright blue cornflower petals.' },
      { name: 'White Queen Anne Lace Floral Resin Ring', price: 499, orig: 699, disc: 29, desc: 'Delicate lace-like wild carrot flower umbrella preserved in a clear faceted band.' },
      { name: 'Marigold & Calendula Resin Drop Earrings', price: 649, orig: 899, disc: 28, desc: 'Warm orange calendula petals encased in crystal teardrops on gold hooks.' },
      { name: 'Wild Violet & Silver Flake Resin Bangle', price: 799, orig: 1099, disc: 27, desc: 'Pressed wild woodland violets with sparkling silver flakes in an easy-slip wrist bangle.' },
      { name: 'Cherry Blossom Petal Resin Ring', price: 529, orig: 729, disc: 27, desc: 'Soft pastel pink sakura cherry petals preserved with faint gold mica shimmer.' },
      { name: 'Mixed Meadow Flower Resin Locket', price: 849, orig: 1199, disc: 29, desc: 'Collage of wild meadow blossoms encapsulated together in a vintage gold pendant.' },
      { name: 'Baby Breath Botanical Resin Bar Hair Clip', price: 429, orig: 579, disc: 26, desc: 'Alligator style hair clip with a clear resin bar holding white baby’s breath.' },
      { name: 'Pressed Jasmine Bloom Resin Cocktail Ring', price: 549, orig: 769, disc: 29, desc: 'Pure white night-blooming jasmine petal encapsulated in high-dome optical resin.' },
      { name: 'Autumn Ginkgo Leaf Resin Brooch Pin', price: 629, orig: 849, disc: 26, desc: 'Golden yellow miniature ginkgo biloba leaf preserved in organic leaf shape.' },
    ]
  },
  {
    category: 'Gold Flake Resin Jewellery',
    prefix: 'RA-GF',
    photos: photoPool.jewellery,
    items: [
      { name: 'Liquid Gold Foil Geometric Resin Bangle', price: 799, orig: 1099, disc: 27, desc: 'Substantial yet lightweight resin bangle wristlet laden with dense suspended 24K gold leaf flakes.' },
      { name: 'Champagne Gold Flake Statement Cocktail Ring', price: 549, orig: 749, disc: 27, desc: 'A bold, dome-shaped statement cocktail ring filled with floating champagne gold flakes and raw quartz shimmer.' },
      { name: '24K Gilded Flake Resin Cuff Bracelet', price: 899, orig: 1299, disc: 31, desc: 'Modern open cuff style bracelet filled with thick clusters of imitation gold foil.' },
      { name: 'Gold Leaf & Black Onyx Dual Resin Ring', price: 529, orig: 729, disc: 27, desc: 'Split design featuring solid black resin on one half and clear gold leaf on the other.' },
      { name: 'Gold Dust Spherical Stud Resin Earrings', price: 449, orig: 599, disc: 25, desc: 'Tiny sphere studs packed with fine micro-fine 24K gold powder and optical resin.' },
      { name: 'Molten Gold Vein Resin Chunky Bangle', price: 849, orig: 1199, disc: 29, desc: 'Wide statement bangle featuring hand-painted flowing veins of metallic gold leaf.' },
      { name: 'Gold Foil Oval Statement Hair Barrettes (Set of 2)', price: 499, orig: 699, disc: 29, desc: 'Set of 2 snap barrettes in crystal clear resin packed with sparkling gold foil.' },
      { name: 'Champagne Flake & Pearl Double Ring', price: 579, orig: 799, disc: 28, desc: 'Two-finger style ring with gold leaf flakes and floating freshwater seed pearls.' },
      { name: 'Gold Leaf Faceted Prism Resin Pendant', price: 749, orig: 1049, disc: 29, desc: 'Multi-faceted crystal prism catching light from every angle with interior gold flakes.' },
      { name: 'Rose Gold & Copper Flake Resin Bangle', price: 789, orig: 1089, disc: 28, desc: 'Warm tricolor metallic blend combining yellow gold, rose gold, and copper foil.' },
      { name: '24K Gold Flake Collar Torque Resin Choker', price: 999, orig: 1449, disc: 31, desc: 'Rigid curved neck choker terminating in two gold-flake resin spheres.' },
      { name: 'Golden Swirl Asymmetric Resin Ear Jackets', price: 599, orig: 829, disc: 28, desc: 'Contemporary two-part earrings with front gold studs and back resin jacket.' },
      { name: 'High-Gloss Gold Foil Signet Resin Ring', price: 529, orig: 729, disc: 27, desc: 'Modern flat-top signet ring profile cast in optical resin with dense gold leaf.' },
      { name: 'Gold Dust Curved Hair Comb Clip', price: 589, orig: 799, disc: 26, desc: 'Bridal hair side comb topped with a curved resin bar containing floating gold foil.' },
    ]
  },
  {
    category: 'Custom Resin Gifts',
    prefix: 'RA-CG',
    photos: photoPool.gifts,
    items: [
      { name: 'Bridal Varmala & Garland Preservation Resin Clock', price: 3499, orig: 4499, disc: 22, desc: 'Preserve your precious wedding jaimala / varmala flowers forever in a luxury 12-inch functional resin wall clock with gold numerals.' },
      { name: 'Illuminated Couple Photo & Floral Resin Memory Frame', price: 1899, orig: 2499, disc: 24, desc: 'Encase your favorite memory in glass-like clarity with archival photo encapsulation, preserved flowers, and solid beechwood LED base.' },
      { name: 'Luxury Resin Ring Platter with Raw Quartz Crystals', price: 2199, orig: 2899, disc: 24, desc: 'An ethereal ring tray designed for engagement ceremonies with pearl resin body, couple names, and gold gilded edges.' },
      { name: 'Baby First Keepsake Resin Block with Hospital Band', price: 1699, orig: 2299, disc: 26, desc: 'Preserves baby birth hospital tag, first lock of hair, and name/date in clear resin display.' },
      { name: 'Custom Wedding Vow & Rose Petal Resin Plaque', price: 2499, orig: 3299, disc: 24, desc: 'Your full marriage vows inscribed in gold acrylic alongside preserved wedding rose petals.' },
      { name: 'Anniversary Memory Resin Photo Block (No LED)', price: 1399, orig: 1899, disc: 26, desc: 'Thick freestanding 6" x 4" resin photo block with dried baby’s breath and gold leaf.' },
      { name: 'Pet Memorial Resin Paw Print Keepsake Block', price: 1499, orig: 1999, disc: 25, desc: 'Memorial tribute preserving pet fur snippet, photo, and customized name in glowing resin.' },
      { name: 'Personalized Spotify Music Plaque with Resin Stand', price: 1299, orig: 1799, disc: 28, desc: 'Acrylic photo plaque paired with a hand-poured gold foil resin pedestal stand.' },
      { name: 'Wedding Garland Hexagon Preservation Display', price: 2899, orig: 3799, disc: 24, desc: 'Deep 8-inch hexagon casting showcasing wedding flowers in 3D multi-level floral arrangement.' },
      { name: 'Custom Corporate Logo & Milestone Resin Trophy', price: 2199, orig: 2999, disc: 27, desc: 'Prestigious handcrafted acrylic and resin award block customized with company emblem.' },
      { name: 'Graduation Cap Floral Preservation Block', price: 1599, orig: 2199, disc: 27, desc: 'Preserves graduation tassel, diploma snippet, and celebration flowers forever.' },
      { name: 'Family Tree Photo & Gold Flake Resin Plaque', price: 2699, orig: 3599, disc: 25, desc: 'Multi-photo display plaque celebrating grandparents and multi-generational families.' },
      { name: 'Bespoke Engagement Ring Dish with Initials', price: 899, orig: 1249, disc: 28, desc: 'Miniature geode dish with personalized couple monogram for dressing table.' },
      { name: 'Bridal Floral Preservation Keepsake Paperweight', price: 999, orig: 1399, disc: 29, desc: 'Faceted resin diamond paperweight holding a single whole dried wedding rose.' },
    ]
  },
  {
    category: 'Handmade Resin Accessories',
    prefix: 'RA-HA',
    photos: photoPool.accessories,
    items: [
      { name: 'Gilded Geode Agate Resin Coaster Set of 4', price: 1199, orig: 1599, disc: 25, desc: 'Set of 4 luxury handmade geode coasters poured with pearlescent mica and hand-painted liquid gold edges with non-slip feet.' },
      { name: '3D Ocean Waves & Gold Foil Agate Resin Name Plate', price: 2799, orig: 3699, disc: 24, desc: 'Grand entrance statement plate with multilayered turquoise ocean waves, natural sea foam cells, and mirror-gold 3D acrylic family name.' },
      { name: 'Acacia Wood & Emerald Fluid Resin Serving Tray', price: 2499, orig: 3299, disc: 24, desc: 'Natural solid acacia wood serving tray with an inlaid river of deep emerald fluid art resin and antique brass handles.' },
      { name: 'Calacatta Marble & Gold Vein House Name Plate', price: 2499, orig: 3299, disc: 24, desc: 'Faux Italian marble aesthetic in liquid resin with delicate champagne gold veins and family surname.' },
      { name: 'Luxury Resin Bookmark with Gold Foil & Silk Tassel', price: 299, orig: 449, disc: 33, desc: 'Slim crystal resin reading bookmark with pressed flowers, floating gold leaf, and silk cord.' },
      { name: 'Geode Agate Resin Vanity Trinket Tray', price: 999, orig: 1399, disc: 29, desc: 'Decorative dresser tray for perfumes, rings, and watches with raw crystal texture.' },
      { name: 'Ocean Beach Resin Wine Bottle Stopper', price: 499, orig: 699, disc: 29, desc: 'Stainless steel bottle stopper capped with a miniature ocean wave resin globe.' },
      { name: 'Botanical Pressed Floral Resin Compact Mirror', price: 649, orig: 899, disc: 28, desc: 'Pocket compact mirror with dual magnification and a gorgeous floral resin lid.' },
      { name: 'Hexagonal Geode Coasters Set of 6 with Holder', price: 1699, orig: 2299, disc: 26, desc: 'Set of 6 hexagonal resin coasters complete with a custom matching resin cradle stand.' },
      { name: 'Ocean Shoreline Resin Wall Clock (14")', price: 3199, orig: 4199, disc: 24, desc: 'Large 14-inch wall clock featuring high-depth ocean waves crashing over natural wood.' },
      { name: 'Gold Rimmed Agate Resin Bookends (Pair)', price: 1899, orig: 2599, disc: 27, desc: 'Heavy solid resin bookends cast in geode slice profile to support favorite books.' },
      { name: 'Floral Botanical Resin Phone Pop Grip Stand', price: 349, orig: 499, disc: 30, desc: 'Collapsible phone grip topped with a real pressed daisy in durable UV resin.' },
      { name: 'Ocean Resin Charcuterie & Cheese Serving Board', price: 2199, orig: 2899, disc: 24, desc: 'Solid teakwood cutting and serving board with resin wave art on handle.' },
      { name: 'Midnight Black & Gold Leaf Trinket Bowl', price: 799, orig: 1099, disc: 27, desc: 'Small decorative curved bowl for keys and coins with rich black and gold luster.' },
    ]
  }
];

const allProducts = [];
let globalIndex = 1;

categoryDefinitions.forEach((def, catIdx) => {
  def.items.forEach((item, itemIdx) => {
    const skuNum = String(itemIdx + 1).padStart(3, '0');
    const id = `prod-ra-${catIdx + 1}-${itemIdx + 1}`;
    const sku = `${def.prefix}-${skuNum}`;
    const slug = generateSlug(item.name);
    
    // Pick photo deterministically based on index
    const primaryPhoto = def.photos[itemIdx % def.photos.length];
    const secondaryPhoto = def.photos[(itemIdx + 1) % def.photos.length];

    const isBestSeller = itemIdx === 0 || itemIdx === 3;
    const isPopular = itemIdx < 5;
    const isNewArrival = itemIdx % 2 === 1;
    const isFeatured = itemIdx < 3;
    const stock = 8 + ((itemIdx * 7) % 25);
    const reviewCount = 20 + ((itemIdx * 13) % 95);
    const rating = +(4.7 + ((itemIdx % 4) * 0.1)).toFixed(1);

    allProducts.push({
      id,
      sku,
      name: item.name,
      slug,
      price: item.price,
      originalPrice: item.orig,
      discount: item.disc,
      category: def.category,
      description: item.desc,
      details: [
        '100% handcrafted with optical grade UV non-yellowing epoxy resin',
        'Hand-poured in small artisan batches in India',
        'Includes signature ResinAura presentation box & care card',
        'Water-resistant, scratch-resistant high-gloss finish'
      ],
      materials: 'Artisan cast epoxy resin, 24K imitation gold leaf, preserved botanicals',
      dimensions: 'Standard handcrafted boutique dimensions',
      images: [primaryPhoto, secondaryPhoto],
      stock,
      status: 'active',
      isBestSeller,
      isPopular,
      isNewArrival,
      isFeatured,
      rating,
      reviewCount,
      createdAt: new Date(Date.now() - (globalIndex * 86400000 * 2)).toISOString()
    });
    globalIndex++;
  });
});

console.log(`Generated ${allProducts.length} unique resin products across 9 categories.`);

// Write to data/products.json
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const backupFilePath = path.join(dataDir, 'products.backup.json');
fs.writeFileSync(backupFilePath, JSON.stringify(allProducts, null, 2), 'utf-8');
console.log(`Saved ${allProducts.length} products to ${backupFilePath}`);

