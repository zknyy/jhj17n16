import dayjs from 'dayjs/esm';
import { IBlog } from 'app/entities/blog/blog.model';
import { ITag } from 'app/entities/tag/tag.model';

export interface IEntry {
  id: number;
  title?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
  blog?: Pick<IBlog, 'id' | 'name'> | null;
  tags?: Pick<ITag, 'id' | 'name'>[] | null;
}

export type NewEntry = Omit<IEntry, 'id'> & { id: null };
