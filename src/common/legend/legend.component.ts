import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter,
  SimpleChanges, OnChanges, ChangeDetectorRef, NgZone, ViewEncapsulation
 } from '@angular/core';
 import { formatLabel } from '../label.helper';

@Component({
  selector: 'ngx-charts-legend',
  template: `
    <div [style.width.px]="width">
      <header class="legend-title">
        <span class="legend-icon icon-eye"></span>
        <span class="legend-title-text">{{title}}</span>
      </header>
      <div class="legend-wrap">
        <ul class="legend-labels"
          [style.max-height.px]="height - 45">
          <li
            *ngFor="let entry of legendEntries; trackBy: trackBy"
            class="legend-label">
            <ngx-charts-legend-entry
              [label]="entry.label"
              [formattedLabel]="entry.formattedLabel"
              [color]="entry.color"
              [isActive]="isActive(entry)"
              (select)="labelClick.emit($event)"
              (activate)="activate($event)"
              (deactivate)="deactivate($event)">
            </ngx-charts-legend-entry>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./legend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.chart-legend]': 'true',
    '[class.legend-position-left]': `position === 'left'`,
    '[class.legend-position-right]': `position === 'right'`,
    '[class.legend-position-top]': `position === 'top'`,
    '[class.legend-position-bottom]': `position === 'bottom'`
  }
})
export class LegendComponent implements OnChanges {

  @Input() data: any;
  @Input() colors: any;
  @Input() title: string;
  @Input() height: number;
  @Input() width: number;
  @Input() activeEntries: any[];
  @Input() position: string;

  @Output() labelClick: EventEmitter<any> = new EventEmitter();
  @Output() labelActivate: EventEmitter<any> = new EventEmitter();
  @Output() labelDeactivate: EventEmitter<any> = new EventEmitter();

  legendEntries: any[] = [];

  constructor(private cd: ChangeDetectorRef, private zone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.zone.run(() => {
      this.cd.markForCheck();
      this.legendEntries = this.getLegendEntries();
    });
  }

  getLegendEntries(): any[] {
    const items = [];

    for(const label of this.data) {
      const formattedLabel = formatLabel(label);

      const idx = items.findIndex((i) => {
        return i.label === formattedLabel;
      });

      if (idx === -1) {
        items.push({
          label,
          formattedLabel,
          color: this.colors.getColor(label)
        });
      }
    }

    return items;
  }

  isActive(entry): boolean {
    if(!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {      
      return entry.label === d.name;
    });
    return item !== undefined;
  }

  activate(item) {
    this.zone.run(() => {
      this.labelActivate.emit(item);
    });
  }

  deactivate(item) {
    this.zone.run(() => {
      this.labelDeactivate.emit(item);
    });
  }

  trackBy(index, item): string {
    return item.label;
  }

}
