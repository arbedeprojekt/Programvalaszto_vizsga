import { Component, Input, OnInit } from '@angular/core';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-toast-messages',
  templateUrl: './toast-messages.component.html',
  styleUrl: './toast-messages.component.css'
})
export class ToastMessagesComponent {

  constructor(public base: BaseService) {}

}
