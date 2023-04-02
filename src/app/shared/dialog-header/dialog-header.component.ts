import { MaterialModule } from './../../modules/material/material.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'dialog-header',
    templateUrl: 'dialog-header.component.html',
    styleUrls: ['dialog-header.component.scss'],
    standalone: true,
    imports: [MaterialModule]
})
export class DialogHeaderComponent {
    @Input() title: string;
    @Output() signal = new EventEmitter();

    constructor() {
        this.title = null;
    }

    onCancel(): void {
        this.signal.emit();
    }
}
