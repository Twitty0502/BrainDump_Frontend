import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinBoard } from './join-board';

describe('JoinBoard', () => {
  let component: JoinBoard;
  let fixture: ComponentFixture<JoinBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
