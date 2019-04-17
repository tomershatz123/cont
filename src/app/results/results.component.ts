import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatchService } from '../match.service';
import { Telemetry } from '../telemetry';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Telemetry[] = [];
  matchesObservable = null;
  constructor(private router: Router, private matchService: MatchService) { }

  ngOnInit() {
    this.matchesObservable = this.matchService.getMatches();
  }

  onClear() {
    this.matchService.clear();
    this.router.navigate(['/start']);
  }
}
