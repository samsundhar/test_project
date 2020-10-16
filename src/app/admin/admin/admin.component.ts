import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyServiceService } from 'src/app/services/my-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  AdminFormGroup: any;
  filesize_error: boolean;
  filetype_error: boolean;
  imageUrl: string | ArrayBuffer;
  imgUrl: string | ArrayBuffer;

  constructor(private formBuilder: FormBuilder, private service: MyServiceService) { }

  ngOnInit() {
    this.AdminFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    })
  }
  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.filesize_error = false;
    this.filetype_error = false;
    if (event.target.files && event.target.files[0]) {
      const size = event.target.files[0].size;
      const type = event.target.files[0].type;
      console.log(size);
      console.log(type);
      if (type !== 'image/jpeg') {
        this.filetype_error = true;
        alert('File must be .jpg or .jpeg');
        return
      }
      if (size > 102400) {
        console.log('large files');
        alert('File must be less than 100Kb');
        this.filesize_error = true;
        return
      }

      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.imgUrl = reader.result;
        this.AdminFormGroup.patchValue({
          image: file,
        });
        this.onUpload()
      }
      console.log(event);
    }
  }
  onUpload() {
    const formdata = new FormData()
    formdata.append('image', this.AdminFormGroup.get('image').value);
    formdata.append('name', this.AdminFormGroup.get('name').value);
    console.log(formdata);

    this.service.uploadImg(formdata).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('upload Progress' + Math.round(100 * event.loaded / event.total) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
        if (event.body.success) {
          alert("File upload success.");
          // update image with uploaded image url
          this.imageUrl = event.body.url;
        } else {
          alert("File upload failed.");
        }
      }
      // this.imgUrl = "new_url";
    })
  }

}
