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
      const allocations = new Map<string, number>([['AAPL', 1.0]]);
      const portfolio = new Portfolio([stock1], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 1);
      assert.strictEqual(result.get('AAPL'), false);
    });

    it('should indicate buy when stock price is lower than target value', () => {
      const smallStock = new Stock('AAPL', 100);
      smallStock.shares = 10;
      
      const largeStock = new Stock('GOOGL', 2000);
      largeStock.shares = 10;
      
      const allocations = new Map<string, number>([
        ['AAPL', 0.5],
        ['GOOGL', 0.5]
      ]);
      const portfolio = new Portfolio([smallStock, largeStock], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 2);
      assert.strictEqual(result.get('AAPL'), false);
      assert.strictEqual(result.get('GOOGL'), true);
    });

    it('should correctly identify stocks to sell when overallocated', () => {
      const expensiveStock = new Stock('TSLA', 60000);
      expensiveStock.shares = 1;
      
      const cheapStock = new Stock('F', 10);
      cheapStock.shares = 1;
      
      const allocations = new Map<string, number>([
        ['TSLA', 0.5],
        ['F', 0.5]
      ]);
      const portfolio = new Portfolio([expensiveStock, cheapStock], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 2);
      assert.strictEqual(result.get('TSLA'), true);
      assert.strictEqual(result.get('F'), false);
    });

    it('should handle multiple stocks with different allocations', () => {
      const stockA = new Stock('A', 100);
      stockA.shares = 50;
      
      const stockB = new Stock('B', 100);
      stockB.shares = 50;
      
      const stockC = new Stock('C', 10);
      stockC.shares = 100;
      
      const allocations = new Map<string, number>([
        ['A', 0.3],
        ['B', 0.5],
        ['C', 0.2]
      ]);
      const portfolio = new Portfolio([stockA, stockB, stockC], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 3);
      assert.strictEqual(result.get('A'), true);
      assert.strictEqual(result.get('B'), false);
      assert.strictEqual(result.get('C'), false);
    });

    it('should only include stocks with allocations defined', () => {
      const stock1 = new Stock('AAPL', 150);
      stock1.shares = 10;
      
      const stock2 = new Stock('GOOGL', 2800);
      stock2.shares = 5;
      
      const allocations = new Map<string, number>([
        ['AAPL', 1.0]
      ]);
      const portfolio = new Portfolio([stock1, stock2], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 1);
      assert.ok(result.has('AAPL'));
      assert.ok(!result.has('GOOGL'));
    });

    it('should handle edge case with equal price and target', () => {
      const stock = new Stock('EVEN', 1000);
      stock.shares = 10;
      
      const allocations = new Map<string, number>([['EVEN', 1.0]]);
      const portfolio = new Portfolio([stock], allocations);
      
      const result = portfolio.rebalance();
      
      assert.strictEqual(result.size, 1);
      assert.strictEqual(result.get('EVEN'), false);
    });
  });
});
