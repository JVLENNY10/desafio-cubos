import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import Config from '../database/config/database';
import Transaction from '../database/models/Transaction';

class TransactionsService {
  public sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(Config);
  }

  checkNegativeBalance = async (accountId: string, value: number = 0): Promise<boolean> => {
    const { balance } = await this.getTransactionsBalanceByAccountId(accountId);
    if (balance + value < 0) return true;
    return false;
  };

  checkNegativeBalanceToRevert = async (accountId: string, transactionId: string): Promise<boolean> => {
    const { balance } = await this.getTransactionsBalanceByAccountId(accountId);
    const { dataValues } = await Transaction.findOne({ where: { id: transactionId } }) as Transaction;
    const value = dataValues.value * -1;
    if (balance + value < 0) return true;
    return false;
  };

  createTransaction = async (value: number, description: string, accountId: string) => {
    const { id, createdAt, updatedAt } = await Transaction.create({ value, description, accountId });
    return { id, value, description, createdAt, updatedAt };
  }

  createIternalTransaction = async (receiverAccountId: string, value: number, description: string, accountId: string) => {
    const transaction = await this.sequelize.transaction();

    try {
      const transactions = await Transaction.bulkCreate(
        [
          { value: -value, description, accountId },
          { value, description, accountId: receiverAccountId }
        ],
        { transaction }
      );

      await transaction.commit();
      const { id, createdAt, updatedAt } = transactions.find((t) => t.accountId === receiverAccountId) as Transaction;
      return { id, value, description, createdAt, updatedAt };
    } catch (err) {
      await transaction.rollback();
      return { error: 'Transação interrompida' };
    }
  }

  getTransactionsByAccountId = async (itemsPerPage: number, currentPage: number, type: string, accountId: string) => {
    let filterValue = undefined;
    if (type === 'debit' || type === 'credit') filterValue = type === 'debit' ? { [Op.lt]: 0 } : { [Op.gt]: 0 };

    const transactions = await Transaction.findAll({
      attributes: ['id', 'value', 'description', 'createdAt', 'updatedAt'],
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      order: [['createdAt', 'DESC']],
      where: { accountId, ...(filterValue && { value: filterValue }) },
    });

    return {
      transactions,
      pagination: {
        itemsPerPage,
        currentPage,
      }
    };
  }

  getTransactionsBalanceByAccountId = async (accountId: string) => {
    const findBalance = await Transaction.findAll({ where: { accountId } });
    const balance = Number(findBalance.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0).toFixed(2));
    return { balance };
  }

  revertTransation = async (accountId: string, transactionId: string) => {
    const reversedTransactionIdCount = await Transaction.count(({ where: { reversedTransactionId: transactionId } }));
    console.log(reversedTransactionIdCount);
    if (reversedTransactionIdCount === 0) {
      const { dataValues } = await Transaction.findOne({ where: { id: transactionId } }) as Transaction;
      console.log(dataValues.value);

      const { id, value, description, createdAt, updatedAt } = await Transaction.create({
        value: dataValues.value,
        description: 'Estorno de cobrança indevida.',
        accountId,
        reversedTransactionId: transactionId,
      })

      return { id, value, description, createdAt, updatedAt };
    } else {
      return { error: 'Estorno já realizado.' };
    }
  }

  validateTransactionId = async (id: string) => {
    const result = await Transaction.findByPk(id);
    if (result !== null) return true
    return false;
  }
}

export default TransactionsService;
