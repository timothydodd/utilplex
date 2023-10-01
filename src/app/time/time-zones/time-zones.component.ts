import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-time-zones',
  templateUrl: './time-zones.component.html',
  styleUrls: ['./time-zones.component.scss']
})
export class TimeZonesComponent {
  error = signal<string>('');
  currentZone :TimeZone | any;
  covertToZone :TimeZone | any;
  zones: TimeZone[] = [];
  selectedTime = new Date();
  currentTime = signal<string>('');
  httpClient = inject(HttpClient);
  
  ZoneConversions: ZoneConversion[] = [];
  constructor() { 
    this.loadData();
  }
  loadData()
  {
    this.httpClient.get<TimeZone[]>('./assets/json/timezones.json').subscribe((res) => {
      this.zones = res;
      this.currentZone = this.findZone();
      this.covertToZone = this.findUTC();
      console.log(new Date().toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4));
      this.timeZoneChanged();
    });
  }
  findUTC()
  {
    return this.zones.find((x: TimeZone) => x.value === 'UTC');
  }
  findZone() {
    const myzone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
    for(const zone of this.zones)
    {
      if (zone.utc.find((x: string) => x === myzone))
      {
        return zone;
      }
    }
    return null;
  }
  timeZoneChanged() {
    if (!this.currentZone)
    return;
    const time = this.selectedTime;

    const hour =  time.getHours() - this.currentZone.offset;
    const today = new Date();
  
    const ndate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, time.getMinutes(), time.getSeconds());


    const lDate = time.toLocaleString("en-US", { timeZone: this.currentZone.utc[0], weekday: "long", year: "numeric", month: "2-digit", day: "numeric" });
    const lTime = time.toLocaleTimeString("en-US", { timeZone: this.currentZone.utc[0], hour12: false, hour: 'numeric', minute: '2-digit' });


    const tDate = ndate.toLocaleString("en-US", { timeZone: this.currentZone.utc[0], weekday: "long", year: "numeric", month: "2-digit", day: "numeric" });
    const tTime = ndate.toLocaleTimeString("en-US", { timeZone: this.currentZone.utc[0], hour12: false, hour: 'numeric', minute: '2-digit' });



    this.currentTime.set('From :' + lDate + " "+ lTime + " To: " + tDate + " " + tTime);



  }
  btnSwitch()
  {
    const temp = this.currentZone;
    this.currentZone = this.covertToZone;
    this.covertToZone = temp;
    this.timeZoneChanged();
  }
}

export interface ZoneConversion{
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