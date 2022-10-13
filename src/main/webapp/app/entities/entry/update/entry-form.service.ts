import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEntry, NewEntry } from '../entry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEntry for edit and NewEntryFormGroupInput for create.
 */
type EntryFormGroupInput = IEntry | PartialWithRequiredKeyOf<NewEntry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEntry | NewEntry> = Omit<T, 'date'> & {
  date?: string | null;
};

type EntryFormRawValue = FormValueOf<IEntry>;

type NewEntryFormRawValue = FormValueOf<NewEntry>;

type EntryFormDefaults = Pick<NewEntry, 'id' | 'date' | 'tags'>;

type EntryFormGroupContent = {
  id: FormControl<EntryFormRawValue['id'] | NewEntry['id']>;
  title: FormControl<EntryFormRawValue['title']>;
  content: FormControl<EntryFormRawValue['content']>;
  date: FormControl<EntryFormRawValue['date']>;
  blog: FormControl<EntryFormRawValue['blog']>;
  tags: FormControl<EntryFormRawValue['tags']>;
};

export type EntryFormGroup = FormGroup<EntryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EntryFormService {
  createEntryFormGroup(entry: EntryFormGroupInput = { id: null }): EntryFormGroup {
    const entryRawValue = this.convertEntryToEntryRawValue({
      ...this.getFormDefaults(),
      ...entry,
    });
    return new FormGroup<EntryFormGroupContent>({
      id: new FormControl(
        { value: entryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(entryRawValue.title, {
        validators: [Validators.required],
      }),
      content: new FormControl(entryRawValue.content, {
        validators: [Validators.required],
      }),
      date: new FormControl(entryRawValue.date, {
        validators: [Validators.required],
      }),
      blog: new FormControl(entryRawValue.blog),
      tags: new FormControl(entryRawValue.tags ?? []),
    });
  }

  getEntry(form: EntryFormGroup): IEntry | NewEntry {
    return this.convertEntryRawValueToEntry(form.getRawValue() as EntryFormRawValue | NewEntryFormRawValue);
  }

  resetForm(form: EntryFormGroup, entry: EntryFormGroupInput): void {
    const entryRawValue = this.convertEntryToEntryRawValue({ ...this.getFormDefaults(), ...entry });
    form.reset(
      {
        ...entryRawValue,
        id: { value: entryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EntryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      tags: [],
    };
  }

  private convertEntryRawValueToEntry(rawEntry: EntryFormRawValue | NewEntryFormRawValue): IEntry | NewEntry {
    return {
      ...rawEntry,
      date: dayjs(rawEntry.date, DATE_TIME_FORMAT),
    };
  }

  private convertEntryToEntryRawValue(
    entry: IEntry | (Partial<NewEntry> & EntryFormDefaults)
  ): EntryFormRawValue | PartialWithRequiredKeyOf<NewEntryFormRawValue> {
    return {
      ...entry,
      date: entry.date ? entry.date.format(DATE_TIME_FORMAT) : undefined,
      tags: entry.tags ?? [],
    };
  }
}
