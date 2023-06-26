import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vmrowscountfilter'
})
export class VmrowscountfilterPipe implements PipeTransform {

rowcount:number = 0;

  transform(vm_array: any[], id: any[]): any {
    if(vm_array.length!=0)
    {

      //console.log(vm_array);
      //console.log(id);
      this.rowcount = 0;
      vm_array.forEach( (myObject:any, index:any) => {
        //here  
        //id[0] = exercise id and id[1] = team_id
        if(myObject.ex_id == id[0] && myObject.team_id == id[1])
        {
          this.rowcount = this.rowcount+1;
        }
      });
      return this.rowcount;
    }else
    {
      return this.rowcount;
    }
  }

}
