import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { BackenddbService } from '../services/backenddb.service';
import { SocialAuthService } from "angularx-social-login";
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChatService } from '../services/chat.service';
import { FrontenddbService } from '../services/frontenddb.service';
import { Auth } from './../interfaces/auth';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {


  linkedInCredentials = {
    clientId: "78gplb40e99wqv",
    redirectUrl: "https://dev.skyvirt.tech",

  };

   // error validation message
	error_messages = {
    'email': [
     { type: 'required', message: 'Email is required' },
     { type: 'email', message: 'Valid Email required' },
   ]} 


  error: string;
  closed: boolean = true;
  alertMessage: string;
  alertClass: string;
  logoutEveryBtn: boolean;
  logout_every_id: string;
  formdata: any = {};
  socialdata: any = {};
  syncdata: any = {};
  loginName: string;
  loginGroupId: string;
  progressbar: boolean = false;
  current_url_array = [];
  form_title: string = '';
  userId: any = '';
  verify_email: any = '';
  verify_password: any = '';
  //flash message
  messageArray = {
    type: "",
    message: "",
  };
  stringifiedData: any;
  msgalert: any;
  active_btn: boolean = false;
  google_login_status: boolean = false;
  server_url: string;
  roomId = [];
  showPassword:boolean = false
  @ViewChild('content', { static: false }) private content;
  public user: any;
  constructor(
    private loginService: LoginService,
    private BackenddbService: BackenddbService,
    private router: Router,
    private modalService: NgbModal,
    private frontenddbService: FrontenddbService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private ChatService: ChatService,
    private authService: SocialAuthService

  ) {

    this.server_url = this.loginService.getServerUrl();

    this.form_title = "Login";
    this.loginGroupId = this.loginService.getLoginGroup();
    if (this.loginGroupId == '1') {
      this.router.navigate(['/dd-terminal/dashboard']);
    } else if (this.loginGroupId == '2') {
      this.router.navigate(['/dd-instructor/dashboard']);
    } else if (this.loginGroupId == '3') {
      this.router.navigate(['/user-exercises']);
    }
  }


  ngOnInit() {
    this.current_url_array = [
      { "slug": "", "label": "Login" }
    ]

    this.formdata = new FormGroup({
      emailid: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*"),
        Validators.email
      ])),
      passwd: new FormControl("", this.passwordvalidation),
      login_by: new FormControl("", Validators.compose([

      ])),
    });

    this.socialdata = this.formBuilder.group({
      f_name: '',
      m_name: '',

      l_name: '',
      email: '',
      mobile: '',
      language: '',
      cyber_user_id: '',
      group: '3',
      address: '',
      country: '',
      state: '',
      city: '',
      pin: '',
      sex: '',
      password: '',

    });


    const userId = this.loginService.getUserId();
    if (userId == null) {
      localStorage.clear();
    }

    this.getGoogleLoginStatus();
  }

  invalidMessage(errorMessage) {
    for(let error  of errorMessage) {
      if(this.formdata.get('emailid').status == 'INVALID' && (this.formdata.get('emailid').dirty || this.formdata.get('emailid').touched)) {
        return 'border-red'
      } else {
        return 'border-blue'
      }
    }
  }

  getGoogleLoginStatus() {

    const socialData = new FormData();
    socialData.append('set_key', 'google_login');
    this.BackenddbService.getSetting(socialData).subscribe(
      res => {

        if(res.status=='success')
        {
          const googleStauts = JSON.parse(res.data['12'].svalue);
          if (googleStauts[0].status == 'Active') {
            this.google_login_status = true;
          }
          else {
            this.google_login_status = false;
          }
        }




      });
  }
  async signInWithGoogle() {
    await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      console.log(userData);

      const formData = new FormData();
      formData.append('email', userData.email);

      this.closed = true;
      this.progressbar = true;
      /* checking  exsiting email user in addressbook table */
      this.frontenddbService.checkExsitingEmail(formData).subscribe(
        res => {
          var password = this.generatePassword(12);
          if (res.status == 'success') {


            formData.append('f_name', userData.firstName);
            formData.append('m_name', '');
            formData.append('l_name', userData.lastName);
            formData.append('mobile', '');
            formData.append('language', '');
            formData.append('address', '');
            formData.append('country', '');
            formData.append('state', '');
            formData.append('city', '');
            formData.append('pin', '');
            formData.append('sex', '');
            formData.append('password', password);
            formData.append('user_status', 'Active');
            formData.append('login_by', 'Google');
            formData.append('force_passwd_change', 'false');
            // formData.append('password', );
            this.frontenddbService.RegistrationSubmit(formData).subscribe(
              res => {

                if (res.status == 'success') {

                  this.socialdata.patchValue({
                    email: userData.email,
                    f_name: userData.firstName,
                    l_name: userData.lastName,
                    password: password,
                    cyber_user_id: res.insert_user_id,

                  });
                  this.ChatService.register(this.socialdata.value).subscribe(
                    response => {
                      if (response.error == false) {
                        this.formdata.patchValue({
                          emailid: userData.email,
                          passwd: password


                        });
                        this.onClickSubmit(this.formdata.value);

                      }
                      else {
                        alert('Something went wrong !!!');
                        this.progressbar = false;
                      }



                      // this.closed=false;
                    });
                }

              });
          }
          else if (res.status === 'error') {

            this.formdata.patchValue({
              emailid: userData.email,
              passwd: password,
              login_by: userData.provider

            });
            this.onClickSubmit(this.formdata.value);
            // this.alertMessage = res.message;
            // this.alertClass = 'danger'; 
            // this.closed = false;
            // this.progressbar = false;
          }


        },
        error => this.error = error
      );

      // // var response = this.http.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' +);
      // console.log(userData);
      // // this.user = userData;
    });
  }

  // handleInputChange(event) {
  //   debugger
  // }

  signInWithLinkedin() {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.linkedInCredentials.clientId
      }&redirect_uri=${this.linkedInCredentials.redirectUrl}&state=987654321`;

  }
  generatePassword(passwordLength) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);

    return this.shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }
  passwordvalidation(formcontrol) {
    if (formcontrol.value.length < 5) {
      return { "passwd": true };
    }
  }
  onClickSubmit(data: any) {
    this.verify_email = data.emailid;
    this.verify_password = data.passwd;
    //const modalRef = this.modalService.open(this.content);

    const formData = new FormData();
    /* here set submitted data formData object array */
    formData.append('email', data.emailid);
    formData.append('password', data.passwd);

    if (data.hasOwnProperty("login_by")) {
      formData.append('login_by', data.login_by);
    }
    else {
      formData.append('login_by', 'login_form');
    }

    /* call this servive for verify user */
    this.progressbar = true;
    debugger
    this.loginService.verifyLogin(formData).subscribe(
      res => {



        if (res.status === 'error') {
          //user_status
          this.progressbar = false;
          this.alertMessage = res.message;
          this.alertClass = 'danger';
          this.closed = false;
        } else if (res.status === 'warning') {
          this.progressbar = false;
          this.alertMessage = res.message;
          this.alertClass = 'warning';
          this.logoutEveryBtn = true;
          this.logout_every_id = res.logout_every_id;
          this.closed = false;
        } else if (res.user_status === 'Inactive') {
          this.progressbar = false;
          this.alertMessage = res.message;
          this.alertClass = 'warning';
          this.closed = false;
          this.active_btn = true;
        }
        else {
          this.alertMessage = res.message;
          this.alertClass = 'primary';

          // this.joinChatRoom(res.user_id);  

          this.getChatLogin(res);

        }
      },
      error => this.error = error
    );
  }

  async joinChatRoom(response) {

    await response.team_data.forEach(element => {
      this.ChatService.joinRoom(element._id);
    });
    //  console.log('room',JSON.stringify(this.roomId));
    //  await this.ChatService.joinRoom(this.roomId);

  }

  getChatLogin(res) {


    this.ChatService.login(this.formdata.value).subscribe(
      (response: Auth) => {


        if (response.error == true) {
          this.progressbar = false;
          this.alertMessage = response.message;
          this.alertClass = 'danger';
          this.closed = false;
        }
        else {
          this.loginService.setLoginSession(res);
          localStorage.setItem('userid', response.userId);
          localStorage.setItem('username', response.username);


          // alert(localStorage.getItem('userid'));
          // check forcefully password change flag here
          this.progressbar = false;
          if (res.group_id == '1') {
            this.progressbar = false;
            this.loginService.setLoginSession(res);

            // check forcefully password change flag here
            if (res.force_passwd_change == 'false') {

              this.router.navigate(['/dd-terminal/dashboard']);
            } else {
              this.setFlashMessage('warning', 'Please update your password due to security reason.');
              this.router.navigate(['/dd-terminal/user-profile/' + res.user_id]);
            }


          } else if (res.group_id == '2') {
            this.progressbar = false;
            this.loginService.setLoginSession(res);

            // check forcefully password change flag here
            if (res.force_passwd_change == 'false') {
              this.router.navigate(['/dd-instructor/dashboard']);
            } else {
              this.setFlashMessage('warning', 'Please update your password due to security reason.');
              this.router.navigate(['/dd-instructor/user-profile/' + res.user_id]);
            }

          }
          else if (res.group_id = '3') {

            if (res.force_passwd_change == 'false') {

              this.router.navigate(['/user-exercises']);
            } else {
              this.setFlashMessage('warning', 'Please update your password due to security reason.');
              this.router.navigate(['/profile']);
            }
          }
        }


        //  this.joinChatRoom(response);
        //  alert(1);
        // console.log('login_details'+JSON.stringify(response));





      },
      (error) => {

        if (error.status == 404) {

          this.loginService.setLoginSession(res);
          this.progressbar = false;
          const verifyData = new FormData();
          verifyData.append('user_id', res.user_id);

          this.frontenddbService.getProfile(verifyData).subscribe(
            profileres => {



              this.syncdata = this.formBuilder.group({
                f_name: profileres.F_Name,
                l_name: profileres.L_Name,
                email: profileres.eMail,
                mobile: profileres.Mobile,
                password: this.verify_password,
                cyber_user_id: res.user_id,
                group: res.group_id


              });

              this.ChatService.register(this.syncdata.value).subscribe(
                response => {

                  if (response.error == false) {
                    this.formdata.patchValue({
                      emailid: profileres.eMail,
                      passwd: this.verify_password,


                    });
                    this.getChatLogin(this.formdata.value);

                  }
                  else {
                    alert('Something went wrong !!!');
                    this.progressbar = false;
                  }
                  // localStorage.setItem('userid', response.userId);
                });
              //  }

            });


          // if (res.group_id == '1') {
          //   this.progressbar = false;


          //   // check forcefully password change flag here
          //   if (res.force_passwd_change == 'false') {
          //     this.router.navigate(['/dd-terminal/dashboard']);
          //   } else {
          //     this.setFlashMessage('warning', 'Please update your password due to security reason.');
          //     this.router.navigate(['/dd-terminal/user-profile/' + res.user_id]);
          //   }


          // } else if (res.group_id == '2') {
          //   this.progressbar = false;


          //   // check forcefully password change flag here
          //   if (res.force_passwd_change == 'false') {
          //     this.router.navigate(['/dd-instructor/dashboard']);
          //   } else {
          //     this.setFlashMessage('warning', 'Please update your password due to security reason.');
          //     this.router.navigate(['/dd-instructor/user-profile/' + res.user_id]);
          //   }

          // }

          // else if (res.group_id = '3') {

          //   if (res.force_passwd_change == 'false') {

          //     this.router.navigate(['/exercise-repository']);
          //   } else {
          //     this.setFlashMessage('warning', 'Please update your password due to security reason.');
          //     this.router.navigate(['/profile']);
          //   }
          // }
          /* Uncomment it, Incase if you like to reset the Login Form. */
        }
        else {
          this.progressbar = false;
        }

      }
    );



  }
  CallLogOut() {
    const formData = new FormData();
    /* here set submitted data in formData object array */
    formData.append('logout_every_id', this.logout_every_id);

    this.loginService.logoutEveryWhere(formData).subscribe(
      res => {
        //console.log(res);
        if (res.status === 'success') {
          this.alertMessage = res.message;
          this.alertClass = 'primary';
          this.logoutEveryBtn = false;
          this.logout_every_id = '';
          this.loginService.logOut();
          this.logout();
        } else {
          this.alertMessage = res.message;
          this.alertClass = 'danger';
        }
      },
      error => this.error = error
    );
  }




  logout() {
    this.userId = localStorage.getItem('userid');
    if (this.userId != null) {
      this.ChatService.removeLS()
        .then((removedLs: boolean) => {
          this.ChatService.logout({ userId: this.userId }).subscribe((response: Auth) => {
            this.router.navigate(['/login']);
          });
        })
        .catch((error: Error) => {
          alert(' This App is Broken, we are working on it. try after some time.');
          throw error;
        });
    }

  }

  send_activation_req(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to send activation request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.progressbar = true;
        const formData = new FormData();
        /* here set submitted data in formData object array */
        formData.append('email', data.emailid);
        var api = 'registration-api/activation-link';
        this.BackenddbService.postData(api, formData).subscribe(
          res => {
            console.log(res);
            this.progressbar = false;
          })
      }
    })
      .catch(() =>
        console.log('Cancel')
      );
  }


  logout_Every_Where() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log off.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.CallLogOut();
      }
    })
      .catch(() =>
        console.log('Cancel')
      );
  }

  setFlashMessage(type: any, message: any) {
    this.messageArray.type = type;
    this.messageArray.message = message;
    this.stringifiedData = JSON.stringify(this.messageArray);
    this.loginService.setflashMessage(this.stringifiedData);
  }

}
