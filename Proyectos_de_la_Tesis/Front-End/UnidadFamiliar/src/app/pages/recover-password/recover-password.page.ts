import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {

  responseData: any;
  activePassword = true;
  formularioUsuario: FormGroup;
  userData = { email : '', password : '', status : 'Active' };
  emailAction = false;
  celularAction = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.responseData = (this.activatedRoute.snapshot.params.inLogin);
  }

  regresar() {
    if (this.responseData === 'login') {
      this.router.navigate([ '/menu/login']);
    } else {
      this.router.navigate([ '/menu/loshareLocationgin']);
    }
  }

  buildForm() {
    /**
     * @description Asignamos a la propiedad "formularioUsuario" los campos que se van a controlar de la vista
     */
    this.formularioUsuario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      numero_contacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{5,10}$/)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    });
  }

  verificar() {
    this.emailAction = true;
    this.celularAction = true;
    this.activePassword = false;
  }
}
