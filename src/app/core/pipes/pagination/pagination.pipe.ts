import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination',
})
export class PaginationPipe implements PipeTransform {
  transform(value: any[], page: any): any {
    return [...value.slice(5 * page, 5 * (page + 1))];
  }
}
