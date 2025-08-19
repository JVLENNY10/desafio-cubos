import AccountsService from '../services/AccountsService';
import { NextFunction, Request, Response } from 'express';

class AccountsMiddlewares {
  private accountsService: AccountsService;

  constructor() {
    this.accountsService = new AccountsService();
  }

  checkAccountBody = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
      const { branch, account } = req.body;
      const branchIsNaN = isNaN(Number(branch));
      const accountValid = /^\d{1,7}-\d$/.test(account);

      if (branchIsNaN || branch.length !== 3) {
        return res.status(400).json({ error: `branch deve ser enviado nesse formato: 123, mas foi enviado assim: ${branch}` });
      } else if (!accountValid) {
        return res.status(400).json({ error: `account deve ser enviado nesse formato: 1234567-8, mas foi enviado assim: ${account}` });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }

  checkAccountExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const { account } = req.body;
      const exists = await this.accountsService.checkAccountExists(account);
      if (exists) return res.status(400).json({ error: `A conta ${account} já existe na base.` });
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }

  checkAccountExistsById = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const accountId = req.params.accountId as string;
      const exists = await this.accountsService.checkAccountExistsById(accountId);
      if (!exists) return res.status(400).json({ error: `accountId inválido.` });
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }
}

export default AccountsMiddlewares;
