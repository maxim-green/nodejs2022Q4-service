import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { TrackModule } from './resources/track/track.module';
import { ArtistModule } from './resources/artist/artist.module';
import { AlbumModule } from './resources/album/album.module';
import { FavsModule } from './resources/favs/favs.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
