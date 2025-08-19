import db from '.';
import { Model, DataTypes } from 'sequelize';

class Account extends Model {
  declare id: string;
  declare branch: number;
  declare account: string;
  declare peopleId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Account.init(
  {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    branch: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    account: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    peopleId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  },
  {
    modelName: 'account',
    sequelize: db,
  }
);

export default Account;
