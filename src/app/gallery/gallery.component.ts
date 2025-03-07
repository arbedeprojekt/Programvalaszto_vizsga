import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {



  constructor () { }




    //Galéria működéséhez
  // document.addEventListener("DOMContentLoaded", function () {
  //   const lightboxModal = document.querySelector("#lightboxModal-bwtbclmq");
  //   const carousel = document.querySelector("#lightboxCarousel-bwtbclmq");
  //   const carouselInner = carousel.querySelector(".carousel-inner");
  //   const carouselItems = carouselInner.querySelectorAll(".carousel-item");
  //   const galleryItems = document.querySelectorAll(".gallery-preview a[data-toggle='lightbox']");

  //   galleryItems.forEach((item, index) => {
  //       item.addEventListener("click", function (event) {
  //           event.preventDefault();
            
  //           // Az összes carousel itemből eltávolítjuk az 'active' osztályt
  //           carouselItems.forEach((slide) => slide.classList.remove("active"));

  //           // Az adott indexnek megfelelő carousel item aktív lesz
  //           if (carouselItems[index]) {
  //               carouselItems[index].classList.add("active");
  //           }

  //           // Modal megnyitása
  //           lightboxModal.style.display = "block";
  //           lightboxModal.classList.add("show");
  //           document.body.classList.add("modal-open");
  //       });
  //   });

    // Modal bezárása
//     document.querySelector(".btn-close").addEventListener("click", function () {
//         lightboxModal.style.display = "none";
//         lightboxModal.classList.remove("show");
//         document.body.classList.remove("modal-open");
//     });
// };


}
