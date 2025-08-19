import Bcrypt from 'bcryptjs';
import People from '../database/models/Person';
import JwtHelpers from '../helpers/JwtHelpers';

class PeopleServices {
  private jwtHelpers: JwtHelpers;

  constructor() {
    this.jwtHelpers = new JwtHelpers();
  }

  checkDocumentExists = async (document: string) => {
    const documentReplace = document.replace(/[.-]/g, "");
    const result = await People.findOne({ where: { document: documentReplace } });
    if (result !== null) return true;
    return false;
  }

  createPerson = async (name: string, document: string, password: string) => {
    const documentReplace = document.replace(/[.-]/g, "");
    const { id, createdAt, updatedAt } = await People.create({ name, document: documentReplace, password: Bcrypt.hashSync(password) });
    return { id, name, document: documentReplace, createdAt, updatedAt };
  }

  loginPerson = async (document: string, password: string) => {
    try {
      const people = await People.findOne({ where: { document } });

      if (people !== null) {
        const passwordExists = Bcrypt.compareSync(password, people.password);


        if (passwordExists) {
          const token = this.jwtHelpers.encoder({ document, password });
          return { token: `Bearer ${token}` };
        }
      }

      return { error: 'Login inválido' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default PeopleServices;
