import { jest } from '@jest/globals';
import { bankSurplus } from '../banking.js';
import prisma from '../../../../../infrastructure/prismaClient.js';

jest.mock('../../../../../infrastructure/prismaClient.js', () => ({
  __esModule: true,
  default: {
    shipCompliance: { findFirst: jest.fn() },
    bankEntry: { create: jest.fn() },
  },
}));

const mockedPrisma = prisma as any;

describe('bankSurplus', () => {
  const shipId = 'R001';
  const year = 2024;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if amount is <= 0', async () => {
    await expect(bankSurplus(shipId, year, 0)).rejects.toThrow('Amount must be positive');
  });

  it('should throw error if no surplus available', async () => {
    mockedPrisma.shipCompliance.findFirst.mockResolvedValue({ cbGco2eq: 0 });
    await expect(bankSurplus(shipId, year, 50)).rejects.toThrow('No surplus available to bank');
  });

  it('should throw error if amount > available surplus', async () => {
    mockedPrisma.shipCompliance.findFirst.mockResolvedValue({ cbGco2eq: 30 });
    await expect(bankSurplus(shipId, year, 50)).rejects.toThrow('Cannot bank more than available surplus');
  });

  it('should create a bank entry for valid amount', async () => {
    mockedPrisma.shipCompliance.findFirst.mockResolvedValue({ cbGco2eq: 100 });
    const mockEntry = { shipId, year, amountGco2eq: 50 };
    mockedPrisma.bankEntry.create.mockResolvedValue(mockEntry);

    const result = await bankSurplus(shipId, year, 50);
    expect(mockedPrisma.bankEntry.create).toHaveBeenCalledWith({
      data: { shipId, year, amountGco2eq: 50 },
    });
    expect(result).toEqual(mockEntry);
  });
});
