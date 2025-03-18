import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTagsLinkComponent } from './events-tags-link.component';

describe('EventsTagsLinkComponent', () => {
  let component: EventsTagsLinkComponent;
  let fixture: ComponentFixture<EventsTagsLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsTagsLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsTagsLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
