import db from '.';
import { Model, DataTypes } from 'sequelize';

class Person extends Model {
  declare id: string;
  declare name: string;
  declare document: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Person.init(
  {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    document: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    modelName: 'person',
    sequelize: db,
  }
);

export default Person;
