import Bcrypt from 'bcryptjs';
import Person from '../database/models/Person';
import JwtHelpers from '../helpers/JwtHelpers';
import PeopleServices from '../services/PeopleService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Testando "People"', () => {
  const jwtHelpers = new JwtHelpers();
  const peopleServices = new PeopleServices();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Criar novo usuário.', async () => {
    const name = 'Ozzy Osbourne';
    const password = 'superSenha';
    const document = '12345678910';

    vi.spyOn(Person, 'create').mockResolvedValue(
      {
        id: '12345-54321-12345-54321',
        name: 'Ozzy Osbourne',
        document: '12345678910',
        password: Bcrypt.hashSync(password),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    const result = await peopleServices.createPerson(name, document, password);
    expect(result).toHaveProperty('id', '12345-54321-12345-54321');
    expect(result).toHaveProperty('name', 'Ozzy Osbourne');
    expect(result).toHaveProperty('document', '12345678910');
  });

  it('Deve retornar token quando login estiver correto', async () => {
    const document = '12345678910';
    const password = 'superSenha';

    vi.spyOn(Person, 'findOne').mockResolvedValue({
      id: '12345-12345-12345-12345',
      name: 'Ozzy Osbourne',
      document,
      password: Bcrypt.hashSync(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await peopleServices.loginPerson(document, password);
    expect(result).toEqual({ token: result.token });
  });
});
