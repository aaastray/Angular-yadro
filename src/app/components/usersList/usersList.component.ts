import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {User} from '../../data/domain/user';
import {UsersService} from '../../data/services/users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NzCardModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './usersList.component.html'
})

export class UserList implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  pageSize = 5;
  pageIndex = 1;
  total = 0;

  searchValue = '';

  loading = false;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getAllUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
          this.total = data.length;
          this.filterUsers();
          this.loading = false;
        },
        error: (error) => {
          console.error('Произошла ошибка при получении пользователей:', error);
          this.loading = false;
        }
      });
  }

  filterUsers(): void {
    if (this.searchValue) {
      this.filteredUsers = this.users.filter(user =>
        user &&
        (
          (user.name && user.name.toLowerCase().includes(this.searchValue.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(this.searchValue.toLowerCase())) ||
          (user.username && user.username.toLowerCase().includes(this.searchValue.toLowerCase()))
        )
      );
    } else {
      this.filteredUsers = [...this.users];
    }
    this.total = this.filteredUsers.length;
  }


  onSearch(): void {
    this.pageIndex = 1;
    this.filterUsers();
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
  }

  resetSearch(): void {
    this.searchValue = '';
    this.filterUsers();
  }

  navigateToUserDetail(userId: number): void {
    this.router.navigate(['/users', userId]);
  }

  navigateToCreateUser(): void {
    this.router.navigate(['/users/create/new'])
  }
}
