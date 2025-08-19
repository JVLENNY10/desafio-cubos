import { NextFunction, Request, Response } from 'express';
import AccountsService from '../services/AccountsService';
import TransactionsService from '../services/TransactionsService';

class TransactionsMiddlewares {
  private accountsService: AccountsService;
  private transationsService: TransactionsService;

  constructor() {
    this.accountsService = new AccountsService();
    this.transationsService = new TransactionsService();
  }

  checkInternalTransaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const value = Number(req.body.value);
      const accountId = req.params.accountId as string;
      const receiverAccountId = req.body.receiverAccountId;
      const isValidParam = await this.accountsService.checkAccountExistsById(accountId);
      const isValidBody = await this.accountsService.checkAccountExistsById(receiverAccountId);

      if (!isValidParam) {
        return res.status(400).json({ error: 'accountId inválido.' });
      } else if (!isValidBody) {
        return res.status(400).json({ error: 'receiverAccountId inválido.' });
      } else if (value <= 0) {
        return res.status(400).json({ error: 'Nenhum valor informado.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição' });
    }
  }

  checkNegativeBalance = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const accountId = req.params.accountId as string;
      const value = req.body.value ? req.body.value : 0;
      const result = await this.transationsService.checkNegativeBalance(accountId, value);
      if (result === true) return res.status(400).json({ error: 'Saldo insuficiente.' });
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição' });
    }
  }

  checkNegativeBalanceToRevert = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const accountId = req.params.accountId as string;
      const transactionId = req.params.transactionId as string;
      const result = await this.transationsService.checkNegativeBalanceToRevert(accountId, transactionId);
      if (result === true) return res.status(400).json({ error: 'Saldo insuficiente.' });
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição' });
    }
  }

  checkTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const transactionId = req.params.transactionId as string;
      const isValidParamTransactionId = await this.transationsService.validateTransactionId(transactionId);
      if (!isValidParamTransactionId) return res.status(400).json({ error: 'transactionId inválido.' });
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição' });
    }
  }

  checkTransactionValue = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
      const value = Number(req.body.value);
      if (value === 0) return res.status(400).json({ error: 'Nenhum valor informado' });
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição' });
    }
  }
}

export default TransactionsMiddlewares;
