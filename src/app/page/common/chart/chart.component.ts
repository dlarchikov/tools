import {Component, Input, OnInit} from '@angular/core'
import {NbColorHelper, NbThemeService} from '@nebular/theme'
import {IItems} from '../../../services/currency-history.service'
import * as moment from 'moment'

@Component({
    selector: 'ngx-common-chart',
    template: `
        <chart type="line" [data]="processedData" [options]="options"></chart>
    `,
    styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
    processedData: any
    @Input() title: string = ''
    options: any

    constructor(private theme: NbThemeService) {
    }

    @Input()
    set data(dataSet: IItems[]) {
        this.theme.getJsTheme().subscribe(config => {
            if (!dataSet) {
                return
            }

            const colors: any = config.variables
            const chartjs: any = config.variables.chartjs

            const keys: string[] = []
            const values: string[] = []

            dataSet.forEach((row) => {
                keys.push(moment(row.date * 1000).format('DD.MM.YY'))
                values.push(String(row.value))
            })

            this.processedData = {
                labels: keys,
                datasets: [{
                    data: values,
                    label: this.title,
                    backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                    borderColor: colors.primary,
                },
                ],
            }

            this.options = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: chartjs.axisLineColor,
                            },
                            ticks: {
                                fontColor: chartjs.textColor,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: chartjs.axisLineColor,
                            },
                            ticks: {
                                fontColor: chartjs.textColor,
                            },
                        },
                    ],
                },
                legend: {
                    labels: {
                        fontColor: chartjs.textColor,
                    },
                },
            }
        })
    }

    ngOnInit() {
    }

}
