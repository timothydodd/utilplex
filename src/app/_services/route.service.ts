import { Component, Type } from '@angular/core';
import { DefaultExport, Routes } from '@angular/router';
import { Observable } from 'rxjs';

export class RouteService {
  public static getRoutes() {
    const routes: Routes = [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('../pages/welcome/welcome.component').then((mod) => mod.WelcomeComponent),
        data: {
          title: 'Welcome to Util Plex',
          description: 'Welcome to Util Plex, your go-to online developer tools for various utilities.',
        },
      },
    ];

    for (const c of RouteService.routeCategories) {
      for (const route of c.routes) {
        if (route.loadComponent) {
          routes.push({
            path: route.url.substring(1),
            pathMatch: 'full',
            loadComponent: route.loadComponent,
            data: { title: route.title, description: route.description },
          });
        } else {
          routes.push({
            path: route.url.substring(1),
            pathMatch: 'full',
            component: route.component,
            data: { title: route.title, description: route.description },
          });
        }
      }
    }
    return routes;
  }
  public static routeCategories: RouteCategory[] = [
    {
      name: 'Formatters',
      routes: [
        {
          name: 'SQL',
          title: 'SQL Formatter',
          url: '/format/sql',
          description: 'Easily format your SQL queries to improve readability and consistency.',
          loadComponent: () => import('../formatters/f-sql/f-sql.component').then((mod) => mod.FSqlComponent),
        },
        {
          name: 'JSON',
          title: 'JSON Formatter',
          url: '/format/json',
          description: 'Quickly beautify or minify your JSON data for better visualization and debugging.',
          loadComponent: () => import('../formatters/f-json/f-json.component').then((mod) => mod.FJsonComponent),
        },
        {
          name: 'CSS',
          title: 'CSS Formatter',
          url: '/format/css',
          loadComponent: () => import('../formatters/f-css/f-css.component').then((mod) => mod.FCssComponent),
        },
        {
          name: 'JavaScript',
          title: 'JavaScript Formatter',
          url: '/format/javascript',
          description: 'Beautify your JavaScript code to enhance readability and maintain clean syntax.',
          loadComponent: () =>
            import('../formatters/f-javascript/f-javascript.component').then((mod) => mod.FJavascriptComponent),
        },
      ],
    },
    {
      name: 'Converters',
      routes: [
        {
          name: 'Json To Yaml',
          title: 'Json To Yaml',
          url: '/convert/json-yaml',
          description: 'Convert JSON data to YAML format with ease, preserving structure and readability.',
          loadComponent: () =>
            import('../converters/c-json-yaml/c-json-yaml.component').then((mod) => mod.CJsonYamlComponent),
        },
      ],
    },
    {
      name: 'Encoding',
      routes: [
        {
          name: 'Base64',
          title: 'Base64 Encoder/Decoder',
          url: '/encoding/base64',
          description: 'Encode and decode data in Base64 format for secure transmission and storage.',
          loadComponent: () =>
            import('../encoders/base-64-encoder/base-64-encoder.component').then((mod) => mod.Base64EncoderComponent),
        },
      ],
    },
    {
      name: 'Time',
      routes: [
        {
          name: 'Time Zones',
          title: 'Time Zone Conversions',
          url: '/time/zones',
          description: 'Convert times between different time zones and explore current time differences globally.',
          loadComponent: () => import('../time/time-zones/time-zones.component').then((mod) => mod.TimeZonesComponent),
        },
      ],
    },
  ];
}
export interface RouteCategory {
  name: string;
  routes: UpRoute[];
}
export interface UpRoute {
  name: string;
  url: string;
  title: string;
  description?: string;
  component?: Type<Component>;
  loadComponent?: () =>
    | Type<unknown>
    | Observable<Type<unknown> | DefaultExport<Type<unknown>>>
    | Promise<Type<unknown> | DefaultExport<Type<unknown>>>;
}
