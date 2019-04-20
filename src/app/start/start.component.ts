import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'ts-xlsx';

import { Vessel } from '../vessel';
import { Telemetry } from '../telemetry';
import { MatchService } from '../match.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  vesselsLoaded = false;
  telemetriesLoaded = false;
  vessels: Vessel[] = [];
  telemetries: Telemetry[] = [];
  arrayBuffer: any;
  file: File;

  constructor(private router: Router, private matchService: MatchService) { }

  ngOnInit() {
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    this.upload();
  }

  upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();
        for (let i = 0; i < data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, {type: 'binary', cellDates: true});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        // console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
        const mydata = XLSX.utils.sheet_to_json(worksheet, {raw: true});
        this.handleContent(mydata);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  handleContent(mydata: any[]) {
    if (mydata && mydata.length > 0) {
      if (mydata[0].hasOwnProperty('Vessel (MMSI)')) {
        this.vesselsLoaded = true;
        this.loadVessels(mydata);
      } else if (mydata[0].hasOwnProperty('Received')) {
        this.telemetriesLoaded = true;
        this.loadTelemetries(mydata);
      }
    }
  }

  loadTelemetries(mydata) {
    const tlmtry: Telemetry[] = [];
    mydata.forEach(item => {
      const tlm = new Telemetry(item['Received'], item['Last location'], item['Reason'],
        item['GPS'], item['Longitude'], item['Latitude'], item['Address']);
      tlmtry.push(tlm);
    });
    this.telemetries = tlmtry;
  }

  loadVessels(mydata: any[]) {
    const vesls: Vessel[] = [];
    mydata.forEach(item => {
      const vsl = new Vessel(item['Vessel (MMSI)'], item['Time'], item['Longitude'], item['Latitude']);
      vesls.push(vsl);
    });
    this.vessels = vesls;
  }

  onStart() {
    if (this.telemetries && this.vessels) {
      this.matchService.init(this.telemetries, this.vessels);
      this.router.navigate(['/results']);
    }
  }

}
