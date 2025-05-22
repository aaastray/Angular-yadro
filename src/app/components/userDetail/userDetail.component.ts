import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {User} from '../../data/domain/user';
import {UsersService} from '../../data/services/users.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzDividerModule,
    NzSkeletonModule,
    NzIconModule,
    NzTagModule,
    NzGridModule,
    NzSpinModule,
    NzCollapseModule
  ],
  templateUrl: './userDetail.component.html'
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null;
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUserDetails(this.userId);
      } else {
        this.navigateToUsersList();
      }
    });
  }

  loadUserDetails(id: number): void {
    this.loading = true;
    this.error = false;

    this.usersService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных пользователя:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  navigateToUsersList(): void {
    this.router.navigate(['/users']);
  }

  navigateToEditUser(): void {
    if (this.userId) {
      console.log(`Navigating to edit user with ID: ${this.userId}`);
      this.router.navigate(['/users', this.userId, 'edit']);
    }
  }

  deleteSelectUser(): void {
    if (this.userId) {
      console.log(`Удален пользователь с ID: ${this.userId}`);
      this.usersService.deleteUser(this.userId).subscribe({
        next: () => {
          this.navigateToUsersList()
          console.log('Пользователь успешно удален');
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка при удалении пользователя:', err);
          this.error = true;
          this.loading = false;
        }
      })
    }
  }
}
