import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouteService } from '../../_services/route.service';
import { SwitchComponent } from '../../components/switch/switch.component';
import { TimepickerComponent } from '../../components/timepicker/timepicker.component';

interface TimeZone {
  text: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  value: string;
}

@Component({
  selector: 'app-time-zones',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, TimepickerComponent, SwitchComponent],
  templateUrl: './time-zones.component.html',
  styleUrls: ['./time-zones.component.scss'],
})
export class TimeZonesComponent implements OnInit {
  selectedTime = signal<Date>(new Date());
  amPM = signal(true);
  currentZone = signal<TimeZone | null>(null);
  covertToZone = signal<TimeZone | null>(null);
  error = signal<string | null>(null);

  zones: TimeZone[] = [
    { text: 'UTC (Coordinated Universal Time)', abbr: 'UTC', offset: 0, isdst: false, value: 'UTC' },
    { text: 'EST (Eastern Standard Time)', abbr: 'EST', offset: -5, isdst: false, value: 'America/New_York' },
    { text: 'EDT (Eastern Daylight Time)', abbr: 'EDT', offset: -4, isdst: true, value: 'America/New_York' },
    { text: 'CST (Central Standard Time)', abbr: 'CST', offset: -6, isdst: false, value: 'America/Chicago' },
    { text: 'CDT (Central Daylight Time)', abbr: 'CDT', offset: -5, isdst: true, value: 'America/Chicago' },
    { text: 'MST (Mountain Standard Time)', abbr: 'MST', offset: -7, isdst: false, value: 'America/Denver' },
    { text: 'MDT (Mountain Daylight Time)', abbr: 'MDT', offset: -6, isdst: true, value: 'America/Denver' },
    { text: 'PST (Pacific Standard Time)', abbr: 'PST', offset: -8, isdst: false, value: 'America/Los_Angeles' },
    { text: 'PDT (Pacific Daylight Time)', abbr: 'PDT', offset: -7, isdst: true, value: 'America/Los_Angeles' },
    { text: 'GMT (Greenwich Mean Time)', abbr: 'GMT', offset: 0, isdst: false, value: 'Europe/London' },
    { text: 'BST (British Summer Time)', abbr: 'BST', offset: 1, isdst: true, value: 'Europe/London' },
    { text: 'CET (Central European Time)', abbr: 'CET', offset: 1, isdst: false, value: 'Europe/Paris' },
    { text: 'CEST (Central European Summer Time)', abbr: 'CEST', offset: 2, isdst: true, value: 'Europe/Paris' },
    { text: 'EET (Eastern European Time)', abbr: 'EET', offset: 2, isdst: false, value: 'Europe/Athens' },
    { text: 'EEST (Eastern European Summer Time)', abbr: 'EEST', offset: 3, isdst: true, value: 'Europe/Athens' },
    { text: 'JST (Japan Standard Time)', abbr: 'JST', offset: 9, isdst: false, value: 'Asia/Tokyo' },
    {
      text: 'AEST (Australian Eastern Standard Time)',
      abbr: 'AEST',
      offset: 10,
      isdst: false,
      value: 'Australia/Sydney',
    },
    {
      text: 'AEDT (Australian Eastern Daylight Time)',
      abbr: 'AEDT',
      offset: 11,
      isdst: true,
      value: 'Australia/Sydney',
    },
    { text: 'NZST (New Zealand Standard Time)', abbr: 'NZST', offset: 12, isdst: false, value: 'Pacific/Auckland' },
    { text: 'NZDT (New Zealand Daylight Time)', abbr: 'NZDT', offset: 13, isdst: true, value: 'Pacific/Auckland' },
    { text: 'IST (India Standard Time)', abbr: 'IST', offset: 5.5, isdst: false, value: 'Asia/Kolkata' },
    { text: 'CST (China Standard Time)', abbr: 'CST', offset: 8, isdst: false, value: 'Asia/Shanghai' },
    { text: 'KST (Korea Standard Time)', abbr: 'KST', offset: 9, isdst: false, value: 'Asia/Seoul' },
  ];

  currentTimeFrom = computed(() => {
    const zone = this.currentZone();
    const time = this.selectedTime();
    if (!zone || !time) return null;

    try {
      return this.formatTimeForDisplay(time);
    } catch (error) {
      this.error.set('Error formatting source time');
      return null;
    }
  });

  currentTimeTo = computed(() => {
    const fromZone = this.currentZone();
    const toZone = this.covertToZone();
    const time = this.selectedTime();
    if (!fromZone || !toZone || !time) return null;

    try {
      const convertedTime = this.convertTime(time, fromZone, toZone);
      return this.formatTimeForDisplay(convertedTime);
    } catch (error) {
      this.error.set('Error converting time');
      return null;
    }
  });

  ngOnInit(): void {
    RouteService.Title.set('Time Zone Converter');
    this.initializeWithCurrentTime();
  }

  private initializeWithCurrentTime(): void {
    try {
      const now = new Date();
      this.selectedTime.set(now);

      // Try to detect user's timezone
      const userOffset = -now.getTimezoneOffset() / 60;

      // Find matching timezone or default to UTC
      let matchingZone = this.zones.find((zone) => Math.abs(zone.offset - userOffset) < 0.1);

      // If no exact match found, try to find by timezone name
      if (!matchingZone) {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        matchingZone = this.zones.find(
          (zone) =>
            zone.value === userTimezone ||
            zone.value.includes(userTimezone.split('/')[1]) ||
            zone.text.toLowerCase().includes(userTimezone.toLowerCase())
        );
      }

      // Default to UTC if still no match
      if (!matchingZone) {
        matchingZone = this.zones[0]; // UTC
      }

      this.currentZone.set(matchingZone);

      // Set target zone to a different zone for demonstration
      const targetZone = matchingZone === this.zones[0] ? this.zones[1] : this.zones[0];
      this.covertToZone.set(targetZone);

      this.error.set(null);
    } catch (error) {
      this.error.set('Failed to initialize timezone data');
      this.currentZone.set(this.zones[0]); // UTC
      this.covertToZone.set(this.zones[1]); // EST
    }
  }

  private formatTimeForDisplay(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (this.amPM()) {
      // 12-hour format
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const meridian = hours >= 12 ? 'PM' : 'AM';
      return `${displayHour}:${minutes.toString().padStart(2, '0')} ${meridian}`;
    } else {
      // 24-hour format
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  private convertTime(date: Date, fromZone: TimeZone, toZone: TimeZone): Date {
    // The selectedTime represents a time in the "from" timezone
    // We need to convert it to the "to" timezone

    // Create a new date with the same time components
    const sourceTime = new Date(date);

    // Calculate the difference in hours between timezones
    const offsetDifference = toZone.offset - fromZone.offset;

    // Apply the offset difference
    const convertedTime = new Date(sourceTime.getTime() + offsetDifference * 60 * 60 * 1000);

    return convertedTime;
  }

  timeZoneChanged(): void {
    this.error.set(null);
    // Trigger computed signals to recalculate
  }

  btnSwitch(): void {
    const temp = this.currentZone();
    this.currentZone.set(this.covertToZone());
    this.covertToZone.set(temp);
    this.timeZoneChanged();
  }

  onTimeChange(newTime: Date): void {
    this.selectedTime.set(newTime);

    this.timeZoneChanged();
  }
}
