import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntryDetailComponent } from './entry-detail.component';

describe('Entry Management Detail Component', () => {
  let comp: EntryDetailComponent;
  let fixture: ComponentFixture<EntryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ entry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EntryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EntryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load entry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.entry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
