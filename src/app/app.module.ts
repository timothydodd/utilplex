import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FJsonComponent } from './formatters/f-json/f-json.component';
import { FSqlComponent } from './formatters/f-sql/f-sql.component';
import { FormatViewComponent } from './formatters/format-view/format-view.component';
import { MonacoEditorConfig } from './monaco/config';
import { SideBarComponent } from './nav/side-bar/side-bar.component';
import { FYamlComponent } from './formatters/f-yaml/f-yaml.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    FSqlComponent,
    FormatViewComponent,
    FJsonComponent,
    FYamlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(new MonacoEditorConfig()),
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


