import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vmcontrolfilter'
})
export class VmcontrolfilterPipe implements PipeTransform {

vm_array:any = [];

  transform(vm_control: any[], ex_id: string): any {
    if(vm_control.length!=0)
    {
      this.vm_array = [];
      vm_control.forEach((vmObj:any, index:any) => 
      {
           if(vmObj.ex_id == ex_id)
           {
            this.vm_array.push({'ex_id':vmObj.ex_id,
            'team_id':vmObj.team_id,
            'unique_id':vmObj.unique_id,
            'manual':vmObj.manual,
            'control':vmObj.control});
          }
      });
      console.log(this.vm_array);
      return this.vm_array;
    }else
    {
      return this.vm_array;
    }
  }

}
