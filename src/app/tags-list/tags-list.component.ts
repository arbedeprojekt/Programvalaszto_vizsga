import { Component } from '@angular/core';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.css'
})
export class TagsListComponent {

  tags: any

  newTag: any = {}


  //errorok tárolása
  newTagErrorMessage = ""
  newTagErrorBool = false
  updateTagErrorMessage=""
  updateTagErrorBool=false


  //fejléc kiíratásához
  oszlopok = ["name"]
  tagNameColumn = ["name"]

  constructor(private base: BaseService,) {
    this.getTags()
    this.base.downloadAllTags()
    this.newTagErrorMessage = this.base.newTagErrorMessage
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
      name:data.name
    }
    this.base.updateTagWeb(body).subscribe(
      (res:any)=>{
        console.log("res az updateDataban: ",res)
        if(res.error){
          console.log("hiba")
          this.updateTagErrorMessage = res.error.name
          this.updateTagErrorBool = true

        }
        else{
          console.log("siker")
          this.updateTagErrorMessage = ""
          this.updateTagErrorBool = false
        }
      }
    )
    console.log("data" + data);
  }

  deleteData(data: any) {

    let body ={

      id:data.id
    }
    this.base.deleteTagWeb(body).subscribe(
      (res:any)=>{
        console.log("body tartalma: ",body)
        console.log("valami történik: ",res)
        this.base.downloadAllTags();
      }
    )

  }

  newData() {
    this.base.newTagWeb(this.newTag).subscribe(
      {
        next: (res: any) => {

          this.newTagErrorBool = false
          this.newTagErrorMessage = ""
          if (res.success == true) {
            console.log("res", res)

            console.log(res.success)
            this.newTagErrorBool = res.success
            this.base.downloadAllTags()

          }

          else {
            console.log("res", res)

            this.newTagErrorMessage = res.error.name
            this.newTagErrorBool = res.success
          }
        },
        error: (error: any) => {
          this.newTagErrorBool = true

          this.newTagErrorMessage = error.error.name

        }
      }
    )
    this.newTag = {}

  }

}
