import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {

  tags: any

  //Jelszó láthatósága
  eyeIconToShowPassword=false
  toSwitchPasswordInputTypeDynamic=['password','text']

  user: any


  //EZ A TELJES KOMPONENS FEJLESZTÉS ALATT, NE TÖRÖLD!!


  constructor(private http: HttpClient, localStorage: LocalStorageService, private base: BaseService, private auth:AuthService, private router:Router) {
    this.getTags()
    this.base.downloadAllTags()
    this.auth.getLoggedUser().subscribe(
      (u) => {
        this.user = u
        //console.log("user", u.name)
      }
    )
  }

  visiblePassword(){
    return this.toSwitchPasswordInputTypeDynamic[Number(this.eyeIconToShowPassword)]
  }

  updatePasswordChanges() {
    //ide kell bekötni a jelszó módosítás mentését
  }

  getTags() {
    this.base.tagsSub.subscribe(
      (tag: any) => {
        this.tags = tag.data
        //console.log("res a tag componensből: ", tag)
      }
    )
  }


  //TEENDŐK:
  // be kell kötni az ÉRDEKLŐDÉSI KÖR MEGADÁSÁHOZ a BE-et
          //hogy a BE elmentse a kiválasztott adatokat --> szerintem itt is update lesz, nem lesz külön új létrehozás és módosítás
          //hogy a BE visszaadja a már megadott beállítást (tehát, ha a felhasználó megnyitja a beállításait, azok a checkboxok kijelöltek legyenek, amiket korábban beállított)


  //be kell kötni a JELSZÓ MÓDOSÍTÁSHOZ a BE-et
          //hogy a BE módosítsa a régi jelszót az újra
          //ellenőrizni kell, hogy működött a mentés és be lehet lépni normálisan!!!

          //hibaüzenetek/felugrók:
                    //hibaüzenet, ha nincs egyezés az addatbázisban a régi jelszóval!
                    //felugró, ha nem sikerült a mentés valamiért
                    //felugró, ha sikerült a mentés


}
