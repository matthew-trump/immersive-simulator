import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { ConfigStateReducer } from './config-state.reducer';
import { ProjectReducer } from './project.reducer';
import { ImmersiveSimulatorMessageReducer } from './immersive-simulator-message.reducer';

import { SafePipe } from './safe.pipe';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ConfigComponent } from './config/config.component';
import { TestApiComponent } from './test-api/test-api.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ConversationOutputComponent } from './conversation-output/conversation-output.component';
import { ConversationOutputImmersiveItemComponent } from './conversation-output-immersive-item/conversation-output-immersive-item.component';
import { ConversationOutputSimpleItemComponent } from './conversation-output-simple-item/conversation-output-simple-item.component';
import { SsmlFormattedComponent } from './ssml-formatted/ssml-formatted.component';
import { ConversationOutputBasicCardItemComponent } from './conversation-output-basic-card-item/conversation-output-basic-card-item.component';
import { SimpleSimulatorComponent } from './simple-simulator/simple-simulator.component';
import { ImmersiveSimulatorComponent } from './immersive-simulator/immersive-simulator.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfigComponent,
    TestApiComponent,
    ConversationComponent,
    ConversationOutputComponent,
    ConversationOutputImmersiveItemComponent,
    ConversationOutputSimpleItemComponent,
    SsmlFormattedComponent,
    ConversationOutputBasicCardItemComponent,
    SimpleSimulatorComponent,
    ImmersiveSimulatorComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ config: ConfigStateReducer, project: ProjectReducer, immersiveSimulator: ImmersiveSimulatorMessageReducer }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSlideToggleModule
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
