import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { AppComponent } from './app.component';
import { HeaderOuterComponent } from './component/common/header-outer/header-outer.component';
import { HeaderInnerComponent } from './component/common/header-inner/header-inner.component';
import { LayoutComponent } from './component/common/layout/layout.component';
import { LayoutInnerComponent } from './component/common/layout-inner/layout-inner.component';
import { FooterComponent } from './component/common/footer/footer.component';
import { SidebarComponent } from './component/common/sidebar/sidebar.component';
import { HomeComponent } from './component/pages/home/home.component';
import { NdhsMapComponent } from './component/pages/ndhs/ndhs-map/ndhs-map.component';
import { FilterAreaComponent } from './component/common/filter-area/filter-area.component';
import { NdhsCountriesComponent } from './component/pages/ndhs/countries/ndhs-countries/ndhs-countries.component';
import { ViewDataComponent } from './component/pages/ndhs/countries/ndhs-countries/countries-data/view-data/view-data.component';
import { PresentDevelopmentComponent } from './component/pages/ndhs/countries/ndhs-countries/countries-data/present-development/present-development.component';
import { ProspectiveDevelopmentComponent } from './component/pages/ndhs/countries/ndhs-countries/countries-data/prospective-development/prospective-development.component';
import { ComparativeResultComponent } from './component/pages/ndhs/comparative-result/comparative-result.component';
import { ComparativeResultDetailComponent } from './component/pages/ndhs/comparative-result-detail/comparative-result-detail.component';
import { ComparativeOverviewComponent } from './component/pages/ndhs/comparative-overview/comparative-overview.component';
import { PieChartCardComponent } from './component/pages/ndhs/countries/ndhs-countries/countries-data/pie-chart-card/pie-chart-card.component';
import { DataModalComponent } from './component/pages/ndhs/countries/ndhs-countries/countries-data/data-modal/data-modal.component';
import { MatRippleModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
    declarations: [
        AppComponent,
        HeaderOuterComponent,
        HeaderInnerComponent,
        LayoutComponent,
        HomeComponent,
        FooterComponent,
        SidebarComponent,
        NdhsMapComponent,
        LayoutInnerComponent,
        FilterAreaComponent,
        NdhsCountriesComponent,
        ViewDataComponent,
        PresentDevelopmentComponent,
        ProspectiveDevelopmentComponent,
        ComparativeResultComponent,
        ComparativeResultDetailComponent,
        ComparativeOverviewComponent,
        PieChartCardComponent,
        DataModalComponent
    ],
    imports: [
        MatButtonModule,
        MatFormFieldModule,

        MatRippleModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatTabsModule,
        MatSidenavModule,
        MatTooltipModule,
        MatSelectModule,
        MatExpansionModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
        Ng2GoogleChartsModule,
        MatDialogModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
