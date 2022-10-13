import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntryFormService } from './entry-form.service';
import { EntryService } from '../service/entry.service';
import { IEntry } from '../entry.model';
import { IBlog } from 'app/entities/blog/blog.model';
import { BlogService } from 'app/entities/blog/service/blog.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { EntryUpdateComponent } from './entry-update.component';

describe('Entry Management Update Component', () => {
  let comp: EntryUpdateComponent;
  let fixture: ComponentFixture<EntryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entryFormService: EntryFormService;
  let entryService: EntryService;
  let blogService: BlogService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntryUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EntryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entryFormService = TestBed.inject(EntryFormService);
    entryService = TestBed.inject(EntryService);
    blogService = TestBed.inject(BlogService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Blog query and add missing value', () => {
      const entry: IEntry = { id: 456 };
      const blog: IBlog = { id: 69297 };
      entry.blog = blog;

      const blogCollection: IBlog[] = [{ id: 84393 }];
      jest.spyOn(blogService, 'query').mockReturnValue(of(new HttpResponse({ body: blogCollection })));
      const additionalBlogs = [blog];
      const expectedCollection: IBlog[] = [...additionalBlogs, ...blogCollection];
      jest.spyOn(blogService, 'addBlogToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ entry });
      comp.ngOnInit();

      expect(blogService.query).toHaveBeenCalled();
      expect(blogService.addBlogToCollectionIfMissing).toHaveBeenCalledWith(
        blogCollection,
        ...additionalBlogs.map(expect.objectContaining)
      );
      expect(comp.blogsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tag query and add missing value', () => {
      const entry: IEntry = { id: 456 };
      const tags: ITag[] = [{ id: 47566 }];
      entry.tags = tags;

      const tagCollection: ITag[] = [{ id: 77823 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...tags];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ entry });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags.map(expect.objectContaining));
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const entry: IEntry = { id: 456 };
      const blog: IBlog = { id: 5179 };
      entry.blog = blog;
      const tag: ITag = { id: 12463 };
      entry.tags = [tag];

      activatedRoute.data = of({ entry });
      comp.ngOnInit();

      expect(comp.blogsSharedCollection).toContain(blog);
      expect(comp.tagsSharedCollection).toContain(tag);
      expect(comp.entry).toEqual(entry);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntry>>();
      const entry = { id: 123 };
      jest.spyOn(entryFormService, 'getEntry').mockReturnValue(entry);
      jest.spyOn(entryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entry }));
      saveSubject.complete();

      // THEN
      expect(entryFormService.getEntry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(entryService.update).toHaveBeenCalledWith(expect.objectContaining(entry));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntry>>();
      const entry = { id: 123 };
      jest.spyOn(entryFormService, 'getEntry').mockReturnValue({ id: null });
      jest.spyOn(entryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entry }));
      saveSubject.complete();

      // THEN
      expect(entryFormService.getEntry).toHaveBeenCalled();
      expect(entryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntry>>();
      const entry = { id: 123 };
      jest.spyOn(entryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBlog', () => {
      it('Should forward to blogService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(blogService, 'compareBlog');
        comp.compareBlog(entity, entity2);
        expect(blogService.compareBlog).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTag', () => {
      it('Should forward to tagService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tagService, 'compareTag');
        comp.compareTag(entity, entity2);
        expect(tagService.compareTag).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
