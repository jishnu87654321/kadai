import fs from 'fs';

const url = 'https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=13.097004&lng=77.575024&restaurantId=340183&catalog_qa=undefined&submitAction=ENTER';

fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  }
})
.then(r => {
  if (!r.ok) {
    throw new Error("HTTP error " + r.status);
  }
  return r.json();
})
.then(data => {
  const cards = data?.data?.cards || [];
  let menuCard = null;
  for (let c of cards) {
    if (c?.groupedCard?.cardGroupMap?.REGULAR) {
      menuCard = c.groupedCard.cardGroupMap.REGULAR.cards;
    }
  }
  
  if (!menuCard) {
    console.error("Could not find menu items");
    process.exit(1);
  }

  const dishes = [];
  let idCounter = 1;

  for (const c of menuCard) {
    const card = c.card?.card;
    if (card && card.itemCards) {
      const category = card.title;
      for (const ic of card.itemCards) {
        const info = ic.card.info;
        const name = info.name;
        const price = info.price || info.defaultPrice;
        const desc = info.description || "Delicious dish prepared by our expert chefs.";
        const isVeg = info.isVeg ? true : false;
        
        dishes.push({
          id: idCounter++,
          name: name,
          category: category,
          desc: desc,
          price: '₹' + (price / 100).toString(),
          veg: isVeg,
          spicy: name.toLowerCase().includes('chilly') || name.toLowerCase().includes('pepper') || name.toLowerCase().includes('masala') || name.toLowerCase().includes('guntur'),
          chef: info.isBestseller || false,
          keywords: name.toLowerCase().split(' ').concat(category.toLowerCase().split(' '))
        });
      }
    }
  }

  const tsContent = `export const allDishes = ${JSON.stringify(dishes, null, 2)};\n`;
  fs.writeFileSync('c:\\Users\\admin\\Downloads\\kadai (2)\\kadai\\src\\dishes.ts', tsContent);
  console.log(`Successfully parsed ${dishes.length} dishes and saved to dishes.ts`);
})
.catch(err => {
  console.error("Fetch failed", err);
  process.exit(1);
});
