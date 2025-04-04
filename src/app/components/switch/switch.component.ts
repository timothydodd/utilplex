import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SwitchComponent),
  multi: true,
};


@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [CUSTOM_VALUE_ACCESSOR],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SwitchComponent implements ControlValueAccessor {

  @Input()
  small = false;
  @Input()
  checked = false;


  @Input()
  disabled = false;

  @Output()
  checkedEvent = new EventEmitter<boolean>();
  constructor() {
    this.onChange = (_: any) => { //nothing
    };
    this.onTouched = () => {//nothing 
    };
  }
  private onChange: (_: any) => void;
  private onTouched: () => void;


  writeValue(obj: any): void {
    this.checked = obj;
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  change(e:any) {
   this.onChange(this.checked);
    this.checkedEvent.emit(this.checked);
  this.onTouched();
  }
}
