import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TestApiComponent } from './test-api/test-api.component';
import { ConfigComponent } from './config/config.component';
import { ConversationComponent } from './conversation/conversation.component';
const routes: Routes = [
    { path: 'login', pathMatch: 'full', component: LoginComponent },
    { path: 'test-api', pathMatch: 'full', component: TestApiComponent },
    { path: 'config', pathMatch: 'full', canActivate: [AuthGuard], component: ConfigComponent },
    { path: 'conversation', pathMatch: 'full', canActivate: [AuthGuard], component: ConversationComponent }
    /**
    {
        path: 'entities', canActivate: [AuthGuard],
        children: [
            { path: ':id', component: EntitiesComponent }
        ]
    }, */
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
