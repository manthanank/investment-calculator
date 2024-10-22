import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvestmentCalculatorComponent } from './investment-calculator/investment-calculator.component';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InvestmentCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'investment-calculator';

  meta = inject(Meta);

  constructor() {
    this.meta.addTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    });
    this.meta.addTag({
      name: 'icon',
      content: 'image/x-icon',
      href: 'favicon.ico',
    });
    this.meta.addTag({
      name: 'canonical',
      content: 'https://investment-calculator-app-manthanank.vercel.app/',
    });
    this.meta.addTag({ property: 'og:title', content: 'Investment Calculator App' });
    this.meta.addTag({ name: 'author', content: 'Manthan Ankolekar' });
    this.meta.addTag({
      name: 'keywords',
      content: 'angular',
    });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.meta.addTag({
      property: 'og:description',
      content:
        'A simple investment calculator app to calculate the future value of your investment.',
    });
    this.meta.addTag({
      property: 'og:image',
      content:
        'https://investment-calculator-app-manthanank.vercel.app/image.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: 'https://investment-calculator-app-manthanank.vercel.app/',
    });
  }
}
