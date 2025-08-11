import { z } from "zod";
import { Role } from "@/lib/enums/role.enum";
import { TransactionStatus, TransactionType } from "@/lib/enums/transactionType.enum";

export const LoginSchema = z.object({
    accountNumber: z.string()
        .length(11, { message: "Account number must be exactly 11 digits" })
        .regex(/^\d+$/, { message: "Account number must contain only digits" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" })
});

export const SignUpSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    userName: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(35, { message: "Password should be less than 35 characters" })
        .refine(value => /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(value), {
            message: "Password must contain at least one uppercase letter and one symbol",
        }),
    dateOfBirth: z.string().refine(date => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return false;

        const today = new Date();
        const age = today.getFullYear() - parsedDate.getFullYear();
        const monthDiff = today.getMonth() - parsedDate.getMonth();
        const dayDiff = today.getDate() - parsedDate.getDate();

        const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        return adjustedAge >= 18;
    }, { message: "You must be at least 18 years old" }),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    role: z.enum([Role.ADMIN], {
        required_error: "Role must be ADMIN",
        invalid_type_error: "Role must be ADMIN"
    })
});
export type LoginFormData = z.infer<typeof LoginSchema>;
export type SignUpFormData = z.infer<typeof SignUpSchema>;

export const ProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
    profilePicture: z.string().url('Invalid profile picture URL').optional(),
});

export const PasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z
            .string()
            .min(5, 'Password must be at least 5 characters')
            .regex(/^(?=.*[A-Z])(?=.*[\W_]).{5,}$/, 'Password must contain at least one uppercase letter and one symbol'),
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type ProfileFormData = z.infer<typeof ProfileSchema>;
export type PasswordFormData = z.infer<typeof PasswordSchema>;

export const DepositSchema = z
    .object({
        type: z.enum([TransactionType.DEPOSIT, TransactionType.CRYPTO_DEPOSIT], {
            required_error: "Transaction type is required",
            invalid_type_error: "Transaction type must be DEPOSIT or CRYPTO_DEPOSIT",
        }),
        amount: z.number().positive({ message: "Amount must be a positive number" }),
        currency: z.string().min(1, { message: "Currency is required" }),
        accountType: z.enum(["loanAccount", "investmentAccount", "checkingAccount"], {
            required_error: "Account type is required",
            invalid_type_error: "Account type must be loanAccount, investmentAccount, or checkingAccount",
        }),
        cryptoDetails: z
            .object({
                network: z.string().min(1, { message: "Network is required for crypto deposits" }),
                walletAddress: z.string().min(1, { message: "Wallet address is required for crypto deposits" }),
                proofOfPayment: z.string().optional(),
            })
            .optional(),
    })
    .refine(
        (data) => {
            if (data.type === TransactionType.CRYPTO_DEPOSIT) {
                return !!data.cryptoDetails;
            }
            return true;
        },
        { message: "Crypto details are required for CRYPTO_DEPOSIT transactions", path: ["cryptoDetails"] }
    );

export const ChequeDepositSchema = z.object({
    type: z.literal(TransactionType.CHEQUE_DEPOSIT, {
        required_error: "Transaction type is required",
        invalid_type_error: "Transaction type must be CHEQUE_DEPOSIT",
    }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
    currency: z.string().min(1, { message: "Currency is required" }),
    accountType: z.enum(["loanAccount", "investmentAccount", "checkingAccount"], {
        required_error: "Account type is required",
        invalid_type_error: "Account type must be loanAccount, investmentAccount, or checkingAccount",
    }),
    chequeDetails: z.object({
        chequeNumber: z.string().min(1, { message: "Cheque number is required" }),
        date: z.string().refine(
            (date) => {
                const parsedDate = new Date(date);
                return !isNaN(parsedDate.getTime());
            },
            { message: "Invalid date format" }
        ),
        description: z.string().min(1, { message: "Description is required" }),
        frontImage: z.string().min(1, { message: "Front cheque image is required" }),
        backImage: z.string().min(1, { message: "Back cheque image is required" }),
    }, { required_error: "Cheque details are required for CHEQUE_DEPOSIT transactions" }),
});

export type DepositFormData = z.infer<typeof DepositSchema>;
export type ChequeDepositFormData = z.infer<typeof ChequeDepositSchema>;

export const StatementRequestSchema = z.object({
    accountType: z.enum(["checkingAccount", "loanAccount", "investmentAccount"], {
        required_error: "Account type is required",
        invalid_type_error: "Invalid account type",
    }),
    startDate: z.string().refine(
        (date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        },
        { message: "Invalid start date format" }
    ),
    endDate: z.string().refine(
        (date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        },
        { message: "Invalid end date format" }
    ),
    format: z.enum(["PDF", "CSV", "OFX"], {
        required_error: "File format is required",
        invalid_type_error: "Invalid file format",
    }),
}).refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    { message: "Start date must be before end date", path: ["endDate"] }
);

export type StatementRequestFormData = z.infer<typeof StatementRequestSchema>;

export const TransferSchema = z.object({
    status: z.literal(TransactionStatus.COMPLETED, {
        required_error: "Transaction status is required",
        invalid_type_error: "Transaction status must be COMPLETED",
    }),
    type: z.literal(TransactionType.TRANSFER, {
        required_error: "Transaction type is required",
        invalid_type_error: "Transaction type must be INTERNATIONAL_TRANSFER",
    }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
    currency: z.string().min(1, { message: "Currency is required" }),
    accountType: z.enum(["loanAccount", "investmentAccount", "checkingAccount"], {
        required_error: "Account type is required",
        invalid_type_error: "Account type must be loanAccount, investmentAccount, or checkingAccount",
    }),
    transferDetails: z.object({
        accountName: z.string().min(1, { message: "Account holder name is required" }),
        accountNumber: z.string().min(1, { message: "Account number is required" }),
        bankName: z.string().min(1, { message: "Bank name is required" }),
        country: z.string().min(1, { message: "Country is required" }),
        swiftCode: z.string().min(8, { message: "Swift Code is required" }),
        iban: z.string().optional(),
        bankAddress: z.string().min(1, { message: "Bank address is required" }),
        description: z.string().optional(),
    }, { required_error: "Transfer details are required for INTERNATIONAL_TRANSFER transactions" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(35, { message: "Password should be less than 35 characters" })
        .refine(value => /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(value), {
            message: "Password must contain at least one uppercase letter and one symbol",
        }),
});

export type TransferFormData = z.infer<typeof TransferSchema>;

export const LoanPaymentSchema = z.object({
    type: z.literal(TransactionType.LOAN_PAYMENT, {
        required_error: "Transaction type is required",
        invalid_type_error: "Transaction type must be LOAN_PAYMENT",
    }),
    amount: z.number().positive({ message: "Amount must be a positive number" }),
    currency: z.string().min(1, { message: "Currency is required" }),
    accountType: z.enum(["loanAccount", "investmentAccount", "checkingAccount"], {
        required_error: "Account type is required",
        invalid_type_error: "Account type must be checkingAccount or investmentAccount",
    }),
    loanId: z.string().min(1, { message: "Loan ID is required" }),
});

export const CreditLimitUpdateSchema = z.object({
    requestedLimit: z.number().positive({ message: "Requested limit must be positive" })
        .refine((val) => val >= 1000, { message: "Requested limit must be at least $1000" }),
    reason: z.string().min(1, { message: "Reason is required" }),
    additionalInfo: z.string().optional(),
});

export type LoanPaymentFormData = z.infer<typeof LoanPaymentSchema>;
export type CreditLimitUpdateFormData = z.infer<typeof CreditLimitUpdateSchema>;