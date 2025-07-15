export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  CRYPTO_DEPOSIT = 'CRYPTO_DEPOSIT',
  CHEQUE_DEPOSIT = 'CHEQUE_DEPOSIT',
  LOAN_PAYMENT = 'LOAN_PAYMENT',
}

export enum TransactionStatus {
  PROCESSING = 'Processing',
  IN_PROGRESS = 'In Progress',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}