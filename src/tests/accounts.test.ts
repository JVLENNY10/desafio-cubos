import JwtHelpers from '../helpers/JwtHelpers';
import Account from '../database/models/Account';
import AccountsService from '../services/AccountsService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Accounts', () => {
  const jwtHelpers = new JwtHelpers();
  const accountsService = new AccountsService();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Criar nova conta', async () => {
    const branch = '123';
    const account = '1234567-8';
    const document = '12345678910';
    const peopleId = '12345-54321-12345-54321';

    vi.spyOn(Account, 'create').mockResolvedValue(
      {
        id: '12345-12345-12345-12345',
        branch,
        account,
        peopleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    const result = await accountsService.createAccount(branch, account, document);
    expect(result).toHaveProperty('id', '12345-12345-12345-12345');
    expect(result).toHaveProperty('branch', branch);
    expect(result).toHaveProperty('account', account);
  });

  it('Deve retornar uma Lista de contas', async () => {
    const branch = '123';
    const account = '1234567-8';
    const document = '12345678910';
    const peopleId = '12345-54321-12345-54321';

    vi.spyOn(Account, 'findAll').mockResolvedValue([
      {
        id: '12345-12345-12345-12345',
        branch,
        account,
        peopleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as any);

    const result = await accountsService.getAccounts(document);

    expect(result).toContainEqual(
      expect.objectContaining({
        id: '12345-12345-12345-12345',
        branch,
        account,
        peopleId,
      })
    );

    expect(result).toHaveLength(1);
  });
});
