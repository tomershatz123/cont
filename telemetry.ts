export class Telemetry {
    mmsi: number;
    time: Date;
    constructor(public received: Date, public lastLocation: Date, public reason: string, public gps: string,
        public longitude: number, public latitude: number, public address: string) {}
}
