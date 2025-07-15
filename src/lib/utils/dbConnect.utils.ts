import mongoose from 'mongoose';
import { Currency } from '../models/currency.model';
import { User } from '../models/user.model';
import { Role } from '../enums/role.enum';
import bcrypt from 'bcryptjs';

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedConnection: typeof mongoose | null = null;

export async function dbConnect() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI);
    cachedConnection = connection;

    await seedDatabase();
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ role: Role.ADMIN });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('@StellatOneAdmin123', 10);
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        userName: 'admin',
        email: 'admin@stellaroneholdings.com',
        password: hashedPassword,
        dateOfBirth: new Date('1990-01-01'),
        phoneNumber: '+1234567890',
        role: Role.ADMIN,
        verified: true,
        accountLevel: 'Platinum',
        loanAccount: { balance: 0, creditLimit: 100000 },
        investmentAccount: { balance: 0 },
        checkingAccount: {
          accountNumber: '12345678910',
          balance: 0,
          cardNumber: '4111111111111111',
          expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
          cvc: '123',
        },
        country: 'USA',
        postalCode: '10001',
        state: 'NY',
        city: 'New York',
        address: '123 Admin Street',
      });
      await adminUser.save();
      console.log('Admin user seeded successfully');
    }

    const usdExists = await Currency.findOne({ name: 'USDT(ETH)' });
    if (!usdExists) {
      const usdCurrency = new Currency({
        name: 'USDT(ETH)',
        walletAddress: `0xdB1ba58Ad217b5E5A1d1Eb3aeD1E8F92B8f3F395`,
        active: true,
      });
      await usdCurrency.save();
      console.log('USD currency seeded successfully');
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}