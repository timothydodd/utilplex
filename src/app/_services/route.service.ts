import { Type } from "@angular/core";
import { DefaultExport, Routes } from "@angular/router";
import { Observable } from "rxjs";
import { CJsonYamlComponent } from "../converters/c-json-yaml/c-json-yaml.component";
import { FJsonComponent } from "../formatters/f-json/f-json.component";
import { FSqlComponent } from "../formatters/f-sql/f-sql.component";


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
                { name: 'SQL', url: '/format/sql', component: FSqlComponent },
                { name: 'JSON', url: '/format/json', component: FJsonComponent }
            ]
        },
        {
            name: 'Converters',
            routes: [
                { name: 'Json To Yaml', url: '/convert/json-yaml', component: CJsonYamlComponent},
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