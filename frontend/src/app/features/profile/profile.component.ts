import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  isLoading = false;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phone: [''],
      address: [''],
      role: [{ value: '', disabled: true }],
      ecoScore: [{ value: 0, disabled: true }]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.patchValue({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          role: data.role,
          ecoScore: data.ecoScore || 0
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.get('name')?.enable();
      this.profileForm.get('phone')?.enable();
      this.profileForm.get('address')?.enable();
    } else {
      this.profileForm.get('name')?.disable();
      this.profileForm.get('phone')?.disable();
      this.profileForm.get('address')?.disable();
      this.loadProfile(); // Reload to reset changes
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      const updateData = {
        name: this.profileForm.value.name,
        phone: this.profileForm.value.phone,
        address: this.profileForm.value.address
      };

      this.userService.updateProfile(updateData).subscribe({
        next: (data) => {
          this.user = data;
          this.successMessage = 'Profile updated successfully!';
          this.notificationService.showSuccess('Profile updated successfully!');
          this.isEditing = false;
          this.profileForm.get('name')?.disable();
          this.profileForm.get('phone')?.disable();
          this.profileForm.get('address')?.disable();
          this.isLoading = false;
          
          // Update localStorage
          if (data.name) {
            localStorage.setItem('name', data.name);
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          const errorMsg = error.error?.message || 'Failed to update profile';
          this.errorMessage = errorMsg;
          this.notificationService.showError(errorMsg);
          this.isLoading = false;
        }
      });
    }
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      'USER': 'User',
      'SELLER': 'Seller',
      'ADMIN': 'Admin'
    };
    return roleMap[role] || role;
  }
}
