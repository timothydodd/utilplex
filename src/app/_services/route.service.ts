import { Type } from "@angular/core";
import { DefaultExport, Routes } from "@angular/router";
import { Observable } from "rxjs";


export class RouteService{


    public static getRoutes()
    {
        const routes: Routes = [];
        for (const c of RouteService.routeCategories)
        {   
            for (const route of c.routes)
            {
                if (route.loadComponent)
                {
                    routes.push({ path: route.url.substring(1), pathMatch: 'full', loadComponent: route.loadComponent });
                }else{
             routes.push({ path: route.url.substring(1), pathMatch: 'full', component: route.component });
                }
            }
        }
        return routes;
    }
    public static routeCategories: RouteCategory[] = [
        {
            name: 'Formatters',
            routes: [
                { name: 'SQL', url: '/format/sql', loadComponent: () => import('../formatters/f-sql/f-sql.component').then(mod => mod.FSqlComponent) },
                { name: 'JSON', url: '/format/json', loadComponent: () => import('../formatters/f-json/f-json.component').then(mod => mod.FJsonComponent)  },
                { name: 'CSS', url: '/format/css', loadComponent: () => import('../formatters/f-css/f-css.component').then(mod => mod.FCssComponent) }
            ]
        },
        {
            name: 'Converters',
            routes: [
                { name: 'Json To Yaml', url: '/convert/json-yaml', loadComponent: () => import('../converters/c-json-yaml/c-json-yaml.component').then(mod => mod.CJsonYamlComponent) },
            ]
        },
        {
            name: 'Time',
            routes: [
                { name: 'Time Zones', url: '/time/zones', loadComponent: () => import('../time/time-zones/time-zones.component').then(mod => mod.TimeZonesComponent)},
            ]
        }
    ]
}
export interface RouteCategory{
    name:string | any;
    routes: UpRoute[];
}
export interface UpRoute{
    name: string | any;
    url: string | any;
    component?: Type<any>;
    loadComponent?: () => Type<unknown> | Observable<Type<unknown> | DefaultExport<Type<unknown>>> | Promise<Type<unknown> | DefaultExport<Type<unknown>>>;
}