import { Request, Response } from 'express';
import PeopleServices from '../services/PeopleService';

class PeopleController {
  private peopleService: PeopleServices;

  constructor() {
    this.peopleService = new PeopleServices();
  }

  createPerson = async (req: Request, res: Response): Promise<Response> => {
    const { name, document, password } = req.body;
    const result = await this.peopleService.createPerson(name, document, password);

    return res.status(200).json(result);
  }

  loginPerson = async (req: Request, res: Response): Promise<Response> => {
    const { document, password } = req.body;
    const result = await this.peopleService.loginPerson(document, password);

    return res.status(200).json(result);
  }
}

export default PeopleController;
