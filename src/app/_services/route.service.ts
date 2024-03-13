import { Component, Type } from "@angular/core";
import { DefaultExport, Routes } from "@angular/router";
import { Observable } from "rxjs";


export class RouteService{


    public static getRoutes()
    {
        const routes: Routes = [
            { path: '', pathMatch: 'full', loadComponent: () => import('../pages/welcome/welcome.component').then(mod => mod.WelcomeComponent), data: { title: 'Welcome to Util Plex' } }
        ];

        for (const c of RouteService.routeCategories)
        {   
            for (const route of c.routes)
            {
                if (route.loadComponent)
                {
                    routes.push({ path: route.url.substring(1), pathMatch: 'full', loadComponent: route.loadComponent, data: { title: route.title } });
                }else{
             routes.push({ path: route.url.substring(1), pathMatch: 'full', component: route.component,data:{title:route.title} });
                }
            }
        }
        return routes;
    }
    public static routeCategories: RouteCategory[] = [
        {
            name: 'Formatters',
            routes: [
                { name: 'SQL', title:'SQL Formatter',  url: '/format/sql', loadComponent: () => import('../formatters/f-sql/f-sql.component').then(mod => mod.FSqlComponent) },
                { name: 'JSON', title: 'JSON Formatter', url: '/format/json', loadComponent: () => import('../formatters/f-json/f-json.component').then(mod => mod.FJsonComponent)  },
                { name: 'CSS', title: 'CSS Formatter', url: '/format/css', loadComponent: () => import('../formatters/f-css/f-css.component').then(mod => mod.FCssComponent) },
                { name: 'JavaScript', title: 'JavaScript Formatter', url: '/format/javascript', loadComponent: () => import('../formatters/f-javascript/f-javascript.component').then(mod => mod.FJavascriptComponent) }
            ]
        },
        {
            name: 'Converters',
            routes: [
                { name: 'Json To Yaml', title: 'Json To Yaml', url: '/convert/json-yaml', loadComponent: () => import('../converters/c-json-yaml/c-json-yaml.component').then(mod => mod.CJsonYamlComponent) },
            ]
        },
        {
            name: 'Time',
            routes: [
                { name: 'Time Zones', title:'Time Zone Conversions' , url: '/time/zones', loadComponent: () => import('../time/time-zones/time-zones.component').then(mod => mod.TimeZonesComponent)},
            ]
        }
    ]
}
export interface RouteCategory{
    name:string ;
    routes: UpRoute[];
}
export interface UpRoute{
    name: string ;
    url: string;
    title:string ;
    component?: Type<Component>;
    loadComponent?: () => Type<unknown> | Observable<Type<unknown> | DefaultExport<Type<unknown>>> | Promise<Type<unknown> | DefaultExport<Type<unknown>>>;
}