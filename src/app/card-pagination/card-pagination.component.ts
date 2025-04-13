import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseService } from '../base.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-card-pagination',
  templateUrl: './card-pagination.component.html',
  styleUrl: './card-pagination.component.css'
})
export class CardPaginationComponent implements OnInit {

  @Input() totalItems: any
  @Input() currentPage: any
  @Input() itemsPerPage: any
  @Output() onClick: EventEmitter<number> = new EventEmitter() // Küldi az oldalszámot
  totalPages = 0
  pages: number[] = []

  constructor(private http: HttpClient, private base:BaseService, private route: ActivatedRoute, private router: Router) {}

  // ngOnInit(): void {
  //   if (this.totalItems) {
  //     this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
  //     this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1)
  //   }
  // }

  // pageClicked(page: number) {
  //   if(page<=this.totalPages)
  //     this.onClick.emit(page)
  // }

  ngOnInit(): void {
    this.calculatePages()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.calculatePages()
    }
  }

  private calculatePages() {
    if (this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
    } else {
      this.totalPages = 0
      this.pages = []
    }
  }

  pageClicked(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.onClick.emit(page)
    }
  }

  //megkapjuk, hogy mi a megfelelő útvonal ahhoz az oldalhoz, ahol éppen vagyunk
  getCurrentRoute(): string {
    return this.router.url.split('?')[0];
  }
}
