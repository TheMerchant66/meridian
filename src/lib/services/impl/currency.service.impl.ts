import { CurrencyService } from '../currency.service';
import { Currency, ICurrency } from '../../models/currency.model';
import { CreateCurrencyDto, UpdateCurrencyDto } from '../../dto/currency.dto';
import { CustomError } from '../../utils/customError.utils';

class CurrencyServiceImpl implements CurrencyService {
    async createCurrency(currencyData: CreateCurrencyDto): Promise<ICurrency> {
        const existingCurrency = await Currency.findOne({ name: currencyData.name });
        if (existingCurrency) {
            throw new CustomError(409, 'Currency with this name already exists');
        }

        const currency = new Currency(currencyData);
        await currency.save();
        return currency;
    }

    async getAllCurrencies(): Promise<ICurrency[]> {
        return await Currency.find().sort({ name: 1 });
    }

    async getCurrencyById(id: string): Promise<ICurrency> {
        const currency = await Currency.findById(id);
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }
        return currency;
    }

    async updateCurrency(id: string, currencyData: UpdateCurrencyDto): Promise<ICurrency> {
        const currency = await Currency.findById(id);
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }

        if (currencyData.name && currencyData.name !== currency.name) {
            const existingCurrency = await Currency.findOne({ name: currencyData.name });
            if (existingCurrency) {
                throw new CustomError(409, 'Currency with this name already exists');
            }
        }

        Object.assign(currency, currencyData);
        await currency.save();
        return currency;
    }

    async deleteCurrency(id: string): Promise<void> {
        const currency = await Currency.findById(id);
        if (!currency) {
            throw new CustomError(404, 'Currency not found');
        }
        await Currency.findByIdAndDelete(id);
    }
}

export default CurrencyServiceImpl;