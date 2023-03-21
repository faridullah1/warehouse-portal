import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imageName'
})
export class ImageNamePipe implements PipeTransform{
    transform(url: string) {
        if (url) return url.substring(url.lastIndexOf('/') + 1).split('.')[0];
        return null;
    }
}