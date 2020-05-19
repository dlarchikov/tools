import {ModuleWithProviders, NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

import {
    NbAccordionModule, NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule,
    NbDatepickerModule,
    NbDialogModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbPopoverModule, NbProgressBarModule,
    NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbSidebarModule, NbSpinnerModule,
    NbStepperModule,
    NbTabsetModule, NbThemeModule, NbToastrModule, NbUserModule, NbWindowModule,
} from '@nebular/theme'

import {NbSecurityModule} from '@nebular/security'

import {FooterComponent, HeaderComponent} from './components'
import {CapitalizePipe, EvaIconsPipe, NumberWithCommasPipe, PluralPipe, RoundPipe, TimingPipe} from './pipes'
import {SampleLayoutComponent} from './layouts'
import {DEFAULT_THEME} from './styles/theme.default'
import {COSMIC_THEME} from './styles/theme.cosmic'
import {CORPORATE_THEME} from './styles/theme.corporate'

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule]

const NB_MODULES = [
    NbCardModule,
    NbLayoutModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSidebarModule,
    NbCheckboxModule,
    NbPopoverModule,
    NgbModule,
    NbSecurityModule, // *nbIsGranted directive,
    NbProgressBarModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbInputModule,
    NbAccordionModule,
    NbDatepickerModule,
    NbDialogModule,
    NbWindowModule,
    NbAlertModule,
    NbSpinnerModule,
    NbRadioModule,
    NbSelectModule,
]

const COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    SampleLayoutComponent,
]

const ENTRY_COMPONENTS = []

const PIPES = [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    EvaIconsPipe,
]

const NB_THEME_PROVIDERS = [
    ...NbThemeModule.forRoot(
        {
            name: 'default',
        },
        [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME],
    ).providers,
    ...NbSidebarModule.forRoot().providers,
    ...NbMenuModule.forRoot().providers,
    ...NbDialogModule.forRoot().providers,
    ...NbToastrModule.forRoot().providers,
]

@NgModule({
    imports: [...BASE_MODULES, ...NB_MODULES],
    exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
    declarations: [...COMPONENTS, ...PIPES],
    entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders> {
            ngModule: ThemeModule,
            providers: [...NB_THEME_PROVIDERS],
        }
    }
}
