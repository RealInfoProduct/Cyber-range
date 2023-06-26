import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vmarrayfilter'
})
export class VmarrayfilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
