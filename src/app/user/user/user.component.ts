import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MyServiceService } from 'src/app/services/my-service.service';
import { forbiddenNameValidator } from 'src/app/shared/forbidden-name.directive';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['index', 'first_name', 'last_name', 'email', 'avatar'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  add_user: boolean;
  UserForm: FormGroup;

  constructor(private service: MyServiceService, private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.getUsers();
    this.UserForm = this.formBuilder.group({
      name:['',[Validators.minLength(3),Validators.maxLength(50),Validators.required,forbiddenNameValidator(/admin$|123$|abc$/i) ]],
      email:['',[Validators.email,Validators.required]],
      contact_number:['',Validators.pattern('[0-9]{10}$')],
      address:['',Validators.maxLength(200)],
      gender:['',Validators.required],
    })
  }
  getUsers() {
    this.service.getUsers().subscribe((res: any) => {
      // console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addUser() {
    this.add_user = !this.add_user;
  }

}
