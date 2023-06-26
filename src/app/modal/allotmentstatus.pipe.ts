import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allotmentstatus'
})
export class AllotmentstatusPipe implements PipeTransform {

  ret:boolean = false;

  public transform(status_array:any[], status: any): any {
     this.ret = false;
     if(status_array.length==0)
     {
         this.ret = true;
     }else
     {
      status_array.forEach((myObj:any, index:any) => {
          if(myObj==status)
          {
            this.ret = true;
          }
      });
     }
     return this.ret;
   }

}
