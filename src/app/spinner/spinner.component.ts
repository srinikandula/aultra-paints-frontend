import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  loading: boolean = false;

  constructor(private loaderService: SpinnerService) {
    this.loaderService.isLoading.subscribe((v: any) => {
      // console.log(v);
      this.loading = v;
    });
  }

  ngOnInit(): void {}
}
