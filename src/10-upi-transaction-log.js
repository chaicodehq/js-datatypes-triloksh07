/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) return null;

  // for (let i = 0; i < transactions.length; i++) {
  //   if (transactions[i].amount < 0) return null;
  // }

  const filteredTransaction = transactions.filter(t => (t.amount > 0 && (t.type === "credit" || t.type === "debit")));
  if (filteredTransaction.length === 0) return null;

  // console.log(filteredTransaction);

  const totalCredit = filteredTransaction.filter(t => t.type === "credit").reduce((acc, { amount }) => (acc + amount), 0);
  const totalDebit = filteredTransaction.filter(t => t.type === "debit").reduce((acc, { amount }) => (acc + amount), 0);
  const netBalance = Number(totalCredit - totalDebit);
  const transactionCount = filteredTransaction.length;
  const avgTransaction = Math.round((totalCredit + totalDebit) / transactionCount);
  const highestTransaction = filteredTransaction.reduce((acc, t) => {
    // console.log(acc, t);
    if (t.amount > acc.amount) return { ...t }
    return acc;
  }, { amount: -Infinity });

  const categoryBreakdown = filteredTransaction.reduce((acc, { category, amount }) => {
    if (category in acc) {
      acc[category] += amount;
    } else {
      acc[category] = (acc[category] || 0) + amount;
      // Object.defineProperty(acc, category, {
      //   value: amount,
      //   configurable: true,
      //   enumerable: true,
      //   writable: true,
      // })
    }
    return acc;
  }, {});

  const freqContact = filteredTransaction.reduce((acc, { to }) => {
    if (to in acc) {
      acc[to] += 1;
    } else {
      acc[to] = (acc[to] || 0) + 1;
      // Object.defineProperty(acc, to, {
      //   value: 1,
      //   configurable: true,
      //   enumerable: true,
      //   writable: true,
      // })
    }
    return acc;
  }, {});

  const frequentContact = Object.entries(freqContact).reduce((best, [k, v]) => {
    return v > best[1] ? [k, v] : best;
  }, ["", 0])[0];

  // let frequentContact = "";
  // let prevVal = 0;
  // for (const [k, v] of Object.entries(freqContact)) {
  //   console.log(k, v);
  //   if (v > prevVal) {
  //     frequentContact = k;
  //     prevVal = v;
  //   }
  // }

  const allAbove100 = filteredTransaction.every(t => t.amount > 100);
  const hasLargeTransaction = filteredTransaction.some(t => t.amount >= 5000);

  return { totalCredit, totalDebit, netBalance, transactionCount, avgTransaction, highestTransaction, categoryBreakdown, frequentContact, allAbove100, hasLargeTransaction };
}

const sampleTransactions = [
  { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
  { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
  { id: "T3", type: "debit", amount: 2000, to: "Swiggy", category: "food", date: "2025-01-03" },
  { id: "T4", type: "debit", amount: 1500, to: "Rent", category: "housing", date: "2025-01-05" },
  { id: "T5", type: "credit", amount: 30000, to: "Rahul", category: "refund", date: "2025-01-06" }
];

console.log(analyzeUPITransactions(sampleTransactions))