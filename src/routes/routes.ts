import { Router } from 'express';
import JwtMiddlewares from '../middlewares/JwtMiddlewares';
import CardsController from '../controllers/CardsController';
import PeopleController from '../controllers/PeopleController'
import CardsMiddlewares from '../middlewares/CardsMiddlewares';
import PeopleMiddlewares from '../middlewares/PeopleMiddlewares';
import AccountsController from '../controllers/AccountsController';
import AccountsMiddlewares from '../middlewares/AccountsMiddlewares';
import TransactionsController from '../controllers/TransactionsController';
import TransactionsMiddlewares from '../middlewares/TransactionsMiddlewares';

const routes = Router();

const jwrMiddlewares = new JwtMiddlewares();
const cardsController = new CardsController();
const cardsMiddlewares = new CardsMiddlewares();
const peopleController = new PeopleController();
const peopleMiddlewares = new PeopleMiddlewares();
const accountsController = new AccountsController();
const accountsMiddlewares = new AccountsMiddlewares();
const transactionsController = new TransactionsController();
const transactionsMiddlewares = new TransactionsMiddlewares();

const { checkToken } = jwrMiddlewares;
const { createPerson, loginPerson } = peopleController;
const { createAccount, getAccounts } = accountsController;
const { checkCardBody, checkPhysicalCardExists } = cardsMiddlewares;
const { createCard, getCardsByAccountId, getCardsByPerson } = cardsController;
const { checkAccountBody, checkAccountExists, checkAccountExistsById } = accountsMiddlewares;
const { checkCreatePersonBody, checkLoginPersonBody, documentValidate } = peopleMiddlewares;
const { checkInternalTransaction, checkNegativeBalance, checkNegativeBalanceToRevert, checkTransactionById, checkTransactionValue } = transactionsMiddlewares;
const { createIternalTransaction, createTransaction, getTransactionsBalanceByAccountId, getTransactionsByAccountId, revertTransation } = transactionsController;

/**
 * @openapi
 * /people:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               document:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/people', checkCreatePersonBody, documentValidate,  createPerson);

/**
 * @openapi
 * /login:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/login', checkLoginPersonBody, documentValidate, loginPerson);

/**
 * @openapi
 * /accounts:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch:
 *                 type: string
 *               account:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/accounts', checkToken, checkAccountBody, checkAccountExists, createAccount);

/**
 * @openapi
 * /accounts:
 *   get:
 *     responses:
 *       200:
 *         description: OK
 */
routes.get('/accounts', checkToken, getAccounts);

/**
 * @openapi
 * /accounts/{accountId}/cards:
 *   post:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               number:
 *                 type: string
 *               cvv:
 *                  type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/accounts/:accountId/cards', checkToken, checkAccountExistsById, checkCardBody, checkPhysicalCardExists, createCard);

/**
 * @openapi
 * /accounts/{accountId}/cards:
 *   get:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.get('/accounts/:accountId/cards', checkToken, checkAccountExistsById, getCardsByAccountId);

/**
 * @openapi
 * /cards:
 *   get:
 *     parameters:
 *      - in: query
 *        name: itemsPerPage
 *        schema:
 *          type: number
 *      - in: query
 *        name: currentPage
 *        schema:
 *          type: number
 *     responses:
 *       200:
 *         description: OK
 */
routes.get('/cards', checkToken, getCardsByPerson);

/**
 * @openapi
 * /accounts/{accountId}/transactions:
 *   post:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/accounts/:accountId/transactions', checkToken, checkAccountExistsById, checkTransactionValue, checkNegativeBalance, createTransaction);

/**
 * @openapi
 * /accounts/{accountId}/transactions/internal:
 *   post:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverAccountId:
 *                 type: string
 *               value:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/accounts/:accountId/transactions/internal', checkToken, checkInternalTransaction, checkNegativeBalance, createIternalTransaction);

/**
 * @openapi
 * /accounts/{accountId}/transactions:
 *   get:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *      - in: query
 *        name: itemsPerPage
 *        schema:
 *          type: number
 *      - in: query
 *        name: currentPage
 *        schema:
 *          type: number
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.get('/accounts/:accountId/transactions', checkToken, checkAccountExistsById, getTransactionsByAccountId);

/**
 * @openapi
 * /accounts/{accountId}/balance:
 *   get:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.get('/accounts/:accountId/balance', checkToken, checkAccountExistsById, getTransactionsBalanceByAccountId);

/**
 * @openapi
 * /accounts/{accountId}/transactions/{transactionId}/revert:
 *   post:
 *     parameters:
 *      - name: accountId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *      - name: transactionId
 *        in: path
 *        required: true
 *        schema:
 *        type: string
 *     responses:
 *       200:
 *         description: OK
 */
routes.post('/accounts/:accountId/transactions/:transactionId/revert', checkToken, checkAccountExistsById, checkTransactionById, checkNegativeBalanceToRevert, revertTransation);

export default routes;
