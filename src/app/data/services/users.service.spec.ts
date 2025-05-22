import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UsersService} from './users.service';
import {User} from '../domain/user';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {id: 1, name: 'User1', username: 'user1', email: 'user1@email.com'} as User,
    {id: 2, name: 'User2', username: 'user2', email: 'user2@email.com'} as User,
  ];
  const mockUser: User = {id: 1, name: 'User1', username: 'user1', email: 'user1@email.com'} as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('должен создаваться сервис', () => {
    expect(service).toBeTruthy();
  });

  it('должен получать всех юзеров', () => {
    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service.baseUrl}users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('должен получать юзера по ID', () => {
    const id = 1;
    service.getUserById(id).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service.baseUrl}users/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('должен создать юзера', () => {
    service.createUser(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service.baseUrl}users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('должен обновлять юзера', () => {
    service.updateUser(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service.baseUrl}users/${mockUser.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('должен удалять пользователя', () => {
    const id = 1;
    service.deleteUser(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service.baseUrl}users/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
