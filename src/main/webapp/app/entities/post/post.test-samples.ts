import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
  title: 'Fantastic',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-10-31T03:27'),
};

export const sampleWithPartialData: IPost = {
  id: 93202,
  title: 'Seychelles',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-10-30T19:40'),
};

export const sampleWithFullData: IPost = {
  id: 23240,
  title: 'recontextualize virtual copying',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-10-30T21:21'),
};

export const sampleWithNewData: NewPost = {
  title: 'withdrawal',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-10-30T22:52'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
