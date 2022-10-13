import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntry } from '../entry.model';

@Component({
  selector: 'jhi-entry-detail',
  templateUrl: './entry-detail.component.html',
})
export class EntryDetailComponent implements OnInit {
  entry: IEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entry }) => {
      this.entry = entry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
