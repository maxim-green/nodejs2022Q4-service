import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../../database/database.service';

const COLLECTION = 'artist';
const FAVS_COLLECTION = 'favs';

@Injectable()
export class ArtistService {
  constructor(private db: DatabaseService) {}

  create(createArtistDto: CreateArtistDto) {
    return this.db.create(COLLECTION, createArtistDto);
  }

  findAll() {
    return this.db.read(COLLECTION);
  }

  findOne(id: string) {
    const artist = this.db.readOneById(COLLECTION, id);
    if (!artist) {
      throw new NotFoundException();
    }
    return this.db.readOneById(COLLECTION, id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.db.readOneById(COLLECTION, id);
    if (!artist) {
      throw new NotFoundException();
    }
    return this.db.updateOneById(COLLECTION, id, updateArtistDto);
  }

  remove(id: string) {
    const artist = this.db.readOneById(COLLECTION, id);
    if (!artist) {
      throw new NotFoundException();
    }
    const { id: favsId, artists } = this.db.read(FAVS_COLLECTION)?.[0] || {};
    if (artists?.includes(id)) {
      this.db.updateOneById(FAVS_COLLECTION, favsId, {
        artists: artists.filter((artist) => artist !== id),
      });
    }

    this.db.updateManyBy('track', { artistId: id }, { artistId: null });
    this.db.updateManyBy('album', { artistId: id }, { artistId: null });

    return this.db.deleteOneById(COLLECTION, id);
  }
}
