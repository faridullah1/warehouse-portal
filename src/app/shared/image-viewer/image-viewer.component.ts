import { MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';
import panzoom, { PanZoom } from 'panzoom';
import { MaterialModule } from 'app/modules/material/material.module';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';


@Component({
  selector: 'app-table',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  standalone: true,
  imports: [DialogHeaderComponent, MaterialModule]
})
export class ImageViewerComponent implements AfterViewInit, OnInit {
    @ViewChild('scene') scene: ElementRef<HTMLImageElement>;

    imageSrc: string = '';
	currentPanZoom: PanZoom;
    initialImageWidth: number;
    dialogTitle: string;

    constructor(private dialogRef: MatDialogRef<DialogHeaderComponent>,
                private translocoService: TranslocoService)
    { }

    ngOnInit(): void {
        this.translocoService.selectTranslate('Image_Viewer').pipe(take(1)).subscribe((translation: string) => {
			this.dialogTitle = translation;
		});
    }

	ngAfterViewInit(): void {
        this.initialImageWidth = this.scene.nativeElement.width;
        this.initPanzoom();
    }

	initPanzoom(): void {
        this.currentPanZoom = panzoom(this.scene.nativeElement, {
            // beforeWheel: (e) => {
            //     // allow wheel-zoom only if altKey is down. Otherwise - ignore
            //     const shouldIgnore = !e.altKey;
            //     return shouldIgnore;
            // }
        });

        /*
            Minimum Width upto which current image can be zoomed;
            if image width is less than that then ZOOMING WILL BE PAUSED
        */
        // this.currentPanZoom.on('zoom', (ev: any) => {
        //     if (this.isImageTooSmall()) {
        //         ev.pause();
        //     }
        // });
    }

	isImageTooSmall(): boolean {
        const maxScrollableWidth = this.initialImageWidth < 100 ? this.initialImageWidth : 100;
        const currentImageWidth = this.scene.nativeElement.getBoundingClientRect().width;

        return currentImageWidth < maxScrollableWidth;
    }

	onDialogClose(): void {
		this.dialogRef.close();
	}

	onZoom(type: 'in' | 'out'): void {
		if (type === 'in') {
			if (this.currentPanZoom.isPaused()) {
				this.currentPanZoom.resume();
			}
            this.currentPanZoom.smoothZoom(0, 0, 1.5);
		}
		else {
			if (this.isImageTooSmall()) {
				this.currentPanZoom.pause();
				return;
			}

			this.currentPanZoom.smoothZoom(0, 0, 0.5);
		}
	}
}
