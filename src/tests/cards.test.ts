
import Card from '../database/models/Card';
import Person from '../database/models/Person';
import Account from '../database/models/Account';
import CardsService from '../services/CardsService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Cards', () => {
  const cardsService = new CardsService();
  const mockPerson = { dataValues: { id: 'id-user-123' } };
  const mockAccounts = [{ dataValues: { id: 'account-id-1' } }, { dataValues: { id: 'account-id-2' } }];
  const mockCards = [
    { dataValues: { id: 'card-id-1', type: 'credit', number: '1234 5678 1234 5678', cvv: '123', createdAt: new Date(), updatedAt: new Date() } },
    { dataValues: { id: 'card-id-2', type: 'debit', number: '8765 4321 8765 4321', cvv: '456', createdAt: new Date(), updatedAt: new Date() } },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(Card, 'findAll').mockResolvedValue(mockCards as any);
    vi.spyOn(Person, 'findOne').mockResolvedValue(mockPerson as any);
    vi.spyOn(Account, 'findAll').mockResolvedValue(mockAccounts as any);
    vi.spyOn(Card, 'create').mockResolvedValue(mockCards[0]?.dataValues as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Criar novo cartão, também mostrar só os 4 últimos números do cartão', async () => {
    const result = await cardsService.createCard('credit', '1234 5678 1234 5678', '123', 'account-id-1');
    expect(Card.create).toHaveBeenCalledWith({ type: 'credit', number: '1234 5678 1234 5678', cvv: '123', accountId: 'account-id-1' })
    expect(result).toEqual({ ...mockCards[0]?.dataValues, number: '5678' });
  });

  it('Deve retornar uma Lista de cartões pelo id da conta, também mostrar todos os digitos do número do cartão', async () => {
    const result = await cardsService.getCardsByAccountId('account-id-1');
    expect(Card.findAll).toHaveBeenCalledWith({ attributes: ['id', 'type', 'number', 'cvv', 'createdAt', 'updatedAt'], where: { accountId: 'account-id-1' } });
    expect(result).toEqual(mockCards);
  });

  it('Deve retornar uma Lista de cartões de um usuário com paginação, também mostrar só os 4 últimos digitos do número do cartão', async () => {
    const result = await cardsService.getCardsByPerson('12345678910', 2, 1);

    expect(Person.findOne).toHaveBeenCalledWith({ where: { document: '12345678910' } });
    expect(Account.findAll).toHaveBeenCalledWith({ where: { peopleId: 'id-user-123' } });
    expect(Card.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'type', 'number', 'cvv', 'createdAt', 'updatedAt'],
      limit: 2,
      offset: 0,
      order: [['createdAt', 'DESC']],
      where: { accountId: ['account-id-1', 'account-id-2'] },
    });

    expect(result).toEqual({
      cards: mockCards.map(({ dataValues }) => ({ ...dataValues, number: dataValues.number.slice(-4) })),
      pagination: { itemsPerPage: 2, currentPage: 1 },
    });
  });
});
