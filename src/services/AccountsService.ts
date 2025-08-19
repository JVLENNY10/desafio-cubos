import People from '../database/models/Person';
import Account from '../database/models/Account';

class AccountsService
// implements IUsersFunctions 
{
  checkAccountExists = async (account: string) => {
    const result = await Account.findOne({ where: { account } });
    if (result !== null) return true;
    return false;
  }

  checkAccountExistsById = async (id: string) => {
    const result = await Account.findByPk(id);
    if (result !== null) return true;
    return false;
  }

  createAccount = async (branch: string, account: string, document: string) => {
    const resultPeople = await People.findOne({ where: { document } });
    const { id, createdAt, updatedAt } = await Account.create({ branch, account, peopleId: resultPeople?.id });
    return { id, branch, account, createdAt, updatedAt };
  }

  getAccounts = async (document: string) => {
    const resultPeople = await People.findOne({ where: { document } });
    const result = await Account.findAll({ attributes: ['id', 'branch', 'account', 'createdAt', 'updatedAt'], where: { peopleId: resultPeople?.id } });
    return result;
  }
}

export default AccountsService;
