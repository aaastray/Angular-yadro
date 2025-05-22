import {TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {UserList} from './usersList.component';
import {UsersService} from '../../data/services/users.service';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../../data/domain/user';

describe('UserList', () => {
  let component: UserList;
  let fixture: ComponentFixture<UserList>;
  let usersServiceMock: any;
  let routerMock: any;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      website: 'example.com',
      address: {
        street: 'Main St',
        suite: 'Apt. 1',
        city: 'Metropolis',
        zipcode: '12345',
        geo: {
          lat: '40.7128',
          lng: '74.0060',
        },
      },
      company: {
        name: 'Acme Corp',
        catchPhrase: 'Innovate and Inspire',
        bs: 'synergize scalable solutions',
      }
    },
    {
      id: 3,
      name: "Clementine Bauch",
      username: "Samantha",
      email: "Nathan@yesenia.net",
      address: {
        street: "Douglas Extension",
        suite: "Suite 847",
        city: "McKenziehaven",
        zipcode: "59590-4157",
        geo: {
          lat: "-68.6102",
          lng: "-47.0653"
        }
      },
      phone: "1-463-123-4447",
      website: "ramiro.info",
      company: {
        name: "Romaguera-Jacobson",
        catchPhrase: "Face to face bifurcated interface",
        bs: "e-enable strategic applications"
      }
    }
  ];

  beforeEach(async () => {
    usersServiceMock = {
      getAllUsers: jasmine.createSpy().and.returnValue(of(mockUsers))
    };
    routerMock = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        {provide: UsersService, useValue: usersServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserList);
    component = fixture.componentInstance;
  });

  it('должен загружать пользователей при инициализации компонента', fakeAsync(() => {
    spyOn(component, 'loadUsers'); // Jasmine-стиль
    component.ngOnInit();
    expect(component.loadUsers).toHaveBeenCalled();
  }));

  it('должен корректно загружать пользователей и выставлять значения полей', fakeAsync(() => {
    component.loadUsers();
    tick();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
    expect(component.total).toBe(2);
    expect(component.loading).toBe(false);
  }));

  it('должен обрабатывать ошибку при загрузке пользователей', fakeAsync(() => {
    usersServiceMock.getAllUsers.and.returnValue(throwError(() => new Error('fail')));
    const consoleSpy = spyOn(console, 'error');
    component.loadUsers();
    tick();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Произошла ошибка при получении пользователей:',
      jasmine.any(Error)
    );
    expect(component.loading).toBe(false);
  }));


  it('должен фильтровать пользователей по значению поиска', () => {
    component.users = mockUsers;
    component.searchValue = 'John Doe';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('должен показывать всех пользователей, если поле поиска пустое', () => {
    component.users = mockUsers;
    component.searchValue = '';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(2);
  });

  it('должен сбрасывать страницу на первую и фильтровать при поиске', () => {
    component.pageIndex = 5;
    component.users = mockUsers;
    component.searchValue = 'John Doe';
    component.onSearch();
    expect(component.pageIndex).toBe(1);
    expect(component.filteredUsers.length).toBe(1);
  });

  it('должен сбрасывать поиск и выводить всех пользователей', () => {
    component.users = mockUsers;
    component.searchValue = 'ivan';
    component.resetSearch();
    expect(component.searchValue).toBe('');
    expect(component.filteredUsers.length).toBe(2);
  });

  it('должен изменять номер страницы при смене страницы', () => {
    component.onPageIndexChange(3);
    expect(component.pageIndex).toBe(3);
  });

  it('должен изменять размер страницы при выборе другого размера', () => {
    component.onPageSizeChange(20);
    expect(component.pageSize).toBe(20);
  });

  it('должен переходить к деталям пользователя при вызове соответствующего метода', () => {
    component.navigateToUserDetail(1234);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users', 1234]);
  });

  it('должен переходить на создание нового пользователя', () => {
    component.navigateToCreateUser();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users/create/new']);
  });
});
