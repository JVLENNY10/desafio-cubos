import { Request, Response } from 'express';
import TransactionsService from '../services/TransactionsService';

class TransactionsController {
  private transactionsService: TransactionsService;

  constructor() {
    this.transactionsService = new TransactionsService();
  }

  createIternalTransaction = async (req: Request, res: Response): Promise<Response> => {
    const value = Number(req.body.value);
    const description = req.body.description;
    const accountId = req.params.accountId as string;
    const receiverAccountId = req.body.receiverAccountId;
    const result = await this.transactionsService.createIternalTransaction(receiverAccountId, value, description, accountId);

    return res.status(200).json(result);
  };

  createTransaction = async (req: Request, res: Response): Promise<Response> => {
    const value = Number(req.body.value);
    const description = req.body.description;
    const accountId = req.params.accountId as string;
    const result = await this.transactionsService.createTransaction(value, description, accountId);

    return res.status(200).json(result);
  };

  getTransactionsBalanceByAccountId = async (req: Request, res: Response): Promise<Response> => {
    const accountId = req.params.accountId as string;
    const result = await this.transactionsService.getTransactionsBalanceByAccountId(accountId);

    return res.status(200).json(result);
  }

  getTransactionsByAccountId = async (req: Request, res: Response): Promise<Response> => {
    const accountId = req.params.accountId as string;
    const type = req.query.type ? req.query.type.toString() : '';
    const currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;
    const itemsPerPage = req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10;
    const transactions = await this.transactionsService.getTransactionsByAccountId(itemsPerPage, currentPage, type, accountId);

    return res.status(200).json(transactions);
  };

  revertTransation = async (req: Request, res: Response): Promise<Response> => {
    const accountId = req.params.accountId as string;
    const transactionId = req.params.transactionId as string;
    const result = await this.transactionsService.revertTransation(accountId, transactionId);

    return res.status(200).json(result);
  }
}

export default TransactionsController;
