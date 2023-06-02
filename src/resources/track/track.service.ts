import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from '../../database/database.service';

const COLLECTION = 'track';
const FAVS_COLLECTION = 'favs';

@Injectable()
export class TrackService {
  constructor(private db: DatabaseService) {}

  create(createTrackDto: CreateTrackDto) {
    return this.db.create(COLLECTION, {
      ...createTrackDto,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
    });
  }

  findAll() {
    return this.db.read(COLLECTION);
  }

  findOne(id: string) {
    const track = this.db.readOneById(COLLECTION, id);
    if (!track) {
      throw new NotFoundException();
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.db.readOneById(COLLECTION, id);
    if (!track) {
      throw new NotFoundException();
    }
    return this.db.updateOneById(COLLECTION, id, updateTrackDto);
  }

  remove(id: string) {
    const track = this.db.readOneById(COLLECTION, id);
    if (!track) {
      throw new NotFoundException();
    }
    const { id: favsId, tracks } = this.db.read(FAVS_COLLECTION)?.[0] || {};
    if (tracks?.includes(id)) {
      this.db.updateOneById(FAVS_COLLECTION, favsId, {
        tracks: tracks.filter((track) => track !== id),
      });
    }
    return this.db.deleteOneById(COLLECTION, id);
  }
}
