import { CreateCurrencyDto, UpdateCurrencyDto } from "../dto/currency.dto";
import { ICurrency } from "../models/currency.model";

export interface CurrencyService {
    getAllCurrencies(): Promise<ICurrency[]>;

    // Admin Methods
    createCurrency(currencyData: CreateCurrencyDto): Promise<ICurrency>;
    getCurrencyById(id: string): Promise<ICurrency>;
    updateCurrency(id: string, currencyData: UpdateCurrencyDto): Promise<ICurrency>;
    deleteCurrency(id: string): Promise<void>;
}