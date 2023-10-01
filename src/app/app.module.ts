
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CJsonYamlComponent } from './converters/c-json-yaml/c-json-yaml.component';
import { ConvertViewComponent } from './converters/convert-view/convert-view.component';
import { FJsonComponent } from './formatters/f-json/f-json.component';
import { FSqlComponent } from './formatters/f-sql/f-sql.component';
import { FYamlComponent } from './formatters/f-yaml/f-yaml.component';
import { FormatViewComponent } from './formatters/format-view/format-view.component';
import { MonacoEditorConfig } from './monaco/monaco-global-config';
import { SideBarComponent } from './nav/side-bar/side-bar.component';
import { TimeZonesComponent } from './time/time-zones/time-zones.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    FSqlComponent,
    FormatViewComponent,
    FJsonComponent,
    FYamlComponent,
    CJsonYamlComponent,
    ConvertViewComponent,  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(new MonacoEditorConfig()),
    BrowserAnimationsModule,
    TimeZonesComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


