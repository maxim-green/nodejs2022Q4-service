import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from '../../database/database.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

const COLLECTION = 'user';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    const user = this.db.create(COLLECTION, {
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { ...user, password: undefined };
  }

  findAll() {
    return this.db
      .read(COLLECTION)
      .map((user) => ({ ...user, password: undefined }));
  }

  findOne(id: string) {
    const user = this.db.readOneById(COLLECTION, id);
    if (!user) {
      throw new NotFoundException();
    }
    return { ...user, password: undefined };
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = this.db.readOneById(COLLECTION, id);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.password !== oldPassword) {
      throw new ForbiddenException();
    }
    const updatedUser = this.db.updateOneById(COLLECTION, id, {
      version: user.version + 1,
      updatedAt: Date.now(),
      password: newPassword,
    });
    return { ...updatedUser, password: undefined };
  }

  remove(id: string) {
    const user = this.db.readOneById(COLLECTION, id);
    if (!user) {
      throw new NotFoundException();
    }
    this.db.deleteOneById(COLLECTION, id);
    return { ...user, password: undefined };
  }
}
