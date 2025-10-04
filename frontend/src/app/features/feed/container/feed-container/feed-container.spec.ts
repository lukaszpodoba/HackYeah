import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedContainer } from './feed-container';

describe('FeedContainer', () => {
  let component: FeedContainer;
  let fixture: ComponentFixture<FeedContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
