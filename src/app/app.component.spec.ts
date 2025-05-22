import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен создаваться', () => {
    expect(component).toBeTruthy();
  });

  it('должен иметь начальное значение isCollapsed = false', () => {
    expect(component.isCollapsed).toBeFalse();
  });

  it('должен переключать isCollapsed при клике на триггер', () => {
    const trigger = fixture.debugElement.query(By.css('.header-trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(component.isCollapsed).toBeTrue();
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(component.isCollapsed).toBeFalse();
  });

  it('должен отображать логотип', () => {
    const img = fixture.debugElement.query(By.css('.sidebar-logo img'));
    expect(img).toBeTruthy();
    expect(img.properties['src']).toContain('logo.svg');
  });

  it('должен содержать пункты меню', () => {
    const menuItems = fixture.debugElement.queryAll(By.css('ul[nz-menu] li[nz-menu-item] span'));
    const itemTexts = menuItems.map(item => item.nativeElement.textContent.trim());
    expect(itemTexts).toContain('Начальная');
    expect(itemTexts).toContain('Пользователи');
    expect(itemTexts).toContain('Добавить пользователя');
  });

});
