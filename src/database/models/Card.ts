import db from '.';
import { Model, DataTypes } from 'sequelize';

class Card extends Model {
  declare id: string;
  declare type: string;
  declare number: string;
  declare cvv: string;
  declare accountId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Card.init(
  {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cvv: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    accountId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  },
  {
    modelName: 'card',
    sequelize: db,
  }
);

export default Card;
