import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPaginationComponent } from './card-pagination.component';

describe('CardPaginationComponent', () => {
  let component: CardPaginationComponent;
  let fixture: ComponentFixture<CardPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
