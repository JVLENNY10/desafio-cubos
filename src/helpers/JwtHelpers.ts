import fs from 'fs';
import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';

class JwtHelpers {
  private config: object;
  private jwtSecret: string;

  constructor() {
    this.config = { expiresIn: '1d' };
    this.jwtSecret = fs.readFileSync('jwt.evaluation.key', 'utf-8');
  }

  encoder = (payload = {}): Secret => sign({ data: payload }, this.jwtSecret, this.config);
  decoder = (token: string): string | JwtPayload => verify(token, this.jwtSecret);
}

export default JwtHelpers;
