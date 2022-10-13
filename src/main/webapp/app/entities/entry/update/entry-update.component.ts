import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EntryFormService, EntryFormGroup } from './entry-form.service';
import { IEntry } from '../entry.model';
import { EntryService } from '../service/entry.service';
import { IBlog } from 'app/entities/blog/blog.model';
import { BlogService } from 'app/entities/blog/service/blog.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

@Component({
  selector: 'jhi-entry-update',
  templateUrl: './entry-update.component.html',
})
export class EntryUpdateComponent implements OnInit {
  isSaving = false;
  entry: IEntry | null = null;

  blogsSharedCollection: IBlog[] = [];
  tagsSharedCollection: ITag[] = [];

  editForm: EntryFormGroup = this.entryFormService.createEntryFormGroup();

  constructor(
    protected entryService: EntryService,
    protected entryFormService: EntryFormService,
    protected blogService: BlogService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBlog = (o1: IBlog | null, o2: IBlog | null): boolean => this.blogService.compareBlog(o1, o2);

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entry }) => {
      this.entry = entry;
      if (entry) {
        this.updateForm(entry);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entry = this.entryFormService.getEntry(this.editForm);
    if (entry.id !== null) {
      this.subscribeToSaveResponse(this.entryService.update(entry));
    } else {
      this.subscribeToSaveResponse(this.entryService.create(entry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntry>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(entry: IEntry): void {
    this.entry = entry;
    this.entryFormService.resetForm(this.editForm, entry);

    this.blogsSharedCollection = this.blogService.addBlogToCollectionIfMissing<IBlog>(this.blogsSharedCollection, entry.blog);
    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, ...(entry.tags ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.blogService
      .query()
      .pipe(map((res: HttpResponse<IBlog[]>) => res.body ?? []))
      .pipe(map((blogs: IBlog[]) => this.blogService.addBlogToCollectionIfMissing<IBlog>(blogs, this.entry?.blog)))
      .subscribe((blogs: IBlog[]) => (this.blogsSharedCollection = blogs));

    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.entry?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
