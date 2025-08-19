import Transaction from '../database/models/Transaction';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransactionsService from '../services/TransactionsService';

describe('Transactions', () => {
  const transactionsService = new TransactionsService();
  const transactionSql = { commit: vi.fn(), rollback: vi.fn() };
  const mockTransactionsList = [
    { dataValues: { id: 'transaction-id-1', description: 'Transação Teste 1', value: 100, createdAt: new Date(), updatedAt: new Date() } }, // account-id-1
    { dataValues: { id: 'transaction-id-2', description: 'Transação Teste 2', value: -50, createdAt: new Date(), updatedAt: new Date() } }, // account-id-1
    { dataValues: { id: 'transaction-id-3', description: 'Transação Teste 2', value: 50, createdAt: new Date(), updatedAt: new Date() } }, // account-id-2
  ];

  const mockTransactionsListToInternal = [
    { id: 'transaction-id-2', description: 'Transação Teste 2', value: -50, accountId: 'account-id-1', createdAt: new Date(), updatedAt: new Date() }, // account-id-1
    { id: 'transaction-id-3', description: 'Transação Teste 2', value: 50, accountId: 'account-id-2', createdAt: new Date(), updatedAt: new Date() }, // account-id-2
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(Transaction, 'findAll').mockResolvedValue(mockTransactionsList as any);
    vi.spyOn(Transaction, 'create').mockResolvedValue(mockTransactionsList[0]?.dataValues as any);
    vi.spyOn(Transaction, 'bulkCreate').mockResolvedValue(mockTransactionsListToInternal as any);
    vi.spyOn(transactionsService.sequelize, 'transaction').mockResolvedValue(transactionSql as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Criar uma transação', async () => {
    const result = await transactionsService.createTransaction(100, 'Transação Teste 1', 'account-id-1');
    expect(Transaction.create).toHaveBeenCalledWith({ value: 100, description: 'Transação Teste 1', accountId: 'account-id-1' });
    expect(result).toEqual(mockTransactionsList[0]?.dataValues);
  });

  it('Criar transação interna', async () => {
    const result = await transactionsService.createIternalTransaction('account-id-2', 50, 'Transação Teste 2', 'account-id-1');
    expect(Transaction.bulkCreate).toHaveBeenCalledWith(
      [
        { value: -50, description: 'Transação Teste 2', accountId: 'account-id-1' },
        { value: 50, description: 'Transação Teste 2', accountId: 'account-id-2' }
      ],
      { transaction: transactionSql }
    );

    expect(transactionSql.commit).toHaveBeenCalled();
    expect(result).toEqual(mockTransactionsList[2]?.dataValues);
  });

  it('Deve retornar uma Lista de transações pelo id da conta com paginação', async () => {
    const result = await transactionsService.getTransactionsByAccountId(2, 1, 'credit', 'account-id-1');

    expect(Transaction.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'value', 'description', 'createdAt', 'updatedAt'],
      limit: 2,
      offset: 0,
      order: [['createdAt', 'DESC']],
      where: expect.objectContaining({
        accountId: 'account-id-1',
        value: expect.any(Object) // ignora o Symbol do Op.gt
      })
    });

    expect(result).toEqual({
      transactions: mockTransactionsList,
      pagination: { itemsPerPage: 2, currentPage: 1 },
    });
  });

  it('Deve retornar saldo correto', async () => {
    const transactions = [{ value: 100 }, { value: -50 }];
    vi.spyOn(Transaction, 'findAll').mockResolvedValue(transactions as any);
    const result = await transactionsService.getTransactionsBalanceByAccountId('account-id-1');
    expect(Transaction.findAll).toHaveBeenCalledWith({ where: { accountId: 'account-id-1' } });
    expect(result).toEqual({ balance: 50 });
  });

  it('Deve criar estorno se não houver reversão anterior', async () => {
    const originalTx = { dataValues: { value: 100 } };
    vi.spyOn(Transaction, 'count').mockResolvedValue(0 as any);
    vi.spyOn(Transaction, 'findOne').mockResolvedValue(originalTx as any);
    vi.spyOn(Transaction, 'create').mockResolvedValue({ id: 'transation-revert-id-1', value: 100, description: 'Estorno de cobrança indevida.', createdAt: new Date(), updatedAt: new Date() } as any);

    const result = await transactionsService.revertTransation('account-id-1', 'transaction-id-1');
    expect(Transaction.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'transation-revert-id-1');
  });
});
