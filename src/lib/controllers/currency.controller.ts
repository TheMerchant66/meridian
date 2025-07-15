import { NextRequest, NextResponse } from "next/server";
import { CurrencyService } from "../services/currency.service";
import CurrencyServiceImpl from "../services/impl/currency.service.impl";
import { CreateCurrencyDto, UpdateCurrencyDto } from "../dto/currency.dto";
import { validator } from "../utils/validator.utils";

const currencyService: CurrencyService = new CurrencyServiceImpl();

export async function createCurrencyController(req: NextRequest) {
    try {
        const body = await req.json();
        const createCurrencyDto = new CreateCurrencyDto(body);

        const errors = validator(CreateCurrencyDto, createCurrencyDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const currency = await currencyService.createCurrency(createCurrencyDto);
        return NextResponse.json({ message: 'Currency created successfully', currency }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getAllCurrenciesController() {
    try {
        const currencies = await currencyService.getAllCurrencies();
        return NextResponse.json({ message: 'Currencies retrieved successfully', currencies }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function getCurrencyByIdController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const currency = await currencyService.getCurrencyById(resolvedParams.id);
        return NextResponse.json({ message: 'Currency retrieved successfully', currency }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function updateCurrencyController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const body = await req.json();
        const updateCurrencyDto = new UpdateCurrencyDto(body);

        const errors = validator(UpdateCurrencyDto, updateCurrencyDto);
        if (errors) {
            return NextResponse.json({ message: 'Validation Error', errors: errors.details }, { status: 400 });
        }

        const currency = await currencyService.updateCurrency(resolvedParams.id, updateCurrencyDto);
        return NextResponse.json({ message: 'Currency updated successfully', currency }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}

export async function deleteCurrencyController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        await currencyService.deleteCurrency(resolvedParams.id);
        return NextResponse.json({ message: 'Currency deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: error.statusCode || 500 });
    }
}