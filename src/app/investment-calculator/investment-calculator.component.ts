import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investment-calculator',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './investment-calculator.component.html',
  styleUrl: './investment-calculator.component.scss',
})
export class InvestmentCalculatorComponent {
  initialInvestment = signal(0);
  annualRate = signal(0);
  years = signal(0);
  futureValue = signal<number | null>(null);

  calculateInvestment() {
    const rate = this.annualRate() / 100;
    this.futureValue.set(this.initialInvestment() * Math.pow(1 + rate, this.years()));
  }
}