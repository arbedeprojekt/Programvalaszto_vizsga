import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSubscribedComponent } from './events-subscribed.component';

describe('EventsSubscribedComponent', () => {
  let component: EventsSubscribedComponent;
  let fixture: ComponentFixture<EventsSubscribedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsSubscribedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsSubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
