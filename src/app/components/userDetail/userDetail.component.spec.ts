import {ComponentFixture, TestBed, fakeAsync, flush, tick} from '@angular/core/testing';
import {UserDetailComponent} from './userDetail.component';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError, Subject} from 'rxjs';
import {UsersService} from '../../data/services/users.service';
import {User} from '../../data/domain/user';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ArrowLeftOutline} from '@ant-design/icons-angular/icons';
import {NZ_ICONS} from 'ng-zorro-antd/icon';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockUsersService: any;
  let paramMapSubject: Subject<any>;

  beforeEach(async () => {
    paramMapSubject = new Subject();

    mockActivatedRoute = {
      paramMap: paramMapSubject.asObservable()
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUsersService = jasmine.createSpyObj('UsersService', [
      'getUserById',
      'deleteUser'
    ]);

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent], // standalone component!
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter},
        {provide: UsersService, useValue: mockUsersService},
        {provide: NZ_ICONS, useValue: [ArrowLeftOutline]}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('создается', () => {
    expect(component).toBeTruthy();
  });

  it('вызывает loadUserDetails если id есть в params', () => {
    spyOn(component, 'loadUserDetails');
    paramMapSubject.next({
      get: (str: string) => str === 'id' ? '123' : null
    });
    expect(component.loadUserDetails).toHaveBeenCalledWith(123);
  });

  it('вызывает navigateToUsersList если id нет в params', () => {
    spyOn(component, 'navigateToUsersList');
    paramMapSubject.next({
      get: (_: string) => null
    });
    expect(component.navigateToUsersList).toHaveBeenCalled();
  });

  it('loadUserDetails: успешно загружает пользователя', fakeAsync(() => {
    const user: User = {id: 123, name: 'John'} as any;
    mockUsersService.getUserById.and.returnValue(of(user));

    component.loadUserDetails(123);
    tick();
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
    expect(component.user).toEqual(user);
  }));

  it('loadUserDetails: обрабатывает ошибку', fakeAsync(() => {
    mockUsersService.getUserById.and.returnValue(throwError(() => new Error('fail')));
    spyOn(console, 'error');

    component.loadUserDetails(456);
    tick();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeTrue();
    expect(console.error).toHaveBeenCalled();
  }));

  it('navigateToEditUser: вызывает переход к /users/{id}/edit', () => {
    component.userId = 42;
    component.navigateToEditUser();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users', 42, 'edit']);
  });

  it('navigateToEditUser: не вызывает navigate если userId не задан', () => {
    component.userId = null;
    component.navigateToEditUser();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('deleteSelectUser: удаление и возврат к списку', fakeAsync(() => {
    component.userId = 99;
    mockUsersService.deleteUser.and.returnValue(of({}));
    spyOn(component, 'navigateToUsersList');

    component.deleteSelectUser();
    tick();

    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(99);
    expect(component.navigateToUsersList).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  }));

  it('deleteSelectUser: ошибка удаления', fakeAsync(() => {
    component.userId = 77;
    mockUsersService.deleteUser.and.returnValue(throwError(() => new Error('delete fail')));
    spyOn(console, 'error');

    component.deleteSelectUser();
    tick();

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  }));

  it('deleteSelectUser: не вызывает удаление если userId не задан', () => {
    component.userId = null;
    component.deleteSelectUser();
    expect(mockUsersService.deleteUser).not.toHaveBeenCalled();
  });

  it('navigateToUsersList вызывает router.navigate', () => {
    component.navigateToUsersList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

});
