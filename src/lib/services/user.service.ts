import { ChangePasswordDto, UpdateProfileDto, UpdateProfilePictureDto } from '../dto/user.dto';
import { IUser } from '../models/user.model';
import { UpdateUserDto } from '../dto/admin.dto';
import { ITransaction } from '../models/transaction.model';

export interface UserService {
  getUserDetails(userId: string): Promise<IUser>;
  changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
  updateProfile(userId: string, profileData: UpdateProfileDto): Promise<IUser>;
  updateProfilePicture(userId: string, pictureData: UpdateProfilePictureDto): Promise<IUser>;
  removeProfilePicture(userId: string): Promise<IUser>;

  // Admin Methods
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  updateUser(id: string, userData: UpdateUserDto): Promise<IUser>;
  getUserAccounts(userId: string): Promise<any>;
  getUserLastThreeTransactions(userId: string): Promise<ITransaction[]>;
  updateAccountBalance(userId: string, accountType: string, balance: number): Promise<IUser>;
  toggleTransactionStatus(userId: string, allowTransfer: boolean): Promise<IUser>;
}