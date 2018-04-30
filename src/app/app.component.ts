import { ViewChild, Component } from '@angular/core';
import { LoadingController, NavController, Events, MenuController, Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HttpHeaders } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') Nav: NavController;
  rootPage: any = TabsPage;
  public users = [];
  public name = '';
  public email = '';
  public picture = '';
  public loader: any;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public storage: Storage,
    public googleplus: GooglePlus,
    public events: Events,
    public loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    events.subscribe('user:login', (users, time) => {
      this.users = users;
      this.name = users[0].first_name;
      this.email = users[0].email;
      this.picture = users[0].image_url;
    });
    events.subscribe('user:logingoogle', (res, time) => {
      this.users = res;
      this.name = res[0].displayName;
      this.email = res[0].email;
      this.picture = res[0].imageUrl;
    });
    if (this.storage.length) {
      this.storage.get('users').then((val) => {
        this.users = val;
        if (this.users) {
          this.name = val.name;
          this.email = val.email;
          this.picture = val.picture;
        }
      });
    }
  }
  doLogin() {
    this.rootPage = LoginPage;
    this.menuCtrl.close();
  }
  doLogout() {
    this.users = [];
    this.name = '';
    this.email = '';
    this.picture = '';
    this.storage.remove('users')
    this.rootPage = TabsPage;
  }
  doHome() {
    this.rootPage = TabsPage;
    this.menuCtrl.close();
  }
  doGoToPage(pageName) {
    this.rootPage = pageName;
    this.menuCtrl.close();
  };

}

