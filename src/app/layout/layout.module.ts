import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { ClassicLayoutModule } from 'app/layout/layouts/vertical/classic/classic.module';
import { ClassyLayoutModule } from 'app/layout/layouts/vertical/classy/classy.module';
import { SettingsModule } from 'app/layout/common/settings/settings.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialLayoutModule } from './layouts/horizontal/material/material.module';

const layoutModules = [
	// Empty Layout
	EmptyLayoutModule,

    // Horizontal navigation
	MaterialLayoutModule,

    // Vertical navigation
    ClassicLayoutModule,
    ClassyLayoutModule
];

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports     : [
        SharedModule,
        SettingsModule,
        ...layoutModules
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule
{
}
