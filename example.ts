import { Stock, Portfolio } from './index.js';

console.log('🚀 Portfolio Rebalancer - Ejemplo de Uso\n');

// Crear stocks
const apple = new Stock('AAPL', 150);
apple.shares = 10;

const google = new Stock('GOOGL', 2800);
google.shares = 5;

const microsoft = new Stock('MSFT', 300);
microsoft.shares = 20;

const tesla = new Stock('TSLA', 60000);
tesla.shares = 1;

console.log('📊 Stocks creados:');
console.log(`- ${apple.symbol}: $${apple.currentPrice()} × ${apple.shares} acciones = $${apple.currentPrice() * apple.shares}`);
console.log(`- ${google.symbol}: $${google.currentPrice()} × ${google.shares} acciones = $${google.currentPrice() * google.shares}`);
console.log(`- ${microsoft.symbol}: $${microsoft.currentPrice()} × ${microsoft.shares} acciones = $${microsoft.currentPrice() * microsoft.shares}`);
console.log(`- ${tesla.symbol}: $${tesla.currentPrice()} × ${tesla.shares} acciones = $${tesla.currentPrice() * tesla.shares}`);

// Ejemplo 1: Portfolio balanceado
console.log('\n\n=== EJEMPLO 1: Portfolio con asignaciones 50/50 ===\n');

const allocations1 = new Map<string, number>([
  ['AAPL', 0.5],   // 50%
  ['GOOGL', 0.5]   // 50%
]);

const portfolio1 = new Portfolio([apple, google], allocations1);
console.log(`Valor total del portafolio: $${portfolio1.totalValue()}`);
console.log('\nAnalizando rebalanceo...');

const results1 = portfolio1.rebalance();

// Ejemplo 2: Portfolio con múltiples stocks
console.log('\n\n=== EJEMPLO 2: Portfolio diversificado ===\n');

const allocations2 = new Map<string, number>([
  ['AAPL', 0.3],    // 30%
  ['GOOGL', 0.3],   // 30%
  ['MSFT', 0.4]     // 40%
]);

const portfolio2 = new Portfolio([apple, google, microsoft], allocations2);
console.log(`Valor total del portafolio: $${portfolio2.totalValue()}`);
console.log('\nAnalizando rebalanceo...');

const results2 = portfolio2.rebalance();

// Ejemplo 3: Portfolio desbalanceado
console.log('\n\n=== EJEMPLO 3: Portfolio muy desbalanceado ===\n');

const allocations3 = new Map<string, number>([
  ['TSLA', 0.5],    // 50%
  ['AAPL', 0.5]     // 50%
]);

const portfolio3 = new Portfolio([tesla, apple], allocations3);
console.log(`Valor total del portafolio: $${portfolio3.totalValue()}`);
console.log('\nAnalizando rebalanceo...');

const results3 = portfolio3.rebalance();

// Mostrar resumen
console.log('\n\n📈 Resumen de Ejemplos:');
console.log(`- Ejemplo 1: ${results1.size} stocks analizados`);
console.log(`- Ejemplo 2: ${results2.size} stocks analizados`);
console.log(`- Ejemplo 3: ${results3.size} stocks analizados`);

console.log('\n✅ Ejemplos completados. Revisa los resultados arriba.\n');

