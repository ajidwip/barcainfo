import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-fanspage',
  templateUrl: 'fanspage.html',
})
export class FanspagePage {
  public FansPageData = [];
  halaman = 0;
  public loader: any;
  fanspage = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public admob: AdMobPro,
    private iab: InAppBrowser,
    public api: ApiProvider) {
    this.fanspage = 'facebook';
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetFansPage();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetFansPage() {
    this.api.get('table/z_fanspage', { params: { limit: 100, sort: "name" + " ASC " } }).subscribe(val => {
      this.FansPageData = val['data'];
    });

  }
  doRefresh(refresher) {
    this.api.get('table/z_fanspage', { params: { limit: 100, sort: "date" + " ASC " } }).subscribe(val => {
      this.FansPageData = val['data'];
      refresher.complete();
    });
  }
  doOpenPage(fans) {
    const browser = this.iab.create(fans.page_url, '_blank', 'location=no');
  }
  ionViewDidEnter() {
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admob.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: false,
      autoShow: true
    })
  }


}
