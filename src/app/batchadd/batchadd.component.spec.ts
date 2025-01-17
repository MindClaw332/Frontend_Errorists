import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchaddComponent } from './batchadd.component';

describe('BatchaddComponent', () => {
  let component: BatchaddComponent;
  let fixture: ComponentFixture<BatchaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchaddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
