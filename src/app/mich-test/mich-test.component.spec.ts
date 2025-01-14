import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MichTestComponent } from './mich-test.component';

describe('MichTestComponent', () => {
  let component: MichTestComponent;
  let fixture: ComponentFixture<MichTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MichTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MichTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
