import Card from '../database/models/Card';
import People from '../database/models/Person';
import Account from '../database/models/Account';

class CardsService
// implements IUsersFunctions 
{
  checkPhysicalCardExists = async (type: string, accountId: string) => {
    const result = await Card.findOne({ where: { type, accountId } });
    if (result !== null) return true;
    return false;
  }

  createCard = async (type: string, number: string, cvv: string, accountId: string) => {
    const { id, createdAt, updatedAt } = await Card.create({ type, number, cvv, accountId });
    return { id, type, number: number.slice(-4), cvv, createdAt, updatedAt };
  }

  getCardsByAccountId = async (accountId: string) => {
    const result = await Card.findAll({ attributes: ['id', 'type', 'number', 'cvv', 'createdAt', 'updatedAt'], where: { accountId } });
    return result;
  }

  getCardsByPerson = async (document: string, itemsPerPage: number, currentPage: number) => {
    const { dataValues } = await People.findOne({ where: { document } }) as People;
    const findAllAccoutsByPeopleId = await Account.findAll({ where: { peopleId: dataValues.id } });
    const allAccoutIds = findAllAccoutsByPeopleId.map(({ dataValues: { id } }) => id);

    const cards = await Card.findAll({
      attributes: ['id', 'type', 'number', 'cvv', 'createdAt', 'updatedAt'],
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      order: [['createdAt', 'DESC']],
      where: { accountId: allAccoutIds },
    });

    return {
      cards: cards.map(({ dataValues }) => ({ ...dataValues, number: dataValues.number.slice(-4) })),
      pagination: {
        itemsPerPage,
        currentPage,
      }
    };
  }
}

export default CardsService;
