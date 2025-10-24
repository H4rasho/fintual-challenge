/**
 * Stock Class
 * 
 * Represents a single stock with a symbol, price, and number of shares.
 * 
 * Design decisions:
 * - Price is private to encapsulate the data and provide controlled access via currentPrice()
 * - Symbol and shares are public for easy access in portfolio calculations
 * - currentPrice() method as specified in the requirements to get the last available price
 */
export class Stock 
{
  public symbol: string;
  private price: number;
  public shares: number;

  /**
   * Creates a new Stock instance
   * @param symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
   * @param price - Current price per share
   */
  constructor(symbol: string, price: number) {
    this.symbol = symbol;
    this.price = price;
  }

  /**
   * Returns the current price of the stock
   * As specified in requirements: "Current Price" method that receives the last available price
   * @returns The current price per share
   */
  currentPrice() {
    return this.price;
  }
  
}

/**
 * Portfolio Class
 * 
 * Manages a collection of stocks with target allocations and provides rebalancing logic.
 * 
 * Design decisions:
 * - Uses Map<string, number> for allocations to efficiently lookup target percentages by symbol
 * - Allocations are expressed as decimals (0.4 = 40%, 0.6 = 60%)
 * - rebalance() returns a Map for programmatic use and also prints results for UX
 * 
 * Rebalancing Logic:
 * The algorithm compares the current price per share against the target value per share:
 * 1. Calculate total portfolio value (sum of all stock values)
 * 2. For each stock, calculate target value = total portfolio value × allocation percentage
 * 3. Compare stock's current price with its target value:
 *    - If currentPrice > targetValue → Stock is overrepresented → SELL
 *    - If currentPrice < targetValue → Stock is underrepresented → BUY
 */
export class Portfolio 
{
  private stocks: Stock[] = []
  private allocations: Map<string, number> = new Map();

  /**
   * Creates a new Portfolio instance
   * @param stocks - Array of Stock instances in the portfolio
   * @param allocations - Map of stock symbols to target allocation percentages (must sum to 1.0)
   *                      Example: Map([['AAPL', 0.4], ['GOOGL', 0.6]]) means 40% AAPL, 60% GOOGL
   */
  constructor(stocks: Stock[], allocations: Map<string, number>) {
    this.stocks = stocks;
    this.allocations = allocations;
  }

  /**
   * Calculates the total current value of the portfolio
   * Formula: Sum of (stock price × number of shares) for all stocks
   * @returns Total portfolio value in dollars
   */
  totalValue() {
    return this.stocks.reduce((acc, stock) => acc + stock.currentPrice() * stock.shares, 0);
  }

  /**
   * Determines which stocks should be bought or sold to achieve target allocations
   * 
   * Algorithm:
   * 1. Calculate total portfolio value
   * 2. For each stock, calculate its target value based on allocation percentage
   * 3. Compare current price per share vs target value per share:
   *    - If price > target: Stock is overvalued relative to allocation → SELL
   *    - If price < target: Stock is undervalued relative to allocation → BUY
   * 
   * @returns Map<symbol, shouldSell> where:
   *          - true = stock should be sold (overallocated)
   *          - false = stock should be bought (underallocated)
   */
  rebalance() {
    // Step 1: Get total portfolio value
    const totalValue = this.totalValue()
    
    // Step 2: Calculate target value for each stock based on allocation
    const targetDistribution = new Map<string, number>
    const shoudBeSellStock = new Map<string, boolean>

    // Calculate target value = total portfolio value × allocation percentage
    for (const stock of this.stocks) {
      const stockTargetDistribution = this.allocations.get(stock.symbol)
      if (!stockTargetDistribution) continue; // Skip stocks without allocation defined
      targetDistribution.set(stock.symbol, totalValue * stockTargetDistribution)
    }

    // Step 3: Determine buy/sell action by comparing current price with target value
    for (const stock of this.stocks){
      const targetValue = targetDistribution.get(stock.symbol);
      if(!targetValue) continue; // Skip if no target defined
      
      // Key logic: If current price > target value, the stock is overrepresented → SELL
      //            If current price < target value, the stock is underrepresented → BUY
      const shouldSell = stock.currentPrice() > targetValue
      shoudBeSellStock.set(stock.symbol, shouldSell)
    }
    
    // Print results for user visibility
    this.printResults(shoudBeSellStock)
    
    // Return Map for programmatic access
    return shoudBeSellStock;
  }

  /**
   * Prints the rebalancing results to console in a user-friendly format
   * @param results - Map of stock symbols to buy/sell decisions
   */
  private printResults(results: Map<string, boolean>) {
    if (results.size === 0) {
      console.log('No rebalancing actions needed.');
      return;
    }

    console.log('\n=== Portfolio Rebalancing Results ===');
    
    for (const [symbol, shouldSell] of results) {
      if (shouldSell) {
        console.log(`📉 You should sell ${symbol} stocks`);
      } else {
        console.log(`📈 You should buy more ${symbol} stocks`);
      }
    }
    
    console.log('=====================================\n');
  }
  
}