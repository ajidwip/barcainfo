import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})

export class NewsPage {
  public NewsAllactive = [];
  public NewsTop = [];
  public title = '';
  public image = '';
  halaman = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider) {
    this.doGetNewsAllActive();
  }
  doGetNewsAllActive() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.api.get('table/z_content_news', { params: { limit: 10, offset: offset, filter: "status='OPEN'", sort: "id" + " DESC " } })
          .subscribe(val => {
            this.NewsTop = val['data'];
            this.title = this.NewsTop[0].title;
            this.image = this.NewsTop[0].image_url;
            this.halaman++;
            this.api.get('table/z_content_news', { params: { filter: "status='OPEN' AND image_url!=" + "'" + this.image + "'", sort: "id" + " DESC " } })
              .subscribe(val => {
                let data = val['data'];
                for (let i = 0; i < data.length; i++) {
                  this.NewsAllactive.push(data[i]);
                }
                if (data.length == 0) {
                  this.halaman = -1
                }
                resolve();
              });
          });

      }
    })

  }
  doInfinite(infiniteScroll) {
    this.doGetNewsAllActive().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefresh(refresher) {
    this.api.get('table/z_content_news', { params: { limit: 10, filter: "status='OPEN'", sort: "id" + " DESC " } })
      .subscribe(val => {
        this.NewsTop = val['data'];
        this.title = this.NewsTop[0].title;
        this.image = this.NewsTop[0].image_url;
        this.halaman++;
        this.api.get('table/z_content_news', { params: { filter: "status='OPEN' AND image_url!=" + "'" + this.image + "'", sort: "id" + " DESC " } })
          .subscribe(val => {
            this.NewsAllactive = val['data']
            refresher.complete();
          });
      });
  }

}
