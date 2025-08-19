import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import JwtHelpers from '../helpers/JwtHelpers';
import CardsService from '../services/CardsService';

class CardsController {
  private jwtHelpers: JwtHelpers;
  private cardsService: CardsService;

  constructor() {
    this.jwtHelpers = new JwtHelpers();
    this.cardsService = new CardsService();
  }

  createCard = async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { type, number, cvv } = req.body;
    const result = await this.cardsService.createCard(type, number, cvv, accountId as string);

    return res.status(200).json(result);
  }

  getCardsByAccountId = async (req: Request, res: Response) => {
    const accountId = req.params.accountId as string;
    const result = await this.cardsService.getCardsByAccountId(accountId);
    
    return res.status(200).json(result);
  }

  getCardsByPerson = async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const tokenWithoutBearer = token?.split(' ')[1] as string;
    const currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;
    const itemsPerPage = req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10;
    const { data: { document } } = this.jwtHelpers.decoder(tokenWithoutBearer) as JwtPayload;
    const cards = await this.cardsService.getCardsByPerson(document, itemsPerPage, currentPage);

    return res.status(200).json(cards);
  }
}

export default CardsController;
