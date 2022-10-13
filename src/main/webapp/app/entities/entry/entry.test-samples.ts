import dayjs from 'dayjs/esm';

import { IEntry, NewEntry } from './entry.model';

export const sampleWithRequiredData: IEntry = {
  id: 62831,
  title: 'calculating functionalities',
  content: 'deliver',
  date: dayjs('2022-10-13T09:42'),
};

export const sampleWithPartialData: IEntry = {
  id: 17376,
  title: 'calculating',
  content: 'Venezuela initiatives Chicken',
  date: dayjs('2022-10-13T16:33'),
};

export const sampleWithFullData: IEntry = {
  id: 74681,
  title: 'generate',
  content: 'invoice',
  date: dayjs('2022-10-13T11:21'),
};

export const sampleWithNewData: NewEntry = {
  title: 'withdrawal Cheese',
  content: '旁 invoice',
  date: dayjs('2022-10-13T09:50'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
