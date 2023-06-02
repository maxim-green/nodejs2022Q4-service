import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from '../../database/database.service';

const COLLECTION = 'album';
const FAVS_COLLECTION = 'favs';

@Injectable()
export class AlbumService {
  constructor(private db: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return this.db.create(COLLECTION, createAlbumDto);
  }

  findAll() {
    return this.db.read(COLLECTION);
  }

  findOne(id: string) {
    const album = this.db.readOneById(COLLECTION, id);
    if (!album) {
      throw new NotFoundException();
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.db.readOneById(COLLECTION, id);
    if (!album) {
      throw new NotFoundException();
    }
    return this.db.updateOneById(COLLECTION, id, updateAlbumDto);
  }

  remove(id: string) {
    const album = this.db.readOneById(COLLECTION, id);
    if (!album) {
      throw new NotFoundException();
    }
    const { id: favsId, albums } = this.db.read(FAVS_COLLECTION)?.[0] || {};
    if (albums?.includes(id)) {
      this.db.updateOneById(FAVS_COLLECTION, favsId, {
        albums: albums.filter((album) => album !== id),
      });
    }

    this.db.updateManyBy('track', { albumId: id }, { albumId: null });

    return this.db.deleteOneById(COLLECTION, id);
  }
}
