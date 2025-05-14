import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import { SwitchComponent } from 'src/app/components/switch/switch.component';
@Component({
  selector: 'app-time-zones',
  templateUrl: './time-zones.component.html',
  styleUrls: ['./time-zones.component.scss'],
  imports: [CommonModule, NgSelectModule, FormsModule, HttpClientModule, TimepickerModule, SwitchComponent],
})
export class TimeZonesComponent {
  error = signal<string>('');
  currentZone: TimeZone | any;
  covertToZone: TimeZone | any;
  zones: TimeZone[] = [];
  selectedTime = new Date();
  currentTimeFrom = signal<string>('');
  currentTimeTo = signal<string>('');
  httpClient = inject(HttpClient);
  ZoneConversions: ZoneConversion[] = [];
  amPM = false;
  private meta = inject(Meta);
  private title = inject(Title);
  constructor() {
    var data = getRouteData('Time Zones');
    if (!data) {
      throw new Error('Route data not found for welcome');
    }
    this.title.setTitle('UtilPlex |' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });
    this.loadData();
    RouteService.Title.set(data.title);
  }
  loadData() {
    this.httpClient.get<TimeZone[]>('./assets/json/timezones.json').subscribe((res) => {
      this.zones = res;
      this.currentZone = this.findZone();
      this.covertToZone = this.findUTC();
      console.log(new Date().toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4));
      this.timeZoneChanged();
    });
  }
  findUTC() {
    return this.zones.find((x: TimeZone) => x.value === 'UTC');
  }
  findZone() {
    const myzone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    for (const zone of this.zones) {
      if (zone.utc.find((x: string) => x === myzone)) {
        return zone;
      }
    }
    return null;
  }
  timeZoneChanged() {
    if (!this.currentZone) return;
    const time = this.selectedTime;

    const today = new Date();

    const timeFrom = new Date(
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      )
    );

    const ndate = new Date(timeFrom.getTime() - this.currentZone.offset * 60 * 60 * 1000);

    const fDate = timeFrom.toLocaleString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    });
    const fTime = timeFrom.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour12: this.amPM,
      hour: 'numeric',
      minute: '2-digit',
    });

    const tDate = ndate.toLocaleString('en-US', {
      timeZone: this.covertToZone.utc[0],
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    });
    const tTime = ndate.toLocaleTimeString('en-US', {
      timeZone: this.covertToZone.utc[0],
      hour12: this.amPM,
      hour: 'numeric',
      minute: '2-digit',
    });

    this.currentTimeFrom.set(fDate + ' ' + fTime);
    this.currentTimeTo.set(tDate + ' ' + tTime);
  }
  btnSwitch() {
    const temp = this.currentZone;
    this.currentZone = this.covertToZone;
    this.covertToZone = temp;
    this.timeZoneChanged();
  }
}

export interface ZoneConversion {
  fromZone: TimeZone | any;
  toZone: TimeZone | any;
  date: Date;
}
export interface TimeZone {
  value: string;
  abbr: string;
  offset: number;
  isdst: boolean;
  text: string;
  utc: string[];
}
