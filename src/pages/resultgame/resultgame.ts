import { Component } from '@angular/core';
import { App, AlertController, LoadingController, IonicPage, NavController, NavParams, Refresher, Alert } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UUID } from 'angular2-uuid';
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-resultgame',
  templateUrl: 'resultgame.html',
})
export class ResultgamePage {
  public loader: any;
  public schedule = [];
  public datecurrent: any;
  public game:any;
  public idgame:any;
  public results = [];
  public resultshome = [];
  public resultsaway = [];
  public stats = [];
  public lineups = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public api: ApiProvider,
    public admob: AdMobPro,
    public storage: Storage,
    public app: App,
    private http: HttpClient) {
    this.schedule = this.navParams.get('ScheduleAllActive');
    this.idgame = this.navParams.get('idgame');
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
      content: 'Loading Content...'
    });
    this.game = 'result'
    this.loader.present();
    this.doGetResults();
    this.doGetResultsHome();
    this.doGetResultsAway();
    this.doGetStats();
    this.doGetLineups();
  }
  ngAfterViewInit() {
    this.loader.dismiss();
  }
  ionViewDidEnter() {
    this.datecurrent = moment().format();
    var admobid = {
      banner: 'ca-app-pub-7488223921090533/9446361096',
      interstitial: 'ca-app-pub-7488223921090533/9226869245'
    };

    this.admob.createBanner({
      adSize: 'SMART_BANNER',
      adId: admobid.banner,
      isTesting: false,
      autoShow: true,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
    });
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
  doGetResultsHome() {
    this.api.get('table/z_game_results', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'" + " AND type_stats='GOAL' AND homeaway='HOME'", sort: "time_stats" + " ASC " } }).subscribe(val => {
      this.resultshome = val['data'];
    });
  }
  doGetResultsAway() {
    this.api.get('table/z_game_results', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'" + " AND type_stats='GOAL' AND homeaway='AWAY'", sort: "time_stats" + " ASC " } }).subscribe(val => {
      this.resultsaway = val['data'];
    });
  }
  doGetStats() {
    this.api.get('table/z_game_stats', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'", sort: "id" + " ASC " } }).subscribe(val => {
      this.stats = val['data'];
    });
  }
  doGetLineups() {
    this.api.get('table/z_game_lineups', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'", sort: "id" + " ASC " } }).subscribe(val => {
      this.lineups = val['data'];
    });
  }
  doGetResults() {
    this.api.get('table/z_game_results', { params: { limit: 100, filter: "id_game=" + "'" + this.idgame + "'", sort: "time_stats" + " DESC, time_stats_other DESC " } }).subscribe(val => {
      this.results = val['data'];
    });
  }
}
