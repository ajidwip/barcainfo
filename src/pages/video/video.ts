import { Component } from '@angular/core';
import { App, LoadingController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AdMobPro } from '@ionic-native/admob-pro';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  public VideosAllactive = [];
  halaman = 0;
  public loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public app: App,
    public platform: Platform,
    public screenOrientation: ScreenOrientation,
    private iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    private admobvideo: AdMobPro) {
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.loader.present();
    this.doGetVideosAllActive();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  doGetVideosAllActive() {
    return new Promise(resolve => {
      let offset = 5 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get('table/z_content_videos', { params: { limit: 5, offset: offset, filter: "status='OPEN'", sort: "id" + " DESC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.VideosAllactive.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })

  }
  doInfinite(infiniteScroll) {
    this.doGetVideosAllActive().then(response => {
      infiniteScroll.complete();

    })
  }
  doRefresh(refresher) {
    /*this.api.get("table/z_content_videos", { params: { limit: 5, filter: "status='OPEN'", sort: "id" + " DESC " } }).subscribe(val => {
      this.VideosAllactive = val['data'];
      refresher.complete();
    });*/
    this.doGetVideosAllActive().then(response => {
      refresher.complete();
    })
  }
  doOpenVideo(video) {
    this.app.getRootNav().push('PlayerPage', {
      url: video.video_url
    })
  }
  ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admobvideo.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: false,
      autoShow: true,
      position: this.admobvideo.AD_POSITION.BOTTOM_CENTER,
    });
    this.admobvideo.prepareInterstitial({
      adId: admobid.interstitial,
      isTesting: false,
      autoShow: false
    })
  }
  ionViewWillLeave() {
    this.admobvideo.removeBanner();
  }

}
