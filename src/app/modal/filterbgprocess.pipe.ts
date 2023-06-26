import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterbgprocess'
})
export class FilterbgprocessPipe implements PipeTransform {

  ret:boolean = false;

 public transform(bg_array:any[], allot_id: any, bg_task:any[]): any {
    this.ret = false;
    if(bg_array.length!=0)
    {
      bg_array.forEach((myObj:any, index:any) => {
          
        bg_task.forEach((taskObj:any, index:any) => {

          if(myObj.process_type == taskObj.task && myObj.asset_unique_id == allot_id)
          {
            this.ret = true;
          }

        }); 

        
      });
      return this.ret;
    }else
    {
      return this.ret;
    }
  }

}
