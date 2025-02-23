import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-card-pagination',
  templateUrl: './card-pagination.component.html',
  styleUrl: './card-pagination.component.css'
})
export class CardPaginationComponent implements OnInit {

  @Input() totalItems: any;
  @Input() currentPage: any;
  @Input() itemsPerPage: any;
  @Output() onClick: EventEmitter<number> = new EventEmitter(); // Küldi az oldalszámot
  totalPages = 0;
  pages: number[] = []

  constructor(private http: HttpClient, private base:BaseService) {}

  ngOnInit(): void {
    if (this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1)
    }
  }

  pageClicked(page: number) {
    if(page<=this.totalPages)
      this.onClick.emit(page);
  }
}
