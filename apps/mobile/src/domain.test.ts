import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateFare,
  DRIVER_PERCENT,
  MINIMUM_FARE_CENTS,
  PLATFORM_PERCENT,
  type ServiceCategory,
} from './domain';

test('aplica a corrida mínima regional em todas as categorias', () => {
  const categories: ServiceCategory[] = ['NORMAL', 'EXPRESS', 'DELIVERY', 'PHARMACY'];

  for (const category of categories) {
    assert.equal(calculateFare(category, 0).totalCents, MINIMUM_FARE_CENTS);
    assert.equal(calculateFare(category, -1000).totalCents, MINIMUM_FARE_CENTS);
  }
});

test('calcula tarifas em centavos sem ponto flutuante monetário', () => {
  assert.deepEqual(calculateFare('EXPRESS', 10_000), {
    category: 'EXPRESS',
    distanceMeters: 10_000,
    totalCents: 3400,
    platformFeeCents: 680,
    driverEarningsCents: 2720,
  });

  assert.equal(calculateFare('DELIVERY', 5000).totalCents, 1900);
  assert.equal(calculateFare('PHARMACY', 5000).totalCents, 2000);
});

test('preserva o split canônico 20/80 e a soma exata', () => {
  assert.equal(PLATFORM_PERCENT, 20);
  assert.equal(DRIVER_PERCENT, 80);

  for (let distanceMeters = 0; distanceMeters <= 25_000; distanceMeters += 137) {
    const quote = calculateFare('NORMAL', distanceMeters);
    assert.equal(quote.platformFeeCents + quote.driverEarningsCents, quote.totalCents);
    assert.equal(quote.platformFeeCents, Math.round((quote.totalCents * PLATFORM_PERCENT) / 100));
  }
});
