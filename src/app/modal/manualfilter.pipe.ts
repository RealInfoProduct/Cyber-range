import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'manualfilter'
})
export class ManualfilterPipe implements PipeTransform {

  manual:string = '';
  transform(manual_list: any[], user_manual: any[]): any {
    if(manual_list.length!=0)
    {
      this.manual = '';
      var manual_array = [];
      //console.log(manual_list);

      //console.log(user_manual);

      manual_list.forEach((mobj:any, index:any) => 
      {
        user_manual.forEach((umobj:any, uind:any) => 
        {
             if(mobj.id==umobj)
             {
               manual_array.push(mobj.menual_title);
             }
        });
      });
      if(manual_array.length!=0)
      {
        this.manual = manual_array.join('<br>');
      }
      return this.manual;
    }else
    {
      return this.manual;
    }
  }


}
