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
    return this.db.create(COLLECTION, createUserDto);
  }

  findAll() {
    return this.db.read(COLLECTION);
  }

  findOne(id: string) {
    const user = this.db.readOneById(COLLECTION, id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
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
    return this.db.updateOneById(COLLECTION, id, {
      password: newPassword,
    });
  }

  remove(id: string) {
    const user = this.db.readOneById(COLLECTION, id);
    if (!user) {
      throw new NotFoundException();
    }
    this.db.deleteOneById(COLLECTION, id);
    return user;
  }
}
