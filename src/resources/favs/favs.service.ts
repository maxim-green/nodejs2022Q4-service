import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';
import { DatabaseService } from '../../database/database.service';

const COLLECTION = 'favs';
const ARTIST_COLLECTION = 'artist';
const ALBUM_COLLECTION = 'album';
const TRACK_COLLECTION = 'track';
const INITIAL_FAVS = {
  artists: [],
  albums: [],
  tracks: [],
};

@Injectable()
export class FavsService {
  constructor(private db: DatabaseService) {}

  private getFavs() {
    const favs =
      this.db.read(COLLECTION)[0] ||
      this.db.create(COLLECTION, { ...INITIAL_FAVS });

    return favs;
  }

  private populateFavs(rawFavs) {
    const populatedFavs = { ...INITIAL_FAVS };
    Object.keys(rawFavs).forEach((key) => {
      if (Array.isArray(rawFavs[key])) {
        const collection = key.replace(/s$/, '');
        populatedFavs[key] = rawFavs[key].map((id) =>
          this.db.readOneById(collection, id),
        );
      }
    });
    return populatedFavs;
  }

  findAll() {
    return this.populateFavs(this.getFavs());
  }

  addTrack(id: string) {
    const track = this.db.readOneById(TRACK_COLLECTION, id);
    if (!track) {
      throw new UnprocessableEntityException();
    }
    const { id: favsId, tracks } = this.getFavs();
    return this.db.updateOneById(COLLECTION, favsId, {
      tracks: [...tracks, id],
    });
  }

  deleteTrack(id: string) {
    const { id: favsId, tracks } = this.getFavs();
    if (!tracks.includes(id)) {
      throw new NotFoundException();
    }
    return this.db.updateOneById(COLLECTION, favsId, {
      tracks: tracks.filter((track) => track !== id),
    });
  }

  addAlbum(id: string) {
    const album = this.db.readOneById(ALBUM_COLLECTION, id);
    if (!album) {
      throw new UnprocessableEntityException();
    }
    const { id: favsId, albums } = this.getFavs();
    return this.db.updateOneById(COLLECTION, favsId, {
      albums: [...albums, id],
    });
  }

  deleteAlbum(id: string) {
    const { id: favsId, albums } = this.getFavs();
    if (!albums.includes(id)) {
      throw new NotFoundException();
    }
    return this.db.updateOneById(COLLECTION, favsId, {
      albums: albums.filter((album) => album !== id),
    });
  }

  addArtist(id: string) {
    const artist = this.db.readOneById(ARTIST_COLLECTION, id);
    if (!artist) {
      throw new UnprocessableEntityException();
    }
    const { id: favsId, artists } = this.getFavs();
    return this.db.updateOneById(COLLECTION, favsId, {
      artists: [...artists, id],
    });
  }

  deleteArtist(id: string) {
    const { id: favsId, artists } = this.getFavs();
    if (!artists.includes(id)) {
      throw new NotFoundException();
    }
    return this.db.updateOneById(COLLECTION, favsId, {
      artists: artists.filter((artist) => artist !== id),
    });
  }
}
