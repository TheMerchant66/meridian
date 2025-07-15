import { RequestStatementDto, StatementResponseDto } from '../dto/statement.dto';
import { IStatement } from '../models/statement.model';

export interface StatementService {
  requestStatement(statementData: RequestStatementDto): Promise<IStatement>;
  getUserStatements(userId: string): Promise<IStatement[]>;
  getAllStatements(): Promise<IStatement[]>;
  getStatementById(id: string): Promise<StatementResponseDto>;
}