import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface InvestmentResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    balance: number;
    interestEarned: number;
    totalContributions: number;
  }>;
}

interface InvestmentScenario {
  name: string;
  initialInvestment: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  compoundingFrequency: number;
}

@Component({
    selector: 'app-investment-calculator',
    imports: [FormsModule, CurrencyPipe, DecimalPipe, NgClass],
    templateUrl: './investment-calculator.component.html',
    styleUrl: './investment-calculator.component.scss'
})
export class InvestmentCalculatorComponent {
  // Input signals
  initialInvestment = signal(10000);
  monthlyContribution = signal(1000);
  annualRate = signal(8);
  years = signal(10);
  compoundingFrequency = signal(12); // Monthly

  // UI state
  calculationType = signal<'simple' | 'compound' | 'sip'>('compound');
  activeTab = signal<'calculator' | 'scenarios' | 'breakdown'>('calculator');

  // Computed results
  result = computed(() => {
    return this.calculateInvestment();
  });

  // Predefined scenarios
  scenarios = signal<InvestmentScenario[]>([
    {
      name: 'Conservative',
      initialInvestment: 50000,
      monthlyContribution: 5000,
      annualRate: 6,
      years: 10,
      compoundingFrequency: 12
    },
    {
      name: 'Moderate',
      initialInvestment: 100000,
      monthlyContribution: 10000,
      annualRate: 8,
      years: 15,
      compoundingFrequency: 12
    },
    {
      name: 'Aggressive',
      initialInvestment: 200000,
      monthlyContribution: 20000,
      annualRate: 12,
      years: 20,
      compoundingFrequency: 12
    }
  ]);

  // Auto-calculate when inputs change
  constructor() {
    effect(() => {
      // Trigger recalculation when any input changes
      this.initialInvestment();
      this.monthlyContribution();
      this.annualRate();
      this.years();
      this.compoundingFrequency();
      this.calculationType();
    });
  }

  calculateInvestment(): InvestmentResult {
    const principal = this.initialInvestment();
    const monthlyAdd = this.monthlyContribution();
    const rate = this.annualRate() / 100;
    const time = this.years();
    const frequency = this.compoundingFrequency();

    const monthlyBreakdown: Array<{
      month: number;
      balance: number;
      interestEarned: number;
      totalContributions: number;
    }> = [];

    let balance = principal;
    let totalContributions = principal;
    let totalInterest = 0;

    if (this.calculationType() === 'simple') {
      // Simple interest
      const interest = principal * rate * time;
      balance = principal + interest;
      totalInterest = interest;
    } else if (this.calculationType() === 'compound') {
      // Compound interest with monthly contributions
      const monthlyRate = rate / frequency;
      const totalMonths = time * frequency;

      for (let month = 1; month <= totalMonths; month++) {
        const interestEarned = balance * monthlyRate;
        balance += interestEarned + monthlyAdd;
        totalContributions += monthlyAdd;
        totalInterest += interestEarned;

        if (month % 3 === 0) { // Quarterly breakdown for better performance
          monthlyBreakdown.push({
            month,
            balance,
            interestEarned: totalInterest,
            totalContributions
          });
        }
      }
    } else {
      // SIP calculation
      const monthlyRate = rate / 12;
      const totalMonths = time * 12;

      for (let month = 1; month <= totalMonths; month++) {
        if (month === 1) {
          balance = principal + monthlyAdd;
          totalContributions = principal + monthlyAdd;
        } else {
          const interestEarned = balance * monthlyRate;
          balance += interestEarned + monthlyAdd;
          totalContributions += monthlyAdd;
          totalInterest += interestEarned;
        }

        if (month % 3 === 0) { // Quarterly breakdown
          monthlyBreakdown.push({
            month,
            balance,
            interestEarned: totalInterest,
            totalContributions
          });
        }
      }
    }

    return {
      futureValue: balance,
      totalContributions,
      totalInterest: balance - totalContributions,
      monthlyBreakdown
    };
  }

  setCalculationType(type: 'simple' | 'compound' | 'sip') {
    this.calculationType.set(type);
  }

  setActiveTab(tab: 'calculator' | 'scenarios' | 'breakdown') {
    this.activeTab.set(tab);
  }

  loadScenario(scenario: InvestmentScenario) {
    this.initialInvestment.set(scenario.initialInvestment);
    this.monthlyContribution.set(scenario.monthlyContribution);
    this.annualRate.set(scenario.annualRate);
    this.years.set(scenario.years);
    this.compoundingFrequency.set(scenario.compoundingFrequency);
    this.activeTab.set('calculator');
  }

  getGrowthPercentage(): number {
    const result = this.result();
    if (result.totalContributions === 0) return 0;
    return ((result.futureValue - result.totalContributions) / result.totalContributions) * 100;
  }
}
