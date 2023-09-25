import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FSqlComponent } from './formatters/f-sql/f-sql.component';
import { SideBarComponent } from './nav/side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    FSqlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
