import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import JwtHelpers from '../helpers/JwtHelpers';
import AccountsService from '../services/AccountsService';

class AccountsController {
  private jwtHelpers: JwtHelpers;
  private accountsService: AccountsService;

  constructor() {
    this.jwtHelpers = new JwtHelpers();
    this.accountsService = new AccountsService();
  }

  createAccount = async (req: Request, res: Response) => {
    const { branch, account } = req.body;
    const token = req.headers.authorization;
    const tokenWithoutBearer = token?.split(' ')[1] as string;
    const { data: { document } } = this.jwtHelpers.decoder(tokenWithoutBearer) as JwtPayload;
    const result = await this.accountsService.createAccount(branch, account, document);

    return res.status(200).json(result);
  }

  getAccounts = async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const tokenWithoutBearer = token?.split(' ')[1] as string;
    const { data: { document } } = this.jwtHelpers.decoder(tokenWithoutBearer) as JwtPayload;
    const result = await this.accountsService.getAccounts(document);

    return res.status(200).json(result);
  }
}

export default AccountsController;
