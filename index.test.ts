import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Stock, Portfolio } from './index.js';

describe('Stock', () => {
  it('should create a stock with symbol and price', () => {
    const stock = new Stock('AAPL', 150);
    
    assert.strictEqual(stock.symbol, 'AAPL');
    assert.strictEqual(stock.currentPrice(), 150);
  });

  it('should return current price', () => {
    const stock = new Stock('GOOGL', 2800);
    
    assert.strictEqual(stock.currentPrice(), 2800);
  });

  it('should allow setting shares', () => {
    const stock = new Stock('MSFT', 300);
    stock.shares = 10;
    
    assert.strictEqual(stock.shares, 10);
  });
});

describe('Portfolio', () => {
  let stock1: Stock;
  let stock2: Stock;
  let stock3: Stock;

  beforeEach(() => {
    stock1 = new Stock('AAPL', 150);
    stock1.shares = 10;

    stock2 = new Stock('GOOGL', 2800);
    stock2.shares = 5;

    stock3 = new Stock('MSFT', 300);
    stock3.shares = 20;
  });

  describe('totalValue', () => {
    it('should calculate total value of empty portfolio', () => {
      const allocations = new Map<string, number>();
      const portfolio = new Portfolio([], allocations);
      
      assert.strictEqual(portfolio.totalValue(), 0);
    });

    it('should calculate total value of portfolio with one stock', () => {
      const allocations = new Map<string, number>([['AAPL', 1.0]]);
      const portfolio = new Portfolio([stock1], allocations);
      
      // Expected: 150 * 10 = 1500
      assert.strictEqual(portfolio.totalValue(), 1500);
    });

    it('should calculate total value of portfolio with multiple stocks', () => {
      const allocations = new Map<string, number>([
        ['AAPL', 0.33],
        ['GOOGL', 0.33],
        ['MSFT', 0.34]
      ]);
      const stocks = [stock1, stock2, stock3];
      const portfolio = new Portfolio(stocks, allocations);
      
      // Expected: (150 * 10) + (2800 * 5) + (300 * 20) = 1500 + 14000 + 6000 = 21500
      assert.strictEqual(portfolio.totalValue(), 21500);
    });
  });

  describe('rebalance', () => {
    it('should return empty map for empty portfolio', () => {
      const allocations = new Map<string, number>();
      const portfolio = new Portfolio([], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 0);
    });

    it('should indicate sell when stock price is higher than target value', () => {
      // Setup: stock con precio alto comparado con el target
      // Total portfolio value: 1500
      // Target para AAPL: 1500 * 1.0 = 1500
      // Precio actual de AAPL: 150
      // Como 150 < 1500, NO debería vender (shouldSell = false)
      
      const allocations = new Map<string, number>([['AAPL', 1.0]]);
      const portfolio = new Portfolio([stock1], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 1);
      assert.strictEqual(result.get('AAPL'), false); // precio < target, no vender
    });

    it('should indicate buy when stock price is lower than target value', () => {
      // Setup: crear un stock donde el precio sea menor que el valor target
      const smallStock = new Stock('AAPL', 100);
      smallStock.shares = 10; // Valor actual: 100 * 10 = 1000
      
      const largeStock = new Stock('GOOGL', 2000);
      largeStock.shares = 10; // Valor actual: 2000 * 10 = 20000
      
      // Total portfolio value: 21000
      // Target para AAPL: 21000 * 0.5 = 10500
      // Precio de AAPL: 100
      // Como 100 < 10500, NO debería vender (shouldSell = false)
      
      // Target para GOOGL: 21000 * 0.5 = 10500
      // Precio de GOOGL: 2000
      // Como 2000 < 10500, NO debería vender (shouldSell = false)
      
      const allocations = new Map<string, number>([
        ['AAPL', 0.5],
        ['GOOGL', 0.5]
      ]);
      const portfolio = new Portfolio([smallStock, largeStock], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 2);
      assert.strictEqual(result.get('AAPL'), false); // precio < target, comprar
      assert.strictEqual(result.get('GOOGL'), false); // precio < target, comprar
    });

    it('should correctly identify stocks to sell when overallocated', () => {
      // Setup: stock con precio MAYOR que el valor target
      const expensiveStock = new Stock('TSLA', 60000);
      expensiveStock.shares = 1; // Valor actual: 60000
      
      const cheapStock = new Stock('F', 10);
      cheapStock.shares = 1; // Valor actual: 10
      
      // Total portfolio value: 60010
      // Target para TSLA: 60010 * 0.5 = 30005
      // Precio de TSLA: 60000
      // Como 60000 > 30005, debería vender (shouldSell = true)
      
      // Target para F: 60010 * 0.5 = 30005
      // Precio de F: 10
      // Como 10 < 30005, NO debería vender (shouldSell = false)
      
      const allocations = new Map<string, number>([
        ['TSLA', 0.5],
        ['F', 0.5]
      ]);
      const portfolio = new Portfolio([expensiveStock, cheapStock], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 2);
      assert.strictEqual(result.get('TSLA'), true); // precio > target, vender
      assert.strictEqual(result.get('F'), false); // precio < target, comprar
    });

    it('should handle multiple stocks with different allocations', () => {
      const stockA = new Stock('A', 5000);
      stockA.shares = 2; // Valor: 10000
      
      const stockB = new Stock('B', 100);
      stockB.shares = 50; // Valor: 5000
      
      const stockC = new Stock('C', 10);
      stockC.shares = 100; // Valor: 1000
      
      // Total: 16000
      // Target A: 16000 * 0.6 = 9600, precio A: 5000, 5000 > 9600? No -> false (comprar)
      // Target B: 16000 * 0.3 = 4800, precio B: 100, 100 > 4800? No -> false (comprar)
      // Target C: 16000 * 0.1 = 1600, precio C: 10, 10 > 1600? No -> false (comprar)
      
      const allocations = new Map<string, number>([
        ['A', 0.6],
        ['B', 0.3],
        ['C', 0.1]
      ]);
      const portfolio = new Portfolio([stockA, stockB, stockC], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 3);
      assert.strictEqual(result.get('A'), false);
      assert.strictEqual(result.get('B'), false);
      assert.strictEqual(result.get('C'), false);
    });

    it('should only include stocks with allocations defined', () => {
      const stock1 = new Stock('AAPL', 150);
      stock1.shares = 10;
      
      const stock2 = new Stock('GOOGL', 2800);
      stock2.shares = 5;
      
      // Solo AAPL tiene allocation definida
      const allocations = new Map<string, number>([
        ['AAPL', 1.0]
      ]);
      const portfolio = new Portfolio([stock1, stock2], allocations);
      
      const result = portfolio.rebalance();
      
      // Solo debe incluir AAPL en el resultado
      assert.strictEqual(result.size, 1);
      assert.ok(result.has('AAPL'));
      assert.ok(!result.has('GOOGL'));
    });

    it('should handle edge case with equal price and target', () => {
      const stock = new Stock('EVEN', 1000);
      stock.shares = 10; // Valor: 10000
      
      // Total: 10000
      // Target: 10000 * 1.0 = 10000
      // Precio: 1000
      // Como 1000 < 10000, NO debería vender (shouldSell = false)
      
      const allocations = new Map<string, number>([['EVEN', 1.0]]);
      const portfolio = new Portfolio([stock], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 1);
      assert.strictEqual(result.get('EVEN'), false);
    });
  });
});
