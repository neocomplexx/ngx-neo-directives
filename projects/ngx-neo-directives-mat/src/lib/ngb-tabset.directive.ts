import { Directive, HostListener, Input } from '@angular/core';
import type { OnInit, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ITabChangeController } from './models';
import { MatTabGroup } from '@angular/material/tabs';
/**
 * @author slarrieu
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[tabSelectedId], [tabChangeController]',
})
export class NgbTabSetDirective implements OnInit, OnDestroy {
    protected el: MatTabGroup;
    protected tabSelectedIdSubscribe: Subscription;

    @Input() tabSelectedId: BehaviorSubject<number>;

    @Input() tabChangeController: ITabChangeController;

    protected onTabChanging: boolean;

    constructor(protected _el: MatTabGroup) {
        this.el = this._el;
        this.onTabChanging = false;
    }

    ngOnInit() {

       // this.el._handleClick = this.interceptTabChange.bind(this);

        if (this.tabSelectedId) {
            this.tabSelectedIdSubscribe = this.tabSelectedId.subscribe((tabSelectedId) => {
                if (tabSelectedId > -1) {
                    // const previousValue = this.tabSelectedId.value;
                    if (this.el.selectedIndex !== tabSelectedId) {
                        this.el.selectedIndex = tabSelectedId;
                    }
                }
            });
        }
    }

/*     interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
        if (this.onTabChanging) {
            return true;
        }
        this.onTabChanging = true;
        let canChange = true;
        if (this.tabChangeController) {
            canChange = await this.tabChangeController.canChangeTab();
        }
        this.onTabChanging = false;

        return canChange && MatTabGroup.prototype._handleClick.apply(this.el, arguments);
    } */

    ngOnDestroy() {
        if (this.tabSelectedIdSubscribe) { this.tabSelectedIdSubscribe.unsubscribe(); }
    }


    private cambiarTab($event: any, force: boolean = false) {
        const tabSelecting = $event.nextId;
        if (force || this.tabSelectedId.value !== tabSelecting) {
            this.tabSelectedId.next(tabSelecting);
        }
    }

}
