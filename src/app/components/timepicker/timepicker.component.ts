import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimepickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="timepicker-container">
      <div class="time-inputs">
        <div class="time-input-group">
          <button type="button" class="time-btn increment-btn" (click)="incrementHour()" [disabled]="disabled()">
            ▲
          </button>
          <input
            type="number"
            class="time-input hour-input"
            [value]="displayHour()"
            (input)="onHourChange($event)"
            (blur)="validateAndUpdateHour($event)"
            [min]="showMeridian() ? 1 : 0"
            [max]="showMeridian() ? 12 : 23"
            [disabled]="disabled()"
          />
          <button type="button" class="time-btn decrement-btn" (click)="decrementHour()" [disabled]="disabled()">
            ▼
          </button>
        </div>

        <div class="time-separator">:</div>

        <div class="time-input-group">
          <button type="button" class="time-btn increment-btn" (click)="incrementMinute()" [disabled]="disabled()">
            ▲
          </button>
          <input
            type="number"
            class="time-input minute-input"
            [value]="minute().toString().padStart(2, '0')"
            (input)="onMinuteChange($event)"
            (blur)="validateAndUpdateMinute($event)"
            min="0"
            max="59"
            [disabled]="disabled()"
          />
          <button type="button" class="time-btn decrement-btn" (click)="decrementMinute()" [disabled]="disabled()">
            ▼
          </button>
        </div>

        @if (showMeridian()) {
          <div class="meridian-group">
            <button type="button" class="time-btn meridian-btn" (click)="toggleMeridian()" [disabled]="disabled()">
              {{ meridian() }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent implements ControlValueAccessor {
  showMeridian = input(true);
  disabled = signal(false);
  timeChange = output<Date>();

  hour = signal(12);
  minute = signal(0);
  meridian = signal<'AM' | 'PM'>('AM');

  private onChange = (value: Date) => {};
  private onTouched = () => {};

  displayHour(): string {
    const h = this.hour();
    if (this.showMeridian()) {
      return h.toString();
    }
    return h.toString().padStart(2, '0');
  }

  onHourChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.hour.set(value);
      this.updateTime();
    }
  }

  onMinuteChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      this.minute.set(value);
      this.updateTime();
    }
  }

  validateAndUpdateHour(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value)) {
      value = this.showMeridian() ? 12 : 0;
    } else {
      if (this.showMeridian()) {
        value = Math.max(1, Math.min(12, value));
      } else {
        value = Math.max(0, Math.min(23, value));
      }
    }

    this.hour.set(value);
    input.value = this.displayHour();
    this.updateTime();
  }

  validateAndUpdateMinute(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (isNaN(value)) {
      value = 0;
    } else {
      value = Math.max(0, Math.min(59, value));
    }

    this.minute.set(value);
    input.value = value.toString().padStart(2, '0');
    this.updateTime();
  }

  incrementHour(): void {
    if (this.disabled()) return;

    let newHour = this.hour() + 1;

    if (this.showMeridian()) {
      if (newHour > 12) {
        newHour = 1;
      }
    } else {
      if (newHour > 23) {
        newHour = 0;
      }
    }

    this.hour.set(newHour);
    this.updateTime();
  }

  decrementHour(): void {
    if (this.disabled()) return;

    let newHour = this.hour() - 1;

    if (this.showMeridian()) {
      if (newHour < 1) {
        newHour = 12;
      }
    } else {
      if (newHour < 0) {
        newHour = 23;
      }
    }

    this.hour.set(newHour);
    this.updateTime();
  }

  incrementMinute(): void {
    if (this.disabled()) return;

    let newMinute = this.minute() + 1;
    if (newMinute > 59) {
      newMinute = 0;
    }

    this.minute.set(newMinute);
    this.updateTime();
  }

  decrementMinute(): void {
    if (this.disabled()) return;

    let newMinute = this.minute() - 1;
    if (newMinute < 0) {
      newMinute = 59;
    }

    this.minute.set(newMinute);
    this.updateTime();
  }

  toggleMeridian(): void {
    if (this.disabled()) return;

    this.meridian.set(this.meridian() === 'AM' ? 'PM' : 'AM');
    this.updateTime();
  }

  private updateTime(): void {
    const date = new Date();
    let hour = this.hour();

    if (this.showMeridian()) {
      if (this.meridian() === 'PM' && hour !== 12) {
        hour += 12;
      } else if (this.meridian() === 'AM' && hour === 12) {
        hour = 0;
      }
    }

    date.setHours(hour, this.minute(), 0, 0);
    this.onChange(date);
    this.timeChange.emit(date);
    this.onTouched();
  }

  writeValue(value: Date | null): void {
    if (value) {
      const hour = value.getHours();
      const minute = value.getMinutes();

      if (this.showMeridian()) {
        if (hour === 0) {
          this.hour.set(12);
          this.meridian.set('AM');
        } else if (hour <= 12) {
          this.hour.set(hour);
          this.meridian.set('AM');
        } else {
          this.hour.set(hour - 12);
          this.meridian.set('PM');
        }
      } else {
        this.hour.set(hour);
      }

      this.minute.set(minute);
    }
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
