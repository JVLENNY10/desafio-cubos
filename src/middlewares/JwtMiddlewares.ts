import JwtHelpers from '../helpers/JwtHelpers';
import { NextFunction, Request, Response } from 'express';

class JwtMiddlewares {
  private jwtHelpers: JwtHelpers;

  constructor() {
    this.jwtHelpers = new JwtHelpers();
  }

  checkToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    const token = req.headers.authorization;
    const tokenWithoutBearer = token?.split(' ')[1];
    if (tokenWithoutBearer === undefined) return res.status(401).json({ error: 'Token não encontrado' });

    try {
      this.jwtHelpers.decoder(tokenWithoutBearer);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      } else {
        return res.status(401).json({ error: 'Token inválido' });
      }
    }

    next();
  }
}

export default JwtMiddlewares;
