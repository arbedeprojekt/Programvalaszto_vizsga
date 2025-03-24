import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() title: string = 'Alapértelmezett cím';
  @Input() content: string = 'Alapértelmezett tartalom';
  @Input() closeButtonText: string = 'Bezárás';
  @Input() actionButtonText: string = 'OK';
  @Input() actionButtonClass: string = 'btn-primary'; // Bootstrap osztályok: btn-danger, btn-success stb.

  @Output() action = new EventEmitter<void>();

  onActionClick() {
    this.action.emit();
  }

}
