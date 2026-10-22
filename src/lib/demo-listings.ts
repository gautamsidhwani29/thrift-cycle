export type DemoListing = {
  id: string;
  title: string;
  category: string;
  condition: string;
  disposition: "RESALE" | "DONATION";
  price: number | null;
  city: string;
  emoji: string;
  artwork: string;
  note: string;
};

export const demoListings: DemoListing[] = [
  { id: "linen-shirt", title: "Relaxed linen shirt", category: "Clothing", condition: "Like new", disposition: "RESALE", price: 650, city: "Indiranagar", emoji: "👔", artwork: "from-[#d9e7d9] to-[#b8ceb9]", note: "Soft sage · Size M" },
  { id: "reading-chair", title: "Mid-century reading chair", category: "Home & Living", condition: "Good", disposition: "RESALE", price: 2800, city: "Jayanagar", emoji: "🪑", artwork: "from-[#f1dfc3] to-[#d8b98e]", note: "Solid wood frame" },
  { id: "camera", title: "Film camera, ready to shoot", category: "Electronics", condition: "Good", disposition: "RESALE", price: 3400, city: "Koramangala", emoji: "📷", artwork: "from-[#e9d8d1] to-[#d5afa3]", note: "Includes carry case" },
  { id: "cookbooks", title: "A little cookbook collection", category: "Books", condition: "Good", disposition: "DONATION", price: null, city: "Malleshwaram", emoji: "📚", artwork: "from-[#eee1b9] to-[#d6c687]", note: "Pick up and enjoy" },
  { id: "plant-stand", title: "Handmade wooden plant stand", category: "Home & Living", condition: "Like new", disposition: "RESALE", price: 900, city: "Whitefield", emoji: "🪴", artwork: "from-[#d7e6d5] to-[#acc9a9]", note: "Made for a sunny corner" },
  { id: "backpack", title: "Everyday canvas backpack", category: "Bags", condition: "Good", disposition: "RESALE", price: 500, city: "HSR Layout", emoji: "🎒", artwork: "from-[#d6e0ea] to-[#afc2d6]", note: "Roomy, sturdy, washed" },
  { id: "yoga-mat", title: "Cork yoga mat", category: "Sports & Outdoors", condition: "Like new", disposition: "DONATION", price: null, city: "Indiranagar", emoji: "🧘", artwork: "from-[#e7dcd0] to-[#d2b9a2]", note: "Ready for a new routine" },
  { id: "desk-lamp", title: "Brass-tone desk lamp", category: "Home & Living", condition: "Good", disposition: "RESALE", price: 750, city: "Basavanagudi", emoji: "💡", artwork: "from-[#eee4c8] to-[#d7c48e]", note: "Warm light, working well" },
  { id: "sneakers", title: "Classic canvas sneakers", category: "Clothing", condition: "Fair", disposition: "RESALE", price: 350, city: "JP Nagar", emoji: "👟", artwork: "from-[#e0e4ed] to-[#bec7d9]", note: "Plenty of life left · Size 39" },
  { id: "puzzle", title: "Garden birds jigsaw puzzle", category: "Toys & Games", condition: "Like new", disposition: "DONATION", price: null, city: "Rajajinagar", emoji: "🧩", artwork: "from-[#e8d8e9] to-[#cdb5d0]", note: "500 pieces, complete" },
  { id: "headphones", title: "Over-ear studio headphones", category: "Electronics", condition: "Good", disposition: "RESALE", price: 1200, city: "Electronic City", emoji: "🎧", artwork: "from-[#d8e5e6] to-[#a9c6c6]", note: "Clear sound, tested" },
  { id: "dining-set", title: "Four ceramic side plates", category: "Home & Living", condition: "Good", disposition: "DONATION", price: null, city: "Malleshwaram", emoji: "🍽️", artwork: "from-[#e9d9c6] to-[#d7bea3]", note: "A matching little set" },
];
