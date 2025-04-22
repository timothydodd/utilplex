import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostBinding, Input, input, Output } from '@angular/core';
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SwitchComponent implements ControlValueAccessor {
  static uniqueIdCounter = 0;
  constructor() {
    this.uniqueId = `switch-${SwitchComponent.uniqueIdCounter++}`;
    this.onChange = () => {};
    this.onTouched = () => {};
  }

  uniqueId: string = 'switch'; // Generate a unique ID

  small = input<boolean>(false);
  @Input()
  checked = false;
  @HostBinding('class.s-disable')
  @Input()
  disabled = false;
  label = input<string>();
  @Output()
  checkedEvent = new EventEmitter<boolean>();

  private onChange: (value: any) => void;
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
  change() {
    this.onChange(this.checked);
    this.checkedEvent.emit(this.checked);
    this.onTouched();
  }
}
