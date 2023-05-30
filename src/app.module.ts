import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { TrackModule } from './resources/track/track.module';

@Module({
  imports: [DatabaseModule, UserModule, TrackModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
