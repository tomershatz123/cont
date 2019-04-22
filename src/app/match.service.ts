import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Vessel } from './vessel';
import { Telemetry } from './telemetry';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  isInitialized = false;
  events: Telemetry[] = [];
  vessels: Vessel[] = [];
  matches = [];
  minutes15 = 15 * 60 * 1000;
  matchesObservable = null;
  constructor() { }

  init(telemetries: Telemetry[], vessels: Vessel[]) {
    this.events = this.filterValidEvents(telemetries);
    this.vessels = vessels;
    this.matches = [];
    this.isInitialized = true;
    this.findMatchings();
  }

  findMatchings() {
    this.matches = [];
    if (this.vessels && this.events) {
        const results = [];
        this.events.forEach(event => {
            let vesselMatch: Vessel = null;
            this.vessels.forEach(vessel => {
                const match = this.doesMatch(event, vessel);
                if (match) {
                    vesselMatch = vessel;
                }
            });
            if (vesselMatch) {
                event.mmsi = vesselMatch.mmsi;
                event.time = vesselMatch.time;
                results.push(event);
            }
        });
        this.matches = results;
        this.createMatchesObservable();
    }
  }

  createMatchesObservable() {
    if (this.matches) {
      this.matchesObservable = new Observable(observer => {
        setTimeout(() => {
            observer.next(this.matches);
        }, 500);
      });
    }
  }

  getMatches() {
    return this.matchesObservable;
  }

  doesMatch(event: Telemetry, vessel: Vessel) {
    let match = false;
    if (event && vessel) {
        match = (event.longitude === vessel.longitude && event.latitude === vessel.latitude);
        if (match) {
            const diff1 = Math.abs(vessel.time.valueOf() - event.received.valueOf());
            match = (diff1 < this.minutes15);
        }
    }
    return match;
  }

  filterValidEvents(events: Telemetry[]) {
    const results: Telemetry[] = events.filter(evt => (evt.gps && evt.gps.endsWith(' Valid')));
    return results;
  }

  clear() {
    this.isInitialized = false;
    this.events = [];
    this.vessels = [];
    this.matches = [];
  }
}
