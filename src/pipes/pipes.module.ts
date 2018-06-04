import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe';
import { SafeHtmlPipe } from './safe-html/safe-html';
@NgModule({
	declarations: [SafePipe,
    SafePipe,
    SafeHtmlPipe],
	imports: [],
	exports: [SafePipe,
    SafePipe,
    SafeHtmlPipe]
})
export class PipesModule {}
