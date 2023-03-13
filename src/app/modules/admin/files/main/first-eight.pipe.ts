import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstEight'
})
export class FirstEightPipe implements PipeTransform{
    transform(pictures: string[], imagesToShow = 8) {
        return pictures.slice(0, imagesToShow);
    }
}