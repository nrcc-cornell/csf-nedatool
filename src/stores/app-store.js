///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming New York State / Northeast Drought Atlas
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { observable, computed, action } from 'mobx';
import jsonp from 'jsonp';

export class RefStore {
    // Data Sources and References -------------------------------------------------------
    // For Components: InfoButton & InfoWindow -------------------------------------------
    @observable info_status=false;
    @action updatePopupStatus = () => { this.info_status = !this.info_status };
    @computed get popupStatus() { return this.info_status };
    info_content = 
        <div>
          <h2>Data Sources</h2>
          <div>This is a test.</div>
        </div>;
}

export class AppStore {

    // Everything Else -------------------------------------------------------------------

    @observable year;
    @observable month;
    @observable county='';
    @observable yearStart='1950';
    @observable yearEnd;
    @observable monthEnd;
    @observable selectedCountyData = [];
    @observable countyData = {};
    //@observable countyGeojson = {};
    @observable countyGeojson = null;
    @observable loaderLastDate=false;
    @observable loaderCountyData=false;
    @observable loaderCountyGeojson=false;
    @observable loaderImageOverlay=false;
    monthPickerLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthNumberLabels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    @action updateLoaderImageOverlay = (l) => {
            this.loaderImageOverlay = l;
        }

    @action updateLoaderLastDate = (l) => {
            this.loaderLastDate = l;
        }

    @action updateLoaderCountyData = (l) => {
            this.loaderCountyData = l;
        }

    @action updateLoaderCountyGeojson = (l) => {
            this.loaderCountyGeojson = l;
        }

    @action changeCalendarValues = (y,m) => {
            this.year = y;
            this.month = m;
        }

    @action changeCounty = (c) => {
            this.county = c;
            this.updateSelectedCountyData(this.countyData[c])
        }

    @action updateSelectedYear = (y) => {
            if (this.getLoaderImageOverlay === false) {
                this.updateLoaderImageOverlay(true);
            }
            let yearValue = y.value;
            this.year = yearValue;
            if (this.getYear===this.yearEnd) {
                this.updateSelectedMonth({ value: this.getMonth });
            }
        }

    @action updateSelectedMonth = (m) => {
            if (this.getLoaderImageOverlay === false) {
                this.updateLoaderImageOverlay(true);
            }
            let radix=10;
            let monthValue = m.value;
            if (this.year === this.yearEnd) {
                if (parseInt(monthValue,radix)<=parseInt(this.monthEnd,radix)) {
                    this.month = monthValue;
                } else {
                    this.month = this.monthEnd;
                }
            } else {
                this.month = monthValue;
            }
        }

    @action updateSelectedCountyData = (d) => {
            this.selectedCountyData = d;
        }

    @action updateCountyData = (d) => {
            this.countyData = d;
        }

    @action updateCountyGeojson = (d) => {
            this.countyGeojson = d;
        }

    @computed get getLoaderImageOverlay() {
            return this.loaderImageOverlay
        }

    @computed get getLoaderLastDate() {
            return this.loaderLastDate
        }

    @computed get getLoaderCountyData() {
            return this.loaderCountyData
        }

    @computed get getLoaderCountyGeojson() {
            return this.loaderCountyGeojson
        }

    @computed get getLoader() {
            let res = null
            if (this.getLoaderCountyData || this.getLoaderCountyGeojson || this.getLoaderLastDate || this.getLoaderImageOverlay) {
                res = true
            } else {
                res = false
            }
            return res
        }

    @computed get getMonthLabels() {
            //this.updateMonthLabels
            //return {'text': this.monthPickerLabels, 'numbers': this.monthNumberLabels }
            return {'text': this.monthPickerLabels, 'numbers': this.monthNumberLabels }
        }

    @computed get getMonthOptions() {
            let radix=10;
            const labels = this.getMonthLabels
            const monthOptions = []
            var idxMonthEnd;
            if (this.year === this.yearEnd) {
                idxMonthEnd = parseInt(this.monthEnd,radix) - 1
            } else {
                idxMonthEnd = labels.text.length - 1
            }
            for (var i = 0; i < labels.text.length; i += 1) {
                if (i <= idxMonthEnd) {
                    monthOptions.push({ value: labels.numbers[i], label: labels.text[i], clearableValue: false, disabled: false })
                } else {
                    monthOptions.push({ value: labels.numbers[i], label: labels.text[i], clearableValue: false, disabled: true })
                }
            }
            return monthOptions
        }

    @computed get getCounty() {
            return this.county
        }

    @computed get getCountyGeojson() {
            return this.countyGeojson
        }

    @computed get getYear() {
            return this.year
        }

    @computed get getMonth() {
            return this.month
        }

    @computed get yearMonthTextDisplay() {
            return (this.monthPickerLabels[this.month-1] + ' ' + this.year)
        }

    @computed get yearMonthText() {
            return (this.year+this.monthNumberLabels[this.month-1])
        }

    @computed get yearMonthObject() {
            let radix = 10;
            return {year:parseInt(this.year,radix), month:parseInt(this.month,radix)}
        }

    @computed get chartData() {
            let colorUse = '';
            const monthData = [];
            const dlen = this.selectedCountyData.length;
            for (var i=0; i<dlen; i++) {
                if (this.selectedCountyData[i] > 4) {
                    colorUse = 'rgba(29,64,64,1.0)'
                } else if ((this.selectedCountyData[i] > 3) && (this.selectedCountyData[i] <= 4)) {
                    colorUse = 'rgba(3,93,93,1.0)'
                } else if ((this.selectedCountyData[i] > 2) && (this.selectedCountyData[i] <= 3)) {
                    colorUse = 'rgba(49,143,143,1.0)'
                } else if ((this.selectedCountyData[i] > 1) && (this.selectedCountyData[i] <= 2)) {
                    colorUse = 'rgba(139,203,203,1.0)'
                } else if ((this.selectedCountyData[i] > 0) && (this.selectedCountyData[i] <= 1)) {
                    colorUse = 'rgba(196,218,244,1.0)'
                } else if ((this.selectedCountyData[i] > -1) && (this.selectedCountyData[i] <= 0)) {
                    colorUse = 'rgba(246,222,165,1.0)'
                } else if ((this.selectedCountyData[i] > -2) && (this.selectedCountyData[i] <= -1)) {
                    colorUse = 'rgba(246,178,91,1.0)'
                } else if ((this.selectedCountyData[i] > -3) && (this.selectedCountyData[i] <= -2)) {
                    colorUse = 'rgba(240,103,12,1.0)'
                } else if ((this.selectedCountyData[i] > -4) && (this.selectedCountyData[i] <= -3)) {
                    colorUse = 'rgba(121,66,10,1.0)'
                } else if (this.selectedCountyData[i] <= -4) {
                    colorUse = 'rgba(64,42,13,1.0)'
                } else {
                    colorUse = null
                }
                monthData.push({
                    x: Date.UTC(this.yearStart,i,1),
                    y: this.selectedCountyData[i],
                    color: colorUse,
                })
            }
            return monthData
        }

    @computed get chartTitle() {
            return 'PDSI : '+ this.getCounty +' County, NY'
        }

    @computed get chartConfig() {
            return {
                    credits: { enabled: false },
                    legend: { enabled: false },
                    chart: { 
                        height: 100,
                        margin: [5,5,5,10],
                    },
                    title: {
                        text: this.chartTitle,
                        style: { "color": "#0000FF", "fontSize": "12px" },
                        align: 'left',
                        x: 20,
                        y: 8,
                        floating: true,
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { year: '%Y' },
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -2 
                        },
                    },
                    yAxis: {
                        min: -6,
                        max: 6,
                        tickInterval: 2,
                        title: { text: null },
                        labels: {
                            align: 'center',
                            x: 0,
                            y: 4,
                        }
                    },
                    tooltip: {
                        pointFormat: "PDSI: {point.y:.2f}",
                        xDateFormat: "%b %Y",
                        crosshairs: [{
                            width: 1,
                            color: 'gray',
                            dashStyle: 'solid'
                        }],
                    },
                    series: [{
                        type: 'column',
                        name: 'PDSI',
                        data: this.chartData,
                        //color: '#00FF00',
                        //negativeColor: '#FF0000',
                        //color: '#318F8F',
                        //negativeColor: '#F0670C',
                    }],
                }
        }

    countyFeatureStyle(feature) {
            return {
                weight: 2,
                opacity: 0.2,
                color: 'black',
                dashArray: '3',
                fillOpacity: 0.0
            };
        }

    countyMouseoverStyle = {
            weight: 3,
            opacity: 0.7,
            color: 'black',
            dashArray: '3',
            fillOpacity: 0.0
        }

    countyMouseoutStyle = {
            weight: 2,
            opacity: 0.2,
            color: 'black',
            dashArray: '3',
            fillOpacity: 0.0
        }

    @action countyOnEachFeature = (feature, layer) => {
            layer.on({
                mouseover: () => {
                        layer.setStyle(this.countyMouseoverStyle);
                        this.changeCounty(feature.properties.name);
                    },
                mouseout: () => { layer.setStyle(this.countyMouseoutStyle) },
                click: () => {
                        layer.setStyle(this.countyMouseoverStyle);
                        this.changeCounty(feature.properties.name)
                    },
            });
        }

    @action downloadFinalYearMonth = () => {
            if (this.getLoaderLastDate === false) {
                this.updateLoaderLastDate(true);
            }
            const url = 'https://nedatool-worker.benlinux915.workers.dev/fetch-last-date'
            fetch(url)
                .then((resp) => {
                    if (resp.status === 200) {
                        return resp.json();
                    } else {
                        console.error(resp.status);
                        this.year = '2017';
                        this.month = '06';
                        this.yearEnd = '2017';
                        this.monthEnd = '06';
                        return
                    }
                })
                .then((data) => {
                    if (data) {
                        let y = data['year'];
                        let m = data['month'];
                        this.yearEnd = y;
                        this.monthEnd = m;
                        this.updateLoaderLastDate(false);
                        this.changeCalendarValues(y,m);
                    }
                    return
                });
        }

    @action downloadCountyGeojson = () => {
            if (this.getLoaderCountyGeojson === false) {
                this.updateLoaderCountyGeojson(true);
            }
            
            fetch('https://nedatool-worker.benlinux915.workers.dev/fetch-county-geojson')
                .then(res => res.json())
                .then(data => {
                    this.updateCountyGeojson(data);
                    if (this.getLoaderCountyGeojson === true) {
                        this.updateLoaderCountyGeojson(false);
                    }
                });
        }

    @action downloadCountyData = () => {
            if (this.getLoaderCountyData === false) {
                this.updateLoaderCountyData(true);
            }

            fetch('https://nedatool-worker.benlinux915.workers.dev/fetch-data')
                .then(res => res.json())
                .then(data => {
                    this.updateCountyData(data);
                    if (this.getLoaderCountyData === true) {
                        this.updateLoaderCountyData(false);
                    }
                });
        }

    constructor() {
        this.downloadFinalYearMonth()
        this.downloadCountyGeojson()
        this.downloadCountyData()
    }

}

