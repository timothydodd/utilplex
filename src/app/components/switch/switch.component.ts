import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostBinding, input, output, signal } from '@angular/core';
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
  private _checked = signal(false);
  private _disabled = signal(false);
  label = input<string>();
  checkedEvent = output<boolean>();

  @HostBinding('class.s-disable')
  get disabled(): boolean {
    return this._disabled();
  }

  set disabled(value: boolean) {
    this._disabled.set(value);
  }

  private onChange: (value: any) => void;
  private onTouched: () => void;

  get checked(): boolean {
    return this._checked();
  }

  set checked(value: boolean) {
    this._checked.set(value);
  }

  writeValue(obj: any): void {
    this._checked.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
  change() {
    this.onChange(this.checked);
    this.checkedEvent.emit(this.checked);
    this.onTouched();
  }
}
