import { Routes } from "@angular/router";
import { CJsonYamlComponent } from "../converters/c-json-yaml/c-json-yaml.component";
import { FJsonComponent } from "../formatters/f-json/f-json.component";
import { FSqlComponent } from "../formatters/f-sql/f-sql.component";
import { TimeZonesComponent } from "../time/time-zones/time-zones.component";


export class RouteService{


    public static getRoutes()
    {
        const routes: Routes = [];
        for (const c of RouteService.routeCategories)
        {   
            for (const route of c.routes)
            {
             routes.push({ path: route.url.substring(1), pathMatch: 'full', component: route.component });
            }
        }
        return routes;
    }
    public static routeCategories = [
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
                { name: 'Json To Yaml', url: '/convert/json-yaml', component: CJsonYamlComponent },
            ]
        },
        {
            name: 'Time',
            routes: [
                { name: 'Time Zones', url: '/time/zones', component: TimeZonesComponent },
            ]
        }
    ]
}