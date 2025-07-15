import Joi from 'joi';
import { ITransactionPopulated } from '../models/transaction.model';
import { TransactionType, TransactionStatus } from '../enums/transactionType.enum';
import { IStatement } from '../models/statement.model';

export class RequestStatementDto {
  user: string;
  accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
  startDate: Date;
  endDate: Date;
  format: 'PDF' | 'CSV' | 'OFX';

  static validationSchema = Joi.object({
    user: Joi.string().required(),
    accountType: Joi.string()
      .valid('loanAccount', 'investmentAccount', 'checkingAccount')
      .required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    format: Joi.string().valid('PDF', 'CSV', 'OFX').required(),
  });

  constructor(data: RequestStatementDto) {
    this.user = data.user;
    this.accountType = data.accountType;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.format = data.format;
  }
}

export class StatementResponseDto {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
  };
  accountType: 'loanAccount' | 'investmentAccount' | 'checkingAccount';
  startDate: Date;
  endDate: Date;
  format: 'PDF' | 'CSV' | 'OFX';
  transactions: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    recipient?: string;
    paymentMethod?: string;
    notes?: string;
    createdAt: Date;
  }>;
  balanceSummary: {
    startingBalance: number;
    endingBalance: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;

  static validationSchema = Joi.object({
    id: Joi.string().required(),
    user: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      userName: Joi.string().required(),
    }).required(),
    accountType: Joi.string()
      .valid('loanAccount', 'investmentAccount', 'checkingAccount')
      .required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    format: Joi.string().valid('PDF', 'CSV', 'OFX').required(),
    transactions: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string()
          .valid(...Object.values(TransactionType))
          .required(),
        amount: Joi.number().positive().required(),
        currency: Joi.string().required(),
        status: Joi.string()
          .valid(...Object.values(TransactionStatus))
          .required(),
        recipient: Joi.string().optional(),
        paymentMethod: Joi.string().optional(),
        notes: Joi.string().optional(),
        createdAt: Joi.date().required(),
      })
    ).required(),
    balanceSummary: Joi.object({
      startingBalance: Joi.number().required(),
      endingBalance: Joi.number().required(),
      currency: Joi.string().required(),
    }).required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
  });

  constructor(
    statement: IStatement,
    transactions: ITransactionPopulated[],
    user: { firstName: string; lastName: string; email: string; userName: string },
    startingBalance: number,
    endingBalance: number,
    currency: string
  ) {
    this.id = statement._id.toString();
    this.user = user;
    this.accountType = statement.accountType;
    this.startDate = statement.startDate;
    this.endDate = statement.endDate;
    this.format = statement.format;
    this.transactions = transactions.map((t) => ({
      id: t._id.toString(),
      type: t.type,
      amount: t.amount,
      currency: (t.currency as any).name,
      status: t.status,
      recipient: t.recipient,
      paymentMethod: t.paymentMethod,
      notes: t.notes,
      createdAt: t.createdAt,
    }));
    this.balanceSummary = {
      startingBalance,
      endingBalance,
      currency,
    };
    this.createdAt = statement.createdAt;
    this.updatedAt = statement.updatedAt;
  }
}