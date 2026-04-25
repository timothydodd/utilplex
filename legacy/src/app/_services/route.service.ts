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
          title: 'Free Online JSON Formatter, SQL Beautifier, YAML Converter, String Measure',
          url: '/',
          description:
            'Util Plex is a web-based platform designed to assist developers and coders by providing tools for formatting programming code and converting data formats.',
          loadComponent: () => import('../pages/welcome/welcome.component').then((mod) => mod.WelcomeComponent),
        },
        {
          name: 'Patch Notes',
          title: "What's New",
          url: '/patch-notes',
          description: 'See the latest updates and improvements to UtilPlex developer tools.',
          loadComponent: () =>
            import('../pages/patch-notes/patch-notes.component').then((mod) => mod.PatchNotesComponent),
        },
        {
          name: 'How It Works',
          title: 'How It Works',
          url: '/how-it-works',
          description: 'Learn how UtilPlex tools run entirely in your browser with no server-side processing.',
          loadComponent: () =>
            import('../pages/how-it-works/how-it-works.component').then((mod) => mod.HowItWorksComponent),
        },
      ],
    },
    {
      name: 'Formatters',
      icon: '🎨',
      categoryDescription: 'Beautify and organize your code',
      gradient: 'linear-gradient(90deg, #ff79c6, #bd93f9)',
      routes: [
        {
          name: 'SQL',
          icon: '🗃️',
          title: 'SQL Formatter',
          url: '/format/sql',
          description: 'Easily format your SQL queries to improve readability and consistency.',
          loadComponent: () => import('../formatters/f-sql/f-sql.component').then((mod) => mod.FSqlComponent),
        },
        {
          name: 'JSON',
          icon: '📋',
          title: 'JSON Formatter',
          url: '/format/json',
          description: 'Quickly beautify or minify your JSON data for better visualization and debugging.',
          loadComponent: () => import('../formatters/f-json/f-json.component').then((mod) => mod.FJsonComponent),
        },
        {
          name: 'CSS',
          icon: '🎨',
          title: 'CSS Formatter',
          url: '/format/css',
          description: 'Organize and beautify your CSS stylesheets with proper spacing and structure',
          loadComponent: () => import('../formatters/f-css/f-css.component').then((mod) => mod.FCssComponent),
        },
        {
          name: 'JavaScript',
          icon: '📜',
          title: 'JavaScript Formatter',
          url: '/format/javascript',
          description: 'Beautify your JavaScript code to enhance readability and maintain clean syntax.',
          loadComponent: () =>
            import('../formatters/f-javascript/f-javascript.component').then((mod) => mod.FJavascriptComponent),
        },
        {
          name: 'TypeScript',
          icon: '🔷',
          title: 'TypeScript Formatter',
          url: '/format/typescript',
          description: 'Format and beautify your TypeScript code with proper indentation and type definitions.',
          loadComponent: () =>
            import('../formatters/f-typescript/f-typescript.component').then((mod) => mod.FTypescriptComponent),
        },
        {
          name: 'SCSS',
          icon: '🎨',
          title: 'SCSS Formatter',
          url: '/format/scss',
          description: 'Format and beautify your SCSS/Sass code with proper indentation and structure.',
          loadComponent: () => import('../formatters/f-scss/f-scss.component').then((mod) => mod.FScssComponent),
        },
        {
          name: 'HTML',
          icon: '🌐',
          title: 'HTML/XML Formatter',
          url: '/format/html',
          description: 'Format and beautify your HTML and XML markup with proper indentation and structure.',
          loadComponent: () => import('../formatters/f-html/f-html.component').then((mod) => mod.FHtmlComponent),
        },
      ],
    },
    {
      name: 'Converters',
      icon: '🔄',
      categoryDescription: 'Transform data between formats',
      gradient: 'linear-gradient(90deg, #8be9fd, #50fa7b)',
      routes: [
        {
          name: 'Json To Yaml',
          icon: '🔄',
          title: 'JSON to YAML Converter',
          url: '/convert/json-yaml',
          description:
            'Convert JSON data to YAML format with property case transformation options including camelCase, snake_case, and more.',
          loadComponent: () =>
            import('../converters/c-json-yaml/c-json-yaml.component').then((mod) => mod.CJsonYamlComponent),
        },
        {
          name: 'Yaml To Json',
          icon: '🔄',
          title: 'YAML to JSON Converter',
          url: '/convert/yaml-json',
          description:
            'Convert YAML data to JSON format with property case transformation options including camelCase, snake_case, and more.',
          loadComponent: () =>
            import('../converters/c-yaml-json/c-yaml-json.component').then((mod) => mod.CYamlJsonComponent),
        },
      ],
    },
    {
      name: 'Encoding',
      icon: '🔐',
      categoryDescription: 'Encode and decode data securely',
      gradient: 'linear-gradient(90deg, #ffb86c, #f1fa8c)',
      routes: [
        {
          name: 'Base64',
          icon: '🔐',
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
      icon: '⏰',
      categoryDescription: 'Work with time zones and dates',
      gradient: 'linear-gradient(90deg, #50fa7b, #8be9fd)',
      routes: [
        {
          name: 'Time Zones',
          icon: '🌍',
          title: 'Time Zone Conversions',
          url: '/time/zones',
          description: 'Convert times between different time zones and explore current time differences globally.',
          loadComponent: () => import('../time/time-zones/time-zones.component').then((mod) => mod.TimeZonesComponent),
        },
      ],
    },
    {
      name: 'Generators',
      icon: '⚡',
      categoryDescription: 'Generate identifiers and content',
      gradient: 'linear-gradient(90deg, #bd93f9, #ff79c6)',
      routes: [
        {
          name: 'GUID',
          icon: '🆔',
          title: 'GUID Generator',
          url: '/generate/guid',
          description: 'Generate unique identifiers (GUIDs/UUIDs) with customizable quantity for your applications.',
          loadComponent: () => import('../generators/g-guid/g-guid.component').then((mod) => mod.GGuidComponent),
        },
        {
          name: 'Lorem',
          icon: '📝',
          title: 'Lorem Ipsum Generator',
          url: '/generate/lorem',
          description: 'Generate Lorem Ipsum placeholder text with options for words, sentences, or paragraphs.',
          loadComponent: () => import('../generators/g-lorem/g-lorem.component').then((mod) => mod.GLoremComponent),
        },
      ],
    },
    {
      name: 'Text',
      icon: '📝',
      categoryDescription: 'Analyze and measure text',
      gradient: 'linear-gradient(90deg, #f1fa8c, #50fa7b)',
      routes: [
        {
          name: 'String Measure',
          icon: '📏',
          title: 'String Measure',
          url: '/text/string-measure',
          description:
            'Analyze text with character, word, sentence, line, and paragraph counts plus byte size and character breakdown.',
          loadComponent: () =>
            import('../text/string-measure/string-measure.component').then((mod) => mod.StringMeasureComponent),
        },
      ],
    },
    {
      name: 'Diff',
      icon: '📊',
      categoryDescription: 'Compare files and text',
      gradient: 'linear-gradient(90deg, #ff5555, #ffb86c)',
      routes: [
        {
          name: 'File Diff',
          icon: '📊',
          title: 'File Diff Checker',
          url: '/diff/files',
          description:
            'Compare two files or text blocks and highlight the differences between them. Perfect for code reviews and content comparison.',
          loadComponent: () => import('../diff/diff-view/diff-view.component').then((mod) => mod.DiffViewComponent),
        },
      ],
    },
  ];
}
export interface RouteCategory {
  name: string;
  icon?: string;
  categoryDescription?: string;
  gradient?: string;
  routes: UpRoute[];
}
export interface UpRoute {
  name: string;
  url: string;
  title: string;
  icon?: string;
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
