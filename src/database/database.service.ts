import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

type DataItem = {
  id?: string;
  [key: string]: any;
};

type Data = { [collection: string]: DataItem[] };

@Injectable()
export class DatabaseService {
  private _data: Data = {};

  create(collection: string, payload: DataItem) {
    const dataWithId = { ...payload, id: uuid.v4() };
    if (this._data[collection]) {
      this._data[collection].push(dataWithId);
    } else {
      this._data[collection] = [dataWithId];
    }
    return dataWithId;
  }

  read(collection: string) {
    return this._data?.[collection] || [];
  }

  readOneById(collection: string, id: string) {
    return this._data?.[collection]?.find((item) => item.id === id) || null;
  }

  updateOneById(collection: string, id: string, payload: DataItem) {
    this._data[collection] = this._data[collection]?.map((item) =>
      item.id === id ? { ...item, ...payload, id: item.id } : item,
    );
    return this._data[collection]?.find((item) => item.id === id) || null;
  }

  updateManyBy(collection: string, query: DataItem, payload: DataItem) {
    const updatedItems = [];
    this._data[collection] = this._data[collection]?.map((item) => {
      const condition = Object.keys(query).every((key) => {
        return (
          item[key] === query[key] ||
          JSON.stringify(item[key]) === JSON.stringify(query[key])
        );
      });
      if (condition) {
        const updatedItem = { ...item, ...payload };
        updatedItems.push(updatedItem);
        return { ...item, ...payload };
      }
      return item;
    });
    return updatedItems;
  }

  deleteOneById(collection: string, id: string) {
    if (!this._data[collection]) {
      return null;
    }
    const item = this._data[collection].find((item) => item.id === id) || null;
    this._data[collection] = this._data[collection].filter(
      (item) => item.id !== id,
    );
    return item;
  }
}
