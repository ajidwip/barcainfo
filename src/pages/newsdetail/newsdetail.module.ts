import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsdetailPage } from './newsdetail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    NewsdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsdetailPage),
    PipesModule
  ],
})
export class NewsdetailPageModule {}
