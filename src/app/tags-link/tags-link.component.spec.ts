import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsLinkComponent } from './tags-link.component';

describe('TagsLinkComponent', () => {
  let component: TagsLinkComponent;
  let fixture: ComponentFixture<TagsLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagsLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
