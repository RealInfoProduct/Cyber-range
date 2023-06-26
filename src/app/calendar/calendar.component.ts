import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { BackenddbService } from '../services/backenddb.service';
import {
  IDatePickerConfig,
  ISelectionEvent,
  DatePickerComponent,
} from 'ng2-date-picker';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { noWhitespaceValidator } from '../helper/validatefun';
import { LoginService } from '../services/login.service';
import {
  faPlusCircle,
  faUser,
  faEdit,
  faTrash,
  faUsers,
  faEye,
  faBars,
  faCamera,
  faPlus,
  faMinus,
  faCog,
  faPowerOff,
  faDesktop,
  faDownload,
  faFileExport,
  faRedo,
  faList,
  faNetworkWired,
} from '@fortawesome/free-solid-svg-icons';
import { DatapassService } from '../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  green: {
    primary: '#008e00',
    secondary: '#008e00',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-calendar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  readonly_start_date: boolean = true;
  CalendarView = CalendarView;
  formdata: FormGroup;
  schedulefrm: FormGroup;
  viewDate: Date = new Date();
  progressbar: boolean = false;
  current_url_array = [];
  form_title: string = 'My Calendar';
  //fontasome icon
  faPlusCircle = faPlusCircle;
  faUser = faUser;
  faEdit = faEdit;
  faTrash = faTrash;
  faUsers = faUsers;
  faEye = faEye;
  faBars = faBars;
  faCamera = faCamera;
  faPlus = faPlus;
  faMinus = faMinus;
  faCog = faCog;
  faPowerOff = faPowerOff;
  faDesktop = faDesktop;
  faDownload = faDownload;
  faFile = faFileExport;
  faRedo = faRedo;
  faList = faList;
  faNetworkWired = faNetworkWired;
  action_allot: CalendarEventAction[] = [
    {
      label: '<i class="<fa-icon [icon]="faEdit"></fa-icon> View',
      a11yLabel: 'ViewAllotment',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('ViewAllotment', event);
      },
    },
  ];
  action_schedule: CalendarEventAction[] = [
    {
      label: '<i class="<fa-icon [icon]="faEdit"></fa-icon> View',
      a11yLabel: 'ViewSchedule',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('ViewSchedule', event);
      },
    },
    {
      label: '<i class="<fa-icon [icon]="faEdit"></fa-icon> Edit',
      a11yLabel: 'EditSchedule',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('EditSchedule', event);
      },
    },
    {
      label: '<fa-icon [icon]="faTrash"></fa-icon> Delete',
      a11yLabel: 'DeleteSchedule',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //  this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('DeleteSchedule', event);
      },
    },
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  start_date: string = '';
  end_date: string = '';
  server_url: string;
  group_id: string = '';
  modalRef: any;
  action_type: string = '';
  subscription: Subscription;
  constructor(
    private modal: NgbModal,
    private BackenddbService: BackenddbService,
    private dtchange: ChangeDetectorRef,
    private fb: FormBuilder,
    private loginService: LoginService,
    private ds: DatapassService
  ) {
    this.server_url = this.loginService.getServerUrl();
    this.group_id = this.loginService.getLoginGroup();
  }
  ngOnInit(): void {
    this.getCalendar();
    this.getSubsData();
    this.current_url_array = [{ slug: '', label: 'My Calendar' }];
  }
  getSubsData() {
    this.subscription = this.ds.getData().subscribe((x) => {
      if (x[0] == 'reloadCalendar') {
        this.getCalendar();
      }
    });
  }
  getCalendar() {
    this.events = [];
    var api = 'candidate-api/get-calendar';
    this.BackenddbService.getData(api).subscribe((res: any) => {
      console.log(res);
      res.forEach((myObj: any, index: any) => {
        if (myObj.type == 'allotment') {
          var start_js_date = new Date(myObj.valid_start);
          var end_js_date = new Date(myObj.valid_end);
          var tmp_color = colors.red;
          if (myObj.status == 'Allotted') {
            tmp_color = colors.red;
          } else if (myObj.status == 'Pause') {
            tmp_color = colors.blue;
          } else if (myObj.status == 'Running') {
            tmp_color = colors.green;
          }
          var temp1 = {
            id: myObj.id,
            start: start_js_date,
            end: end_js_date,
            title: myObj.name + '(' + myObj.a_id + ')',
            color: tmp_color,
            actions: this.action_allot,
            allDay: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: false,
          };
          this.events.push(temp1);
        } else {
          var start_js_date = new Date(myObj.start_date);
          var end_js_date = new Date(myObj.end_date);
          var tmp_color = colors.yellow;
          var temp = {
            id: myObj.id,
            start: start_js_date,
            end: end_js_date,
            title: myObj.title + '',
            color: tmp_color,
            actions: this.action_schedule,
            allDay: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: false,
          };
          this.events.push(temp);
        }
      });
      this.refresh.next();
    });
  }
  setDatetime(data: ISelectionEvent, type: any, ex_id: any) {}
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }
  handleEvent(action: string, event: CalendarEvent): void {
    this.action_type = action;
    var data = { call_from: 'calendar', schedule_id: event.id };
    var array = [action, data];
    this.ds.sendData(array);
  }
  addEvent(): void {
    var data = { call_from: 'calendar' };
    var array = ['AddSchedule', data];
    this.ds.sendData(array);
  }
  deleteEvent(eventToDelete: CalendarEvent) {
    // this.events = this.events.filter((event) => event !== eventToDelete);
  }
  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
