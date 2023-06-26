import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exercisefilter'
})
export class ExercisefilterPipe implements PipeTransform {

ret:boolean = false;

 public transform(vm_control:any[], id: any[]): any {
    this.ret = false;
    if(vm_control.length!=0)
    {
      vm_control.forEach((myObject:any, index:any) => {
        //here  
        //id[0] = exercise id and id[1] = team_id
          if(vm_control[index].ex_id == id[0] && myObject.team_id == id[1])
          {
          this.ret = true;
          }
      });
      return this.ret;
    }else
    {
      return this.ret;
    }
  }
  
}
