package com.guidehbg;

import android.app.Application;

import com.example.beaconmodule.BeaconPackage;
import com.facebook.react.ReactApplication;
import com.apsl.versionnumber.RNVersionNumberPackage;
import cl.json.RNSharePackage;
import com.jimmydaddy.imagemarker.ImageMarkerPackage;
import com.horcrux.svg.SvgPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnative.photoview.PhotoViewPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.mediamodule.MediaControlPackage;
import com.mediamodule.MediaPackage;
import com.notificationmodule.NotificationPackage;
import com.settingsmodule.SettingsPackage;

import com.fullscreenvideomodule.FullScreenVideoModule;

import java.util.Arrays;
import java.util.List;

import cl.json.ShareApplication;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new RNVersionNumberPackage(), new RNSharePackage(), new ImageMarkerPackage(),
                    new SvgPackage(), new RNFirebasePackage(), new RNFirebaseAnalyticsPackage(), new PhotoViewPackage(),
                    new BeaconPackage(), new VectorIconsPackage(), new MapsPackage(), new ReactVideoPackage(),
                    new RNFetchBlobPackage(), new NotificationPackage(), new SettingsPackage(), new MediaPackage(),
                    new MediaControlPackage(), new AppPackages());
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public String getFileProviderAuthority() {
        return "com.guidehbg.provider";
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
