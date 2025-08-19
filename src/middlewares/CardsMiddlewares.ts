import CardsService from '../services/CardsService';
import { NextFunction, Request, Response } from 'express';

class CardsMiddlewares {
  private cardsService: CardsService;

  constructor() {
    this.cardsService = new CardsService();
  }

  checkCardBody = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
      const { type, number, cvv } = req.body;
      const cardCVVIsNaN = isNaN(Number(cvv));
      const cardNumberReplace = number.replace(/\s+/g, '');
      const cardNumberIsNaN = isNaN(Number(cardNumberReplace));

      if (cardNumberReplace.length !== 16 || cardNumberIsNaN) {
        return res.status(400).json({ error: `number deve ser enviado nesse formato: 1234 1234 1234 1234, mas foi enviado assim: ${number}` });
      } else if (cvv.length !== 3 || cardCVVIsNaN) {
        return res.status(400).json({ error: `cvv deve ser enviado nesse formato: 123, mas foi enviado assim: ${cvv}` });
      } else if (type !== 'physical' && type !== 'virtual') {
        return res.status(400).json({ error: `Tipo inválido: ${type}` });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }

  checkPhysicalCardExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
      const type = req.body.type;
      const accountId = req.params.accountId as string;

      if (type === 'physical') {
        const exists = await this.cardsService.checkPhysicalCardExists(type, accountId);
        if (exists) return res.status(400).json({ error: 'Essa conta já possui um cartão físico.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao validar o corpo da requisição.' });
    }
  }
}

export default CardsMiddlewares;
