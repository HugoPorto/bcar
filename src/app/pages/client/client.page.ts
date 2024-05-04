import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ClientService } from './../../services/client.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClientPage implements OnInit {
  aForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private storage: ClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.aForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.pattern('^[0-9]*$')
        ]
      ],
    });
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];

      if (id) {
        this.storage.getClient(id).then((client) => {
          this.aForm.setValue({
            name: client?.name,
            email: client?.email,
            address: client?.address,
            phone: client?.phone
          });
        });
      }
    });
  }

  async onSubmit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];

      if (id) {
        this.storage.updateClient(
          id,
          this.aForm.value.name,
          this.aForm.value.email,
          this.aForm.value.address,
          this.aForm.value.phone
        );
      } else {
        this.storage.addClient(
          this.aForm.value.name,
          this.aForm.value.email,
          this.aForm.value.address,
          this.aForm.value.phone
        );

        this.router.navigate(['/clients']);
      }
    });
  }
}
