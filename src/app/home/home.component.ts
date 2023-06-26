import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { DatapassService } from '../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscription: Subscription;
  server_url:string;
  site_url:string;
  popup:boolean=false;
  
  ourStudents :any = [
    {
      studentsPic : 'media/images/rishi-kumar.jpg',
      studentsName : 'Rishi Kumar',
      studentsDetails : 'The internship at SkyVirt® CyberRange is the best decision that I have took regarding my career. SkyVirt® CyberRange is helping me to grow in every manner possible. It has the perfect architecture that is required for enhancing the skills of one in this field. The work environment is also very nice and everyone is always up for help. Overall it is turning out to be a great experience of HOL at SkyVirt® CyberRange .',
    },
    {
      studentsPic : 'media/images/aman-pandey.jpg',
      studentsName : 'Aman Pandey',
      studentsDetails : 'As a whole I believe that this internship was successful in furthering my knowledge of a career in the field of Cyber Security. While being immersed in a company I saw the pressure of deadlines, importance of appearance, the value of being a self-motivator and the joy of loving IT job.',
    },
    {
      studentsPic : 'media/images/devesh-singh.jpg',
      studentsName : 'Devesh Singh',
      studentsDetails : 'I thoroughly enjoyed my internship this summer and now have very valuable experience under my belt. I know this will help when looking for jobs and needing references. I was dreading it in the beginning, but now I am so happy it was required. As much as the curriculum changes, I hope that class remains constant.',
    },
    {
      studentsPic : 'media/images/akshita-jain.jpg',
      studentsName : 'Akshita Jain',
      studentsDetails : 'Ive had a great work experience at SkyVirt® CyberRange . It has friendly work environment which motivates an individual working in the firm to work hard in order to bring success to the firm. They also offer the best platform to learn new technologies. SkyVirt® CyberRange  helped me in learning the work ethics and grow in every aspect.',
    },
    {
      studentsPic : 'media/images/rishi-kumar.jpg',
      studentsName : 'Rishi Kumar',
      studentsDetails : 'The internship at SkyVirt® CyberRange is the best decision that I have took regarding my career. SkyVirt® CyberRange is helping me to grow in every manner possible. It has the perfect architecture that is required for enhancing the skills of one in this field. The work environment is also very nice and everyone is always up for help. Overall it is turning out to be a great experience of HOL at SkyVirt® CyberRange .',
    },
    {
      studentsPic : 'media/images/aman-pandey.jpg',
      studentsName : 'Aman Pandey',
      studentsDetails : 'As a whole I believe that this internship was successful in furthering my knowledge of a career in the field of Cyber Security. While being immersed in a company I saw the pressure of deadlines, importance of appearance, the value of being a self-motivator and the joy of loving IT job.',
    },
    {
      studentsPic : 'media/images/devesh-singh.jpg',
      studentsName : 'Devesh Singh',
      studentsDetails : 'I thoroughly enjoyed my internship this summer and now have very valuable experience under my belt. I know this will help when looking for jobs and needing references. I was dreading it in the beginning, but now I am so happy it was required. As much as the curriculum changes, I hope that class remains constant.',
    },
    {
      studentsPic : 'media/images/akshita-jain.jpg',
      studentsName : 'Akshita Jain',
      studentsDetails : 'Ive had a great work experience at SkyVirt® CyberRange . It has friendly work environment which motivates an individual working in the firm to work hard in order to bring success to the firm. They also offer the best platform to learn new technologies. SkyVirt® CyberRange  helped me in learning the work ethics and grow in every aspect.',
    },
  ]

  category :any = [
    {
      categoryPic : "../../assets/images/home/category-icon-1.svg",
      categoryName : "Modern Design",
      categoryDetails : "The graphic content of the software corresponds to the modern level of quality in the field of computer graphics and visualization",
    },
    {
      categoryPic : "../../assets/images/home/category-icon-2.svg",
      categoryName : "High Interactivity",
      categoryDetails : "A high interactivity combined with visual demonstration of physical experiments ificantly increases the effectiveness of the learning process",
    },
    {
      categoryPic : "../../assets/images/home/category-icon-3.svg",
      categoryName : "Simplicity & Minimalism",
      categoryDetails : "Unobtrusive interface of software products and intuitive management of virtual laboratory space",
    },
    {
      categoryPic : "../../assets/images/home/category-icon-4.svg",
      categoryName : "Compliance With Educational Standards",
      categoryDetails : "Virtual laboratories meet modern educational standards and are an effective complement to the real laboratory base of educational institutions",
    },
    {
      categoryPic : "../../assets/images/home/category-icon-5.svg",
      categoryName : "Realistic Experiments",
      categoryDetails : "Execution of simulation experiments is as close as possible to reality. The software simulates process of working with the real equipment and repeats all sequence of actions of the laboratory assistant",
    },
    {
      categoryPic : "../../assets/images/home/category-icon-6.svg",
      categoryName : "Cross Platform",
      categoryDetails : "The software is supplied under the main modern platforms: Windows, MacOS, Linux, Android, iOS, HTML5, which allows for more flexible use of virtual laboratories in the educational process",
    },
  ]

  ourclient : any = [
    {
      ourclientPic : "../../assets/images/home/our-client-1.svg",
      ourclientNumber : "750+",
      ourclientDetails : "Cyber Security Projects",
    } ,
    {
      ourclientPic : "../../assets/images/home/our-client-2.svg",
      ourclientNumber : "12k+",
      ourclientDetails : "Students Globally",
    } ,
    {
      ourclientPic : "../../assets/images/home/our-client-3.svg",
      ourclientNumber : "150+",
      ourclientDetails : "Cyber Security Expersts",
    } ,
    {
      ourclientPic : "../../assets/images/home/our-client-4.svg",
      ourclientNumber : "150%",
      ourclientDetails : "Client Retention Rate",
    } ,
  ]

  constructor(private loginService: LoginService, private modalService: NgbModal,
    private ds: DatapassService) { 
    this.server_url = this.loginService.getServerUrl();
    this.site_url = this.loginService.getSiteUrl();
  }

  banner_slider: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: true, 
    touchDrag: true,
    pullDrag: false,
    dots: true,
    nav: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      768: {
        items: 1
      }
    }
  }

  clients: OwlOptions = {
    loop: true,
    mouseDrag: true, 
    touchDrag: true,
    pullDrag: false,
    dots: true,
    nav: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      768: {
        items: 2
      }
    }
  }

  partners: OwlOptions = {
    loop: true,
    mouseDrag: true, 
    touchDrag: true,
    pullDrag: false,
    dots: true,
    nav: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 3
      },
      768: {
        items: 3
      }
    }
  }

  testimonials: OwlOptions = {
    loop: true,
    mouseDrag: true, 
    touchDrag: true,
    pullDrag: false,
    dots: true,
    nav: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 4,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      768: {
        items: 3
      },
      900: {
        items: 4
      }
    }
  }

  ngOnInit(): void {
  }

  openmodal()
  {
    var array = ['open_demo_model','open'];
    this.ds.sendData(array);
  }
	

}
