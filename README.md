# Portfolio Rebalancer

Stock portfolio management and rebalancing system that helps determine which stocks to buy or sell to maintain target allocations.

## 🎯 Problem Description

**Original Challenge:**

> Construct a simple Portfolio class that has a collection of Stocks. Assume each Stock has a "Current Price" method that receives the last available price. Also, the Portfolio class has a collection of "allocated" Stocks that represents the distribution of the Stocks the Portfolio is aiming (i.e. 40% META, 60% APPL)
> 
> Provide a portfolio rebalance method to know which Stocks should be sold and which ones should be bought to have a balanced Portfolio based on the portfolio's allocation.
> 
> Add documentation/comments to understand your thinking process and solution
> 
> Important: If you use LLMs that's ok, but you must share the conversations.

## 🤖 LLM Usage in Development

I only use LLM for testing, examples and extra documentation, I solve this problem by myself.


**Implemented Solution:**

This project implements a complete solution to the challenge, including:
- ✅ `Stock` class with `currentPrice()` method
- ✅ `Portfolio` class with stock collection and allocations
- ✅ `rebalance()` method that determines what to buy/sell
- ✅ Complete test suite with Node.js test runner
- ✅ Detailed documentation and usage examples
- ✅ Full LLM conversation available in commit history

## 📋 Description

This application allows you to:
- Create and manage a stock portfolio (`Stock`)
- Calculate the total portfolio value
- Determine which stocks to buy or sell based on target allocations
- Visualize rebalancing recommendations

## 🔧 Prerequisites

- **Node.js**: version 18 or higher (for native test runner support)
- **pnpm**: package manager (can be installed with `npm install -g pnpm`)

## 📦 Installation

1. Clone or download this repository

2. Install dependencies:
```bash
pnpm install
```

## 🧪 Running Tests

The project includes a complete test suite using Node.js native test runner:

```bash
pnpm test
```

This will run all tests and show a detailed report of:
- ✅ `Stock` class tests
- ✅ `Portfolio` class tests
- ✅ `totalValue()` method tests
- ✅ `rebalance()` method tests

### Expected output example:
```
# tests 13
# suites 4
# pass 13
# fail 0
```

## 🎮 Try the Application with Examples

To see the application in action with predefined examples:

```bash
pnpm example
```

This command will run the `example.ts` file which shows:
- 3 different portfolio scenarios
- Total value calculations
- Rebalancing recommendations
- Formatted output with emojis and colors

## 💻 Application Usage

### Creating Stocks

```typescript
import { Stock } from './index.js';

const apple = new Stock('AAPL', 150);  // symbol, price
apple.shares = 10;  // number of shares

const google = new Stock('GOOGL', 2800);
google.shares = 5;
```

### Creating a Portfolio

```typescript
import { Portfolio } from './index.js';

// Define target allocations (must sum to 1.0)
const allocations = new Map<string, number>([
  ['AAPL', 0.4],   // 40% of portfolio
  ['GOOGL', 0.6]   // 60% of portfolio
]);

const portfolio = new Portfolio([apple, google], allocations);
```

### Calculate Total Value

```typescript
const totalValue = portfolio.totalValue();
console.log(`Total portfolio value: $${totalValue}`);
// Output: Total portfolio value: $15500
```

### Rebalance Portfolio

```typescript
const results = portfolio.rebalance();

// The method automatically prints the results:
// === Portfolio Rebalancing Results ===
// 📈 You should buy more AAPL stocks
// 📉 You should sell GOOGL stocks
// =====================================

// You can also use the returned Map programmatically:
for (const [symbol, shouldSell] of results) {
  if (shouldSell) {
    console.log(`Sell ${symbol}`);
  } else {
    console.log(`Buy ${symbol}`);
  }
}
```

## 📁 Project Structure

```
fintual-task/
├── index.ts           # Stock and Portfolio classes
├── index.test.ts      # Complete test suite
├── example.ts         # Application usage examples
├── package.json       # Project configuration
└── README.md          # This file
```

## 🎯 Rebalancing Logic

The `rebalance()` method calculates:

1. **Total Portfolio Value**: Sum of all stock values
2. **Target Value per Stock**: `total_value × target_allocation`
3. **Buy/Sell Decision**:
   - If `current_price > target_value` → **SELL** (overrepresented)
   - If `current_price < target_value` → **BUY** (underrepresented)

### Numerical Example

Portfolio with:
- AAPL: 10 shares × $150 = $1,500
- GOOGL: 5 shares × $2,800 = $14,000
- **Total**: $15,500

Target allocations:
- AAPL: 40% → Target = $6,200
- GOOGL: 60% → Target = $9,300

Results:
- AAPL: $150 < $6,200 → **BUY** ✅
- GOOGL: $2,800 < $9,300 → **BUY** ✅

## 🛠️ Technologies Used

- **TypeScript**: Primary language
- **Node.js Test Runner**: Native testing system (node:test)
- **tsx**: TypeScript runner for development
- **pnpm**: Package manager

## 📝 Additional Notes

- Tests verify edge cases like empty portfolios and stocks without allocation
- The `printResults()` method runs automatically when calling `rebalance()`
- Allocations must be defined as decimals (0.4 = 40%)
- Stocks without defined allocation are ignored during rebalancing

## 🐛 Troubleshooting

### Error: "listen EPERM: operation not permitted"
If you get this error when running tests, it's a sandbox permission issue. The command should automatically run with full permissions.

### Tests won't run
Verify you have Node.js 18+ installed:
```bash
node --version
```

---

Questions or issues? Check the tests in `index.test.ts` for detailed usage examples.
