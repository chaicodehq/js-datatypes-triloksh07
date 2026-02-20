/**
 * 🏏 IPL Auction Purse Manager
 *
 * IPL mega auction chal rahi hai! Team ka total purse (budget) diya hai
 * aur players ki list di hai jinhe khareedna hai. Tujhe calculate karna
 * hai ki team ne kitna spend kiya, kitna bacha, aur kuch stats banana hai.
 *
 * Rules:
 *   - team object: { name: "CSK", purse: 9000 } (purse in lakhs)
 *   - players array: [{ name: "Dhoni", role: "wk", price: 1200 }, ...]
 *   - role can be: "bat", "bowl", "ar" (all-rounder), "wk" (wicketkeeper)
 *   - Calculate:
 *     - totalSpent: sum of all player prices (use reduce)
 *     - remaining: purse - totalSpent
 *     - playerCount: total players bought
 *     - costliestPlayer: player object with highest price
 *     - cheapestPlayer: player object with lowest price
 *     - averagePrice: Math.round(totalSpent / playerCount)
 *     - byRole: object counting players per role using reduce
 *       e.g., { bat: 3, bowl: 4, ar: 2, wk: 1 }
 *     - isOverBudget: boolean, true agar totalSpent > purse
 *   - Hint: Use reduce(), filter(), sort(), find(), every(), some(),
 *     Array.isArray(), Math.round(), spread operator
 *
 * Validation:
 *   - Agar team object nahi hai ya team.purse positive number nahi hai, return null
 *   - Agar players array nahi hai ya empty hai, return null
 *
 * @param {{ name: string, purse: number }} team - Team info with budget
 * @param {Array<{ name: string, role: string, price: number }>} players
 * @returns {{ teamName: string, totalSpent: number, remaining: number, playerCount: number, costliestPlayer: object, cheapestPlayer: object, averagePrice: number, byRole: object, isOverBudget: boolean } | null}
 *
 * @example
 *   iplAuctionSummary(
 *     { name: "CSK", purse: 9000 },
 *     [{ name: "Dhoni", role: "wk", price: 1200 }, { name: "Jadeja", role: "ar", price: 1600 }]
 *   )
 *   // => { teamName: "CSK", totalSpent: 2800, remaining: 6200, playerCount: 2,
 *   //      costliestPlayer: { name: "Jadeja", role: "ar", price: 1600 },
 *   //      cheapestPlayer: { name: "Dhoni", role: "wk", price: 1200 },
 *   //      averagePrice: 1400, byRole: { wk: 1, ar: 1 }, isOverBudget: false }
 *
 *   iplAuctionSummary({ name: "RCB", purse: 500 }, [{ name: "Kohli", role: "bat", price: 1700 }])
 *   // => { ..., remaining: -1200, isOverBudget: true }
 */
export function iplAuctionSummary(team, players) {
  // if (typeof team !== "object" || typeof team.purse !== "number") return null;
  if (team === null || typeof team !== "object" || !team.purse || Number.isNaN(team.purse) || team.purse <= 0) return null;
  if (!Array.isArray(players) || players.length <= 0) return null;

  // Basic Calculations
  const teamName = team.name;
  const totalSpent = players.reduce((acc, { price }) => (acc + price), 0);
  const remaining = team.purse - totalSpent;
  const playerCount = players.length;
  const averagePrice = Math.round(totalSpent / playerCount);

  // Player stats
  const costliestPlayer = players.reduce((acc, { name, role, price }) => {
    if (price > acc.price) return { name, role, price };
    return acc;
  }, { name: null, role: null, price: -Infinity });

  const cheapestPlayer = players.reduce((acc, { name, role, price }) => {
    if (price < acc.price) return { name, role, price };
    return acc;
  }, { name: null, role: null, price: Infinity });

  // let bat = 0;
  // let bowl = 0;
  // let wk = 0;
  // let ar = 0;

  // Role grouping
  const byRole = players.reduce((acc, { role }) => {
    if (role === "bat") {
      if (!Object.hasOwn(acc, "bat")) (acc.bat = 1)
      else {
        acc.bat++;
      };
    }
    if (role === "bowl") {
      if (!Object.hasOwn(acc, "bowl")) (acc.bowl = 1)
      else {
        acc.bowl++;
      };
    }
    if (role === "wk") {
      if (!Object.hasOwn(acc, "wk")) (acc.wk = 1)
      else {
        acc.wk++;
      };
    }
    if (role === "ar") {
      if (!Object.hasOwn(acc, "ar")) (acc.ar = 1)
      else {
        acc.ar++;
      };
    }
    return acc;
  }, {});


  // Budget Check
  const isOverBudget = totalSpent > team.purse ? true : false;

  return { teamName, totalSpent, remaining, playerCount, costliestPlayer, cheapestPlayer, averagePrice, byRole, isOverBudget };
}
