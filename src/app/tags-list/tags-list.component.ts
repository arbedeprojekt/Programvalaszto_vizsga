import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.css'
})
export class TagsListComponent {

  tags: any
  groups: any

  //errorok tárolása
  newTagErrorMessage = ""
  newTagErrorBool = false
  updateTagErrorMessage=""
  updateTagErrorBool=false

  name = ""
  group = ""

  newTagSuccess = false
  erName: any
  erGroup: any
  tagModSuccess = false
  erModName: any
  erModGroup: any

  //form használatához
  newTagItem = {name: '', group: ''}

  // adatok módosításához
  editModeId: number | null = null

  constructor(private base: BaseService, public localStorage : LocalStorageService) {
    this.getTags()
    this.base.downloadAllTags()
    this.newTagErrorMessage = this.base.newTagErrorMessage
    //this.getGroups()
  }


  //tag-ek betöltése
  getTags() {
    this.base.tagsSub.subscribe(
      (tag: any) => {
        this.tags = tag.data
        console.log("res a tag componensből: ", tag)
      }
    )
  }

  updateData(data: any) {
    let body =
    {
      id:data.id,
      name:data.name,
      group:data.group
    }
    this.base.updateTagWeb(body).subscribe(
      (res:any)=>{
        console.log("res az updateDataban: ",res)
        if(res.error){
          console.log("hiba")
          this.erModName = ""
          this.erModGroup = ""
          this.erModName = res.error["name"]
          this.erModGroup = res.error["group"]
          //this.updateTagErrorMessage = res.error.name
          //this.updateTagErrorBool = true
          this.base.show(res.message || "A címke módosítása sikertelen!", "danger")
        }
        else{
          //console.log("siker")
          //this.updateTagErrorMessage = ""
          //this.updateTagErrorBool = false
          this.tagModSuccess = true
          this.editModeId = null
          this.base.show(res.message || "Sikeres módosítás!", "success")
          this.base.downloadAllTags()
        }
      }
    )
    console.log("data" + data)
  }

  deleteData(data: any) {
    const confirmDelete = window.confirm('Biztosan törlöd ezt a címkét?')

    if (confirmDelete) {
      let body ={
        id:data.id
      }
      this.base.deleteTagWeb(body).subscribe(
        (res:any)=>{
          if(res.error) {
            this.base.show(res.message || "A címke törlése sikertelen!", "danger")
          }
          else {
          //console.log("body tartalma: ",body)
          //console.log("valami történik: ",res)
          this.base.show(res.message || "A címke törlése sikeres!", "success")
          this.base.downloadAllTags()
          }
        }
      )
    }
  }

  newData() {
    this.base.newTagWeb(this.newTagItem).subscribe(
      {
        next: (res: any) => {

          //this.newTagErrorBool = false
          //this.newTagErrorMessage = ""

          if (res.success == true) {
            console.log("res", res)
            console.log(res.success)
            //this.newTagErrorBool = res.success
            this.newTagSuccess = true
            this.base.show(res.message || "Sikeres rögzítés!", "success")
            this.base.downloadAllTags()
          }
          else {
            console.log("res", res)
            this.erName = ""
            this.erGroup = ""
            this.erName = res.error["name"]
            this.erGroup = res.error["group"]
            //this.newTagErrorMessage = res.error.name
            //this.newTagErrorBool = res.success
            this.base.show(res.message || "A címke rögzítése sikertelen!", "danger")
          }
        },
        error: (error: any) => {
          //this.newTagErrorBool = true
          //this.newTagErrorMessage = error.error.name
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      }
    )
    this.newTagItem = {name: '', group: ''}
  }

  editRow(tag: any) {
    this.editModeId = tag.id // A sor szerkesztésének megkezdése
  }

  cancelEdit() {
    this.editModeId = null
    this.base.downloadAllTags()
  }



}
