import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ApiRequestService} from '../services/api-request.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from "@angular/router";
import {ApiUrlsService} from "../services/api-urls.service";
import {isArray} from "node:util";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbPagination],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    users: any[] = [];
    loginUser: any = {};
    currentUser: any = {
        name: '',
        mobile: '',
        accountType: 'P'
    };
    // currentUser.accountType = 'Painter';
    page: number = 1;
    limit: number = 10;
    searchQuery: string = '';
    currentPage: number = 1;
    totalPages: number = 1;

    // Mobile number validation pattern (10 digits)
    mobilePattern = '^[0-9]{10}$';
    limitOptions: number[] = [10, 20, 50, 100];
    userId: any = '';
    currentUserResetPasswordForm: any = {};
    accountTypes: Array<any> = [
        {id: 'Painter', name: 'Painter'},
        {id: 'Contractor', name: 'Contractor'},
        {id: 'Dealer', name: 'Dealer'},
        {id: 'Super User', name: 'Super User'},
    ];
    errors: any;

    constructor(private apiService: ApiRequestService, private modalService: NgbModal,
                private router: Router, private apiUrls: ApiUrlsService, private AuthService: AuthService) {
        this.loginUser = this.AuthService.currentUserValue;
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    // Load users
    loadUsers(): void {
        this.page = this.currentPage
        this.apiService.getUsers(this.page, this.limit, this.searchQuery).subscribe((response) => {
                this.users = response.data;
                this.totalPages = response.total;
             },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }

    toggleUserStatus(userId: string, currentStatus: string, event: any): void {
        const currentSwitchState = event.target.checked;
        const action = currentSwitchState ? 'active' : 'inactive';

        Swal.fire({
            title: `Are you sure you want to mark this user as ${action}?`,
            text: `You are about to mark this user as ${action}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, mark as ${action}`,
            cancelButtonText: 'No, keep it',
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.toggleUserStatus(userId, action).subscribe(
                    (response) => {
                        const user = response.user;
                        const userName = user ? user.name : 'User';
                        Swal.fire('Success', `${userName} has been successfully marked as ${action}.`, 'success');

                        event.target.checked = action === 'active';

                        const updatedUser = this.users.find(u => u._id === userId);
                        if (updatedUser) {
                            updatedUser.status = action;
                        }
                    },
                    (error) => {
                        Swal.fire('Error', 'Failed to toggle user status', 'error');
                        event.target.checked = !currentSwitchState;
                        console.error('Error toggling user status:', error);
                    }
                );
            } else {
                event.target.checked = currentSwitchState;
            }
        });
    }

    addUser(userModal: any): void {
        this.currentUser = {name: '', mobile: '', password: '',};
        this.currentUser.accountType = 'Painter';
        this.modalService.open(userModal, {size: 'lg'});
    }

    editUser(user: any, content: any): void {
        this.currentUser = {...user};
        this.modalService.open(content, {size: 'lg'});
    }

    addNewUser(modal: any): void {
        this.apiService.addUser(this.currentUser).subscribe(
            (data) => {
                this.loadUsers();
                this.showSuccess('User added successfully!');
                this.currentUser = {};
                this.errors = [];
                modal.close();
            }, (error) => {
                // this.errors = [];
                // if (error?.errors) {
                //   this.errors = error.errors;
                // } else {
                //   this.errors.push(error.message);
                // }
                if (error?.errors && error.errors.length > 0) {
                    this.errors = error.errors;
                } else {
                    this.showError('Error updating user!');
                }
            }
        );
    }

    updateUser(modal: any, userForm: any): void {
        if (userForm.invalid) {
            this.showError('Please fill in all the required fields correctly.');
            return;
        }

        if (this.currentUser._id) {
            this.apiService.updateUser(this.currentUser._id, this.currentUser).subscribe((data) => {
                    this.loadUsers();
                    this.showSuccess('User updated successfully!');
                    this.errors = [];
                    modal.close();
                    if (this.loginUser.id === this.currentUser._id) {
                        let timerInterval: any;
                        let countdown = 5;
                        Swal.fire({
                            title: 'Success',
                            html: `Your changing account type, so need logout..!<br>You will be logged out in <b>${countdown}</b> seconds.`,
                            icon: 'success',
                            timer: countdown * 1000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            didOpen: () => {
                                timerInterval = setInterval(() => {
                                    countdown--;
                                    const bElement = Swal.getHtmlContainer()?.querySelector('b');
                                    if (bElement) {
                                        bElement.textContent = countdown.toString();
                                    }
                                }, 1000);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            },
                        }).then(() => {
                            this.currentUser = {};
                            this.AuthService.logOut();
                            window.location.reload();
                            this.router.navigate(['/login']);
                        });
                    }
                }, (error) => {
                    if (error?.errors && error.errors.length > 0) {
                        this.errors = error.errors;
                    } else {
                        this.showError('Error updating user!');
                    }
                    // Check if the error response contains the 'Mobile already exists' message
                    // if (error.error && error.error[0] === 'Mobile already exists') {
                    //   Swal.fire({
                    //     icon: 'error',
                    //     title: 'Duplicate Mobile Number',
                    //     text: 'This mobile number is already registered. Please enter a different number.',
                    //   });
                    // } else {
                    //   this.showError('Error updating user!');
                    // }
                }
            );
        }
    }


    deleteUser(id: string): void {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiService.deleteUser(id).subscribe(
                    (data) => {
                        this.loadUsers();
                        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                    },
                    (error) => {
                        this.showError('Error deleting user!');
                    }
                );
            }
        });
    }

    showSuccess(message: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
        });
    }

    showError(message: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
        });
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.loadUsers();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage = this.currentPage + 1;
            this.loadUsers();
        }
    }

    showRedeemedPoints(_id: any) {
        this.router.navigate(['/transactions'], {queryParams: {userId: _id}});
    }

    handlePageChange($event: number) {
        this.currentPage = $event;
        this.loadUsers();
    }

    handleLimitChange() {
        this.currentPage = 1;
        this.loadUsers();
    }

    resetPasswordModalOpen(user: any, content: any): void {
        this.userId = user._id;
        this.modalService.open(content, {size: 'sm'});
    }

    resetPassword(modal: any, form: any): void {
        console.log(form.value.newPassword, form.value.confirmNewPassword)
        if (form.invalid) {
            this.showError('Please fill in all the required fields correctly.');
            return;
        }

        const payload = {
            _id: this.userId,
            password: form.value.newPassword,
            confirmPassword: form.value.confirmNewPassword
        };

        this.apiService.post(this.apiUrls.resetPassword, payload).subscribe((data: any) => {
                this.showSuccess('Password reset successfully!');
                modal.close();
            }, (error: any) => {
                if (error.error && error.error[0] === 'Password and Confirm Password do not match') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Password and Confirm Password do not match',
                        text: 'Please fill in the correct password and confirm password.',
                    });
                } else {
                    this.showError('Error resetting password!');
                }
            }
        );
    }


}
