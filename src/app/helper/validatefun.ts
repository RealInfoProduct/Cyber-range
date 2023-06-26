import { AbstractControl } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
      return { required: true }
  }
  else {
      return null;
  }
  }

  export function csvValidator(control: AbstractControl) 
  {
        var name = control.value;
        var ind = name.lastIndexOf('.') + 1
        var ext = name.substring(ind);
        if(ext!='' && ext.toLowerCase() != 'csv') 
        {
            control.setValue('');
            return { required: true }
        }
        else 
        {
           return '';
        }
    }

  export function lessThanZeroValidator(control: AbstractControl) {
    if (control && control.value && control.value<0)
    {
        control.setValue('');
        return { required: true }
    }
    else {
        return '';
    }
}
    export function greaterThanZeroValidator(control: AbstractControl) {

        if (control && control.value && control.value<=0)
        {
           control.setValue('');
            return { greaterThanZeroValidator: true }
        }else if (control && control.value===0)
        {
            control.setValue('');
            return { greaterThanZeroValidator: true }
        }
        else {
            return '';
        }
    }  

    export function digitValidator(control: AbstractControl) {
        if(control && isNaN(control.value)){
            control.setValue('');
            return { digitValidator: true }        }
        else {
            return '';
        }
    }  

    export function imgValidator(control: AbstractControl) 
    {
          var name = control.value;
          var ind = name.lastIndexOf('.') + 1
          var ext = name.substring(ind);
          var img = ['png','jpg','jpeg'];
          var index = img.indexOf(ext); 
          if(ext!='' && ext.toLowerCase() != 'csv') 
          {
              control.setValue('');
              return { required: true }
          }
          else 
          {
             return '';
          }
      }



    