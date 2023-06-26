import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterPipe',
  
})
export class FilterPipe implements PipeTransform {

  transform(basket: any[], e_id: string): any {
    if(basket.length!=0)
    {

      var ret = true;
      basket.forEach( (myObject:any, index:any) => {
           if(basket[index].exe_id == e_id)
           {
             ret = false;
           }
      });

      return ret;
    }else
    {
      return true;
    }
  }

}