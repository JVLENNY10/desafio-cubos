import CubosService from '../services/CubosService';
import { NextFunction, Request, Response } from 'express';
import PeopleServices from '../services/PeopleService';

class PeopleMiddlewares {
  private cubosService: CubosService;
  private peopleServices: PeopleServices;

  constructor() {
    this.cubosService = new CubosService();
    this.peopleServices = new PeopleServices();
  }

  checkCreatePersonBody = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
      const { name, document, password } = req.body;

      if (name === undefined || name === null || name.length === 0) {
        return res.status(400).json({ error: 'name é obrigatório.' });
      } else if (document === undefined || document === null || document.length === 0) {
        return res.status(400).json({ error: 'document é obrigatório.' });
      } else if (password === undefined || password === null || password.length === 0) {
        return res.status(400).json({ error: 'password é obrigatório.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }

  checkLoginPersonBody = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
      const { document, password } = req.body;

      if (document === undefined || document === null || document.length === 0) {
        return res.status(400).json({ error: 'document é obrigatório.' });
      } else if (password === undefined || password === null || password.length === 0) {
        return res.status(400).json({ error: 'password é obrigatório.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }

  documentValidate = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const { document } = req.body;
      const documentReplace = document.replace(/[.-]/g, "");
      if (documentReplace.length !== 11) return res.status(400).json({ error: `document está fora do padrão: ${document}` });
      const result = await this.cubosService.documentValidate(documentReplace);

      if (result.error) {
        return res.status(400).json(result);
      } else if (result.data.status !== 1) {
        return res.status(401).json({ error: `Documento ${document} não verificado.` })
      } else {
        const documentExists = await this.peopleServices.checkDocumentExists(document);
        if (documentExists) res.status(401).json({ error: `Documento ${document} já existe na base` });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }
}

export default PeopleMiddlewares;
