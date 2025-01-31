import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupname'
})
export class GroupnamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value){
      return ''
    } else {
      const fullName = value.split('-').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join('-');
      return fullName
    }
  }

}
