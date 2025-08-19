import db from '.';
import { Model, DataTypes } from 'sequelize';

class Transaction extends Model {
  declare id: string;
  declare value: number;
  declare description: string;
  declare accountId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Transaction.init(
  {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    value: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    accountId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    reversedTransactionId: {
      allowNull: true,
      type: DataTypes.UUID,
    }
  },
  {
    modelName: 'transaction',
    sequelize: db,
  }
);

export default Transaction;
