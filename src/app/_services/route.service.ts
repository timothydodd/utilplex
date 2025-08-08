import { Component, signal, Type } from '@angular/core';
import { DefaultExport, Routes } from '@angular/router';
import { Observable } from 'rxjs';

export class RouteService {
  public static Title = signal<string>('Util Plex');
  public static getRoutes() {
    const routes: Routes = [];

    for (const c of RouteService.routeCategories) {
      for (const route of c.routes) {
        if (route.loadComponent) {
          routes.push({
            path: route.url.substring(1),
            pathMatch: 'full',
            loadComponent: route.loadComponent,
          });
        } else {
          routes.push({
            path: route.url.substring(1),
            pathMatch: 'full',
            component: route.component,
          });
        }
      }
    }
    return routes;
  }
  public static routeCategories: RouteCategory[] = [
    {
      name: 'Home',
      routes: [
        {
          name: 'Welcome',
          title: 'Free Online JSON Formatter, SQL Beautifier, YAML Converter',
          url: '/',
          description:
            'Util Plex is a web-based platform designed to assist developers and coders by providing tools for formatting programming code and converting data formats.',
          loadComponent: () => import('../pages/welcome/welcome.component').then((mod) => mod.WelcomeComponent),
        },
      ],
    },
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
          description: 'Organize and beautify your CSS stylesheets with proper spacing and structure',
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
        {
          name: 'SCSS',
          title: 'SCSS Formatter',
          url: '/format/scss',
          description: 'Format and beautify your SCSS/Sass code with proper indentation and structure.',
          loadComponent: () => import('../formatters/f-scss/f-scss.component').then((mod) => mod.FScssComponent),
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
    {
      name: 'Generators',
      routes: [
        {
          name: 'GUID',
          title: 'GUID Generator',
          url: '/generate/guid',
          description: 'Generate unique identifiers (GUIDs/UUIDs) with customizable quantity for your applications.',
          loadComponent: () => import('../generators/g-guid/g-guid.component').then((mod) => mod.GGuidComponent),
        },
        {
          name: 'Lorem',
          title: 'Lorem Ipsum Generator',
          url: '/generate/lorem',
          description: 'Generate Lorem Ipsum placeholder text with options for words, sentences, or paragraphs.',
          loadComponent: () => import('../generators/g-lorem/g-lorem.component').then((mod) => mod.GLoremComponent),
        },
      ],
    },
    {
      name: 'Diff',
      routes: [
        {
          name: 'File Diff',
          title: 'File Diff Checker',
          url: '/diff/files',
          description: 'Compare two files or text blocks and highlight the differences between them. Perfect for code reviews and content comparison.',
          loadComponent: () => import('../diff/diff-view/diff-view.component').then((mod) => mod.DiffViewComponent),
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

export function getRouteData(name: string): UpRoute | null {
  for (const c of RouteService.routeCategories) {
    for (const route of c.routes) {
      if (route.name === name) {
        return route;
      }
    }
  }
  return null;
}
