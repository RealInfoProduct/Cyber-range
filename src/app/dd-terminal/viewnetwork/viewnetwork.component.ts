import { Component, ChangeDetectorRef, AfterViewInit, ViewChild, Input, Output, EventEmitter, HostListener  } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Subject, BehaviorSubject,Observable } from 'rxjs';

import {faRedoAlt,faLaptop,faRandom ,faBars,faPlus,faMinus,faCog,faPowerOff,faDesktop,faDownload ,faFileExport,faTrash,faRedo} from '@fortawesome/free-solid-svg-icons';

//import {ScriptStore} from "../script.store";

//import { PopoverModule, PopoverConfig, PopoverDirective } from 'ngx-bootstrap';
//import * as Vis from 'ngx-vis';
 
declare var vis:any;
declare var EDGE_LENGTH_SUB:any;
declare var EDGE_LENGTH_MAIN:any;


@Component({
  selector: 'app-viewnetwork',
  templateUrl: './viewnetwork.component.html',
  styleUrls: ['./viewnetwork.component.css']
})
export class ViewnetworkComponent implements AfterViewInit {

  @Input() resources:any;
  @Input() network_data:any;
  @Input() demo_view:any;
  @Input() vm_user:any;
  @Input() resource_img_url:any;
  @Input() config_popup:any;
  @Input() disable_step2_ctrl:boolean;

  
  @ViewChild("siteConfigNetwork") networkContainer: ElementRef;
  @Output() perform_action: EventEmitter <any> = new EventEmitter<any>();
  @Input() draw_net_topology: Subject<any> = new Subject<any>();

  @HostListener('contextmenu', ['$event'])

  EDGE_LENGTH_SUB = 50;
  EDGE_LENGTH_MAIN = 150;

  /*
  EDGE_LENGTH_SUB = 150;
  EDGE_LENGTH_MAIN = 300;
  */
  faRedoAlt = faRedoAlt;
  faBars = faBars;
  faPlus = faPlus;
  faMinus = faMinus;
  faCog = faCog;
  faPowerOff = faPowerOff;
  faDesktop = faDesktop;
  faDownload = faDownload;
  faFile = faFileExport;
  faTrash =  faTrash;
  faRedo = faRedo;
  faRandom = faRandom;
  faLaptop = faLaptop;

  network:any;
  internet:string = "";
  network_array = [];
  current_node_id:string = "";
  side:string = "backend";
  action_array = [];


  disable_click:boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {

      if(typeof this.network_data!="undefined")
      {
        this.EDGE_LENGTH_SUB = this.network_data[0];
        this.EDGE_LENGTH_MAIN = this.network_data[1];
        this.side = this.network_data[2];
        this.cdr.detectChanges();
      }

      this.draw_net_topology.subscribe(
        data => {
            if(data=='draw_network_topology')
            {
              this.load_network_topology();
            }
          });   
          this.load_network_topology();
  }

  load_network_topology()
  {
    this.disable_click = false;

    //here reset all variables
    this.network = "";
    this.internet = "";
    this.network_array = [];
    this.current_node_id = "";
    this.action_array = [];

    var treeData = this.getTreeData();
    this.loadVisTree(treeData);
  }

  
  
  loadVisTree(treedata:any) {

    var options = {
      interaction: {
          hover: true,
        },
      nodes: {
        fixed: false,
        shapeProperties: {
          useImageSize: false,
          useBorderWithImage: false,
          interpolation: false,
        },
      },
    };

    var container = this.networkContainer.nativeElement;
    this.network = new vis.Network(container, treedata, options);

    // call function when click on node and show action buttons like power on,off etc.
    this.network.on('click',(obj:any)=>{
      this.action_array = [];
      this.current_node_id = '';
      var valid:any = true;
      this.network_array.forEach((netObj:any, netindex:any) => {
        
        // here node is switch or internet then stop to open action button on click node
        if(obj.nodes==this.network_array[netindex].asset_unique_id || obj.nodes=='Internet')
        {
          valid = false;
        }

      }); 

      if(valid==false)
      {
        $(".custom-menu").hide();
        return true;
      }

      if(obj.nodes!="")
      {
        this.current_node_id = obj.nodes;
        this.resources.forEach((myObject:any, index:any) => { 
          if(obj.nodes == this.resources[index].asset_unique_id && this.resources[index].asset_type=='VM')
          {
            this.action_array.push(this.resources[index]);
            //console.log(this.action_array);
            $(".action-menu").finish().show().css({
              top: obj.event.srcEvent.layerY + "px",
              left: obj.event.srcEvent.layerX + "px"
            })
          }
        }); 
        
      }else
      {
          $(".action-menu").hide();
      }
    })
  }

  // here set nodes and edges data of tolopogy
  getTreeData() {  
    var nodes =[];
    var edges = [];
    // here start create node for network
    this.resources.forEach((myObject:any, index:any) => { 

      if(this.resources[index].asset_type=='Switch')
      {

        this.network_array.push({
                    asset_unique_id: this.resources[index].asset_unique_id,
                    asset_name:this.resources[index].asset_name
               });

          nodes.push({
            id: this.resources[index].asset_unique_id,
            label: this.resources[index].asset_name,
            shape: "image",
            image: this.resource_img_url+'resource-image/'+this.resources[index].image,
            opacity: 0.7,
          });
      }else if(this.internet=='')
      {
        if(typeof(this.resources[index].configuration) !='undefined' && typeof(this.resources[index].configuration.nic_array) !='undefined')
        {
            var nic_data_array = this.resources[index].configuration.nic_array;

            nic_data_array.forEach((nicObj:any, nicindex:any) => { 
              var nic_network = nic_data_array[nicindex].nic_network;  
              if(nic_network=='Internet' || nic_network=='Traffic Generator')
              {
                this.internet = nic_network;
                let id = nic_network.replace(/ /g,"").toLowerCase();
                nodes.push({
                  id: id,
                  label: nic_network,
                  shape: "image",
                  image: this.resource_img_url+'resource-image/'+id+'.png',
                  opacity: 0.7,
                });
              }
            }); 
        }
      }
      });
     // here end network node

    // here start create node for vm
      this.resources.forEach((myObject:any, index:any) => { 



        if(this.resources[index].asset_type=='VM')
        {
          var power_status = this.resources[index].power_on_status;

          if(power_status=='up')
          {
              var color_code = 'rgba(40,167,69,1)';
          }else
          {
              var color_code = 'rgba(220,53,69,1)';
          }
          
          nodes.push({
            id: this.resources[index].asset_unique_id,
            label: this.resources[index].asset_name,
           // title:'Click here for perform action',
            shape: "image",
            image: this.resource_img_url+'resource-image/'+this.resources[index].image,
            opacity: 0.7,
            shadow:{
              enabled:true,
              color:color_code,
              size:50
            }
          });

          if(typeof(this.resources[index].configuration) !='undefined' && typeof(this.resources[index].configuration.nic_array) !='undefined')
          {
              var nic_data_array = this.resources[index].configuration.nic_array;
              nic_data_array.forEach((nicObj:any, nicindex:any) => { 

                var nic_network = nic_data_array[nicindex].nic_network; 
                if(nic_network=='Internet' || nic_network=='Traffic Generator')
                {
                  let id = nic_network.replace(/ /g,"").toLowerCase();
                  var from_res:any = '';
                  var to_res = this.resources[index].asset_unique_id;  // vm 
                  from_res = id; // network
                  edges.push({ from: from_res, to: to_res, length: this.EDGE_LENGTH_SUB });
                } 

                this.network_array.forEach((netObj:any, netindex:any) => {
                    if(nic_network==this.network_array[netindex].asset_name)
                    {
                      var to_res = this.resources[index].asset_unique_id;  // vm 
                      var from_res = this.network_array[netindex].asset_unique_id; // network
                      edges.push({ from: from_res, to: to_res, length: this.EDGE_LENGTH_SUB });
                    }
                }); 

              });
          } 

        }
      });
     // here end vm node
 
     var treeData = {
      nodes: nodes,
      edges: edges
    };

    return treeData;
  }

  // here call func when click on action button like power on,off etc
  // and call here parent component function perform_action
  action(action:any,asset_unique_id:any)
  {
    var data_array = [{'action':action,'asset_unique_id':asset_unique_id,'config_popup':this.config_popup}];
    this.perform_action.emit(data_array);
  }


  onRightClick(event:any) {
    event.preventDefault();
  }

}