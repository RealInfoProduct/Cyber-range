import { Component, ViewChild, OnInit } from "@angular/core";
import { LoginService } from '../../services/login.service';
import { BackenddbService } from '../../services/backenddb.service';
import { faCalculator, faUser, faUserTie, faUsers, faBook, faCog, faFileAlt, faCubes, faLifeRing, faAddressBook, faMicrophone, faCircle, faDotCircle, faStopCircle, faComments, faBars, faFire, faShare, faPaperPlane, faLaptop, faNetworkWired, faCompactDisc, faTablet, faServer, faMemory, faDatabase, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

declare const slidebar:any;
declare const activesidebar:any;
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent{

	faBars = faBars;
	faFire = faFire;
	faCalculator = faCalculator;
	faUserTie = faUserTie;
	faUser = faUser;
	faUsers = faUsers;
	faBook = faBook;
	faCog = faCog;
	faFileAlt = faFileAlt;
	faCubes = faCubes;
	faLifeRing = faLifeRing;
	faAddressBook = faAddressBook;
	faMicrophone = faMicrophone;  
	faCircle = faCircle;
	faDotCircle = faDotCircle;
	faStopCircle = faStopCircle;
	faComments = faComments;
	faShare = faShare;
	faPaperPlane = faPaperPlane;
	faLaptop = faLaptop;
	faNetworkWired =faNetworkWired;
	faCompactDisc = faCompactDisc;
	faDatabase = faDatabase;
	faMemory = faMemory;
	faTablet = faTablet;
	faServer = faServer;
	faArrowCircleRight = faArrowCircleRight;

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	 
	
	server_url:string;
	progressbar: boolean = false;

  total_team:string = '0';
  total_team_member:string = '0';
  total_exe:string = '0';
  total_enroll_req:string = '0';
  total_enroll_success:string = '0';

/* resource chart */
public ExerciseChartOptions: Partial<ChartOptions>;
ExerciseUsedResource:number = 0;
ExerciseRemainingResource:number = 0;
ExerciseTotalResource:number = 0;
public TeamChartOptions: Partial<ChartOptions>;
TeamUsedResource:number = 0;
TeamRemainingResource:number = 0;
TeamTotalResource:number = 0;
public UsersChartOptions: Partial<ChartOptions>;
UsersUsedResource:number = 0;
UsersRemainingResource:number = 0;
UsersTotalResource:number = 0;
public VmChartOptions: Partial<ChartOptions>;
VmUsedResource:number = 0;
VmRemainingResource:number = 0;
VmTotalResource:number = 0;
public NetworkChartOptions: Partial<ChartOptions>;
NetworkUsedResource:number = 0;
NetworkRemainingResource:number = 0;
NetworkTotalResource:number = 0;
public TemplateChartOptions: Partial<ChartOptions>;
TemplateUsedResource:number = 0;
TemplateRemainingResource:number = 0;
TemplateTotalResource:number = 0;
public DiskChartOptions: Partial<ChartOptions>;
DiskUsedResource:number = 0;
DiskRemainingResource:number = 0;
DiskTotalResource:number = 0;

public VcpuChartOptions: Partial<ChartOptions>;
VcpuUsedResource:number = 0;
VcpuRemainingResource:number = 0;
VcpuTotalResource:number = 0;
public VramChartOptions: Partial<ChartOptions>;
VramUsedResource:number = 0;
VramRemainingResource:number = 0;
VramTotalResource:number = 0;
public StorageChartOptions: Partial<ChartOptions>;
StorageUsedResource:number = 0;
StorageRemainingResource:number = 0;
StorageTotalResource:number = 0;


public MaxVcpuChartOptions: Partial<ChartOptions>;
MaxVcpuUsedResource:number = 0;
MaxVcpuRemainingResource:number = 0;
MaxVcpuTotalResource:number = 0;
public MaxVramChartOptions: Partial<ChartOptions>;
MaxVramUsedResource:number = 0;
MaxVramRemainingResource:number = 0;
MaxVramTotalResource:number = 0;
public MaxStorageChartOptions: Partial<ChartOptions>;
MaxStorageUsedResource:number = 0;
MaxStorageRemainingResource:number = 0;
MaxStorageTotalResource:number = 0;

resource_chart:boolean = false;


/*general*/
group_id:string = "";
update_by:string = "";


constructor(
  private BackenddbService:BackenddbService,
  private LoginService:LoginService          
   ) {
    this.group_id = this.LoginService.getLoginGroup();
    this.update_by = this.LoginService.getUserId(); // current user id
	
	this.server_url = this.LoginService.getServerUrl();

    this.UsersChartOptions = {
      series: [this.UsersUsedResource],
      }
    
    this.DrawResourceChart();

    this.load_dashboard();
    activesidebar(); 
}

load_dashboard()
{
  var api = 'admin-api/get-instructor-dashboard';
  this.BackenddbService.getData(api).subscribe((res:any) => {
    //console.log(res);
    if(typeof res != null)
    {  
      this.total_team = res.total_team;
      this.total_team_member = res.total_team_member;
      this.total_exe = res.total_exe;
      this.total_enroll_req = res.total_enroll_req;
      this.total_enroll_success = res.total_enroll_success;
    }
  });
}

ExerciseResourceChart()
{
  this.ExerciseChartOptions = {
    series: [this.ExerciseUsedResource],
    chart: {
      height: 190,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
          //background: "#fff",
        },
        track: {
         // background: "rgba(0,0,0,.5)",
        }
      }
    },
    labels: ["Exercises"]
  };
}

TeamResourceChart()
{
  this.TeamChartOptions = {
    series: [this.TeamUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Teams"]
  };
}

UsersResourceChart()
{
  this.UsersChartOptions = {
    series: [this.UsersUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Users"]
  };
}

VmResourceChart()
{
  this.VmChartOptions = {
    series: [this.VmUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Virtual Machine"]
  };
}

NetworkResourceChart()
{
  this.NetworkChartOptions = {
    series: [this.NetworkUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Networks"]
  };
}

TemplateResourceChart()
{
  this.TemplateChartOptions = {
    series: [this.TemplateUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Templates"]
  };
}

DiskResourceChart()
{
  this.DiskChartOptions = {
    series: [this.DiskUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Disk"]
  };
}

VcpuResourceChart()
{
  this.VcpuChartOptions = {
    series: [this.VcpuUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["VCPU"]
  };
}

VramResourceChart()
{
  this.VramChartOptions = {
    series: [this.VramUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["VRAM"]
  };
}

StorageResourceChart()
{
  this.StorageChartOptions = {
    series: [this.StorageUsedResource],
    chart: {
      height: 190,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Storage"]
  };
}

DrawResourceChart()
{
  this.progressbar = true;
  const formData = new FormData();
  formData.append('instructor_id', this.update_by); //login instructor id
  this.BackenddbService.getResourceChartData(formData).subscribe((data:any) => {
		this.progressbar = false;
        if(typeof(data.used_resource) != 'undefined')
    {
    this.ExerciseUsedResource = data.used_resource.exercise;
    this.ExerciseRemainingResource = data.remaining_resource.exercise; 
    this.ExerciseTotalResource = data.total_resource.exercise; 

    this.TeamUsedResource = data.used_resource.team;
    this.TeamRemainingResource = data.remaining_resource.team; 
    this.TeamTotalResource = data.total_resource.team; 

    this.UsersUsedResource = data.used_resource.users;
    this.UsersRemainingResource = data.remaining_resource.users; 
    this.UsersTotalResource = data.total_resource.users; 
    
    this.VmUsedResource = data.used_resource.vm;
    this.VmRemainingResource = data.remaining_resource.vm; 
    this.VmTotalResource = data.total_resource.vm; 

    this.NetworkUsedResource = data.used_resource.network;
    this.NetworkRemainingResource = data.remaining_resource.network;     
    this.NetworkTotalResource = data.total_resource.network;     

    this.TemplateUsedResource = data.used_resource.template;
    this.TemplateRemainingResource = data.remaining_resource.template; 
    this.TemplateTotalResource = data.total_resource.template; 

    this.DiskUsedResource = data.used_resource.disk;
    this.DiskRemainingResource = data.remaining_resource.disk; 
    this.DiskTotalResource = data.total_resource.disk; 
    
    this.VcpuUsedResource = data.used_resource.vcpu;
    this.VcpuRemainingResource = data.remaining_resource.vcpu; 
    this.VcpuTotalResource = data.total_resource.vcpu; 
    
    this.VramUsedResource = data.used_resource.vram;
    this.VramRemainingResource = data.remaining_resource.vram; 
    this.VramTotalResource = data.total_resource.vram; 
    
    this.StorageUsedResource = data.used_resource.storage;
    this.StorageRemainingResource = data.remaining_resource.storage;  
    this.StorageTotalResource = data.total_resource.storage;

    this.MaxVcpuUsedResource = data.used_resource.max_vcpu;
    this.MaxVcpuRemainingResource = data.remaining_resource.max_vcpu; 
    this.MaxVcpuTotalResource = data.total_resource.max_vcpu; 
    
    this.MaxVramUsedResource = data.used_resource.max_vram;
    this.MaxVramRemainingResource = data.remaining_resource.max_vram; 
    this.MaxVramTotalResource = data.total_resource.max_vram; 
    
    this.MaxStorageUsedResource = data.used_resource.max_storage;
    this.MaxStorageRemainingResource = data.remaining_resource.max_storage;  
    this.MaxStorageTotalResource = data.total_resource.max_storage;  
  }	
    this.ExerciseResourceChart();
    this.TeamResourceChart();
    this.UsersResourceChart();
    this.VmResourceChart();
    this.NetworkResourceChart();
    this.TemplateResourceChart();
    this.DiskResourceChart();
    this.VcpuResourceChart();
    this.VramResourceChart();
    this.StorageResourceChart();
    this.resource_chart = true;
}); 
} 

	action_sidebar(){
		slidebar();
	}
}