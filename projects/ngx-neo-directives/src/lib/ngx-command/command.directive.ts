// tslint:disable:indent

import { Directive, OnInit, OnDestroy, Input, ElementRef, InjectionToken, Renderer2 } from '@angular/core';
import { Subscription, Observable, Subject, BehaviorSubject, combineLatest, timer } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';

import { OnReturnDirective } from '../onReturn.directive';

export const COMMAND_CONFIG = new InjectionToken<string>('COMMAND_CONFIG');

export const COMMAND_DEFAULT_CONFIG: CommandOptions = {
	executingCssClass: 'executing',
};
/*
export function provideConfig(config: CommandOptions): any {
	return Object.assign({}, COMMAND_DEFAULT_CONFIG, config);
} */


/**
 *
 * ### Example with options
 * ```html
 * <button [command]='saveCmd' [commandOptions]='{executingCssClass: 'in-progress'}'>Save</button>
 * ```
 */
@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '[command]'
})
export class CommandDirective implements OnInit, OnDestroy {

	@Input() command: ICommand;
	@Input() commandOptions: CommandOptions;
	@Input() commandCanExecute: boolean;
	@Input() commandValue: any;
	@Input() stopPropagation = false;
	@Input() commandNextFocus: any;
	// @HostBinding('disabled') isDisabled: boolean;
	@Input() setEnabled = true;
	private canExecute$$: Subscription;
	private isExecuting$$: Subscription;

	private config: CommandOptions = COMMAND_DEFAULT_CONFIG;

	private ownDisabledState = false;
	private commandDisabledChanged = false;

	constructor(
		private renderer: Renderer2,
		private element: ElementRef
	) { }

	ngOnInit() {
		// console.log('[commandDirective::init]');
		this.commandOptions = Object.assign({}, this.config, this.commandOptions);

		if (!this.command) {
			throw new Error('[commandDirective] command should be defined!');
		} else {
			this.command.verifyCommandExecutionPipe();
			this.command.setNextFocus(this.commandNextFocus);
			this.command.setEnabledValue(this.setEnabled);
		}

		// if (this.element.nativeElement.localName === 'button') {
		// 	let thisAux = this;	// Set up a new observer
		// 	var observer = new MutationObserver(function(mutations) {
		// 		mutations.forEach(function(mutation) {
		// 			// Check the modified attributeName is "disabled"
		// 			if(!thisAux.commandDisabledChanged) {
		// 				if (mutation.attributeName === "disabled") {
		// 					thisAux.ownDisabledState = thisAux.element.nativeElement.disabled;
		// 				}
		// 			} else {
		// 				thisAux.commandDisabledChanged = false;
		// 			}
		// 		});
		// 	});
		// 	// Configure to only listen to attribute changes
		// 	var config = { attributes: true };
		// 	// Start observing myElem
		// 	observer.observe(this.element.nativeElement, config);
		// }

		this.canExecute$$ = this.command.canExecute$.pipe(
			tap(x => {
				if (this.element.nativeElement.localName === 'button') {
					this.commandDisabledChanged = true;
					if (this.commandValue == this.command.executingParam) {
						this.element.nativeElement.disabled = !x;
						// } else {
						// 	this.element.nativeElement.disabled = !(!this.ownDisabledState && x);
					}
				}
			})).subscribe();
		this.isExecuting$$ = this.command.isExecuting$.pipe(
			tap(x => {
        // console.log('[commandDirective::isExecuting$]', x);
        x ? this.renderer.addClass(this.element.nativeElement, this.commandOptions.executingCssClass) : this.renderer.removeClass(this.element.nativeElement, this.commandOptions.executingCssClass);
			})).subscribe();

		if (this.isMobileOperatingSystem()) {
			this.element.nativeElement.addEventListener('touchstart', async (event: MouseEvent) => {
				event.preventDefault();
				event.stopPropagation();
				if (this.element.nativeElement.localName === 'input') {
					return;
				}
				this.executeCommand();
			});
			this.element.nativeElement.addEventListener('focusin', async (event) => {
				event.preventDefault();
				event.stopPropagation();
				this.executeCommand();
			});
		} else {
			this.element.nativeElement.addEventListener('keydown', async (event: KeyboardEvent) => {
				if ((event.which === 13 || event.keyCode === 13)) {
					event.preventDefault();
					event.stopPropagation();
					this.executeCommand();
				}
			});
			this.element.nativeElement.addEventListener('click', async (event: MouseEvent) => {
				if (this.element.nativeElement.localName === 'input') {
					return;
				}
				event.preventDefault();
				if (this.stopPropagation) {
					event.stopPropagation();
				}
				this.executeCommand();
			});
		}

	}

	executeCommand(): void {
		if (!this.element.nativeElement.disabled) this.command.canExecute = true;
		this.command.verifyCommandExecutionPipe();
		this.command.execute(this.commandValue);
	}

	ngOnDestroy() {
		if (this.command) { this.command.destroy(); }
		if (this.canExecute$$) { this.canExecute$$.unsubscribe(); }
		if (this.isExecuting$$) { this.isExecuting$$.unsubscribe(); }
	}

	private isMobileOperatingSystem(): boolean {
		let isMobile = false;
		const userAgent = navigator.userAgent || navigator.vendor;

		// Windows Phone must come first because its UA also contains "Android"
		if (/windows phone/i.test(userAgent)) {
			isMobile = true; // "Windows Phone";
		} else if (/android/i.test(userAgent)) {
			isMobile = true; // "Android";
		} else if (/iPad|iPhone|iPod/.test(userAgent)) {
			// iOS detection from: http://stackoverflow.com/a/9039885/177710
			isMobile = true; // "iOS";
		}

		isMobile = false;

		return isMobile; // "unknown";
	}
}

export interface CommandOptions {
	/**
	 * Css Class which gets added/removed on the Command element's host while Command isExecuting$.
	 *
	 */
	executingCssClass: string;
}

export interface ICommand {

	executingParam: any;

	/**
	 * Determines whether the command is currently executing.
	 */
	isExecuting: boolean;
	isExecuting$?: Observable<boolean>;
	/**
	 * Determines whether the command can execute or not.
	 */
	canExecute: boolean;
	canExecute$?: Observable<boolean>;
	/**
	 * Execute function to invoke.
	 */
	execute(value?: any): void;

	/**
	 * Execute function to invoke and return a result in Promise.
	 */
	executeWithResult(value?: any): Promise<any>;
	/**
	 * Disposes all resources held by subscriptions.
	 */
	destroy(): void;

	verifyCommandExecutionPipe();

	setNextFocus(element: any);

	setEnabledValue(enable: boolean);

}


/**
 * Command object used to encapsulate information which is needed to perform an action.
 */
export class Command implements ICommand {

	isExecuting = false;
	isExecuting$ = new BehaviorSubject<boolean>(false);
	canExecute = true;
	canExecute$: Observable<boolean>;

	private executionPipe$ = new Subject<{}>();
	private isExecuting$$: Subscription;
	private canExecute$$: Subscription;
	private executionPipe$$: Subscription;

	private elementNextFocus: any;

	public result: Promise<any>;

	public asyncAction: (any) => any;
	public resultAsyncAction: any;

	public executingParam: any;

	private delaySubscribe: Subscription;

	private setEnabled = true;

	/**
	 * Creates an instance of Command.
	 */
	constructor(
		private executeParam: (any?) => any,
		canExecute$?: Observable<boolean>,
		private isAsync?: boolean,
		private delay?: number
	) {
		if (canExecute$) {
			this.canExecute$ = combineLatest(
				this.isExecuting$,
				canExecute$
				, (isExecuting, canExecuteResult) => {
					// console.log('[command::combineLatest$] update!', { isExecuting, canExecuteResult });
					this.isExecuting = isExecuting;
					this.canExecute = !isExecuting && canExecuteResult;
					return this.canExecute;
				});
			this.canExecute$$ = this.canExecute$.subscribe();
		} else {
			this.canExecute$ = this.isExecuting$.pipe(map(x => {
				const canExecute = !x;
				this.canExecute = canExecute;
				return canExecute;
			}));
			this.isExecuting$$ = this.isExecuting$.pipe(
				tap(x => this.isExecuting = x))
				.subscribe();
		}
		this.buildExecutionPipe(executeParam, isAsync, delay);
	}

	public verifyCommandExecutionPipe() {
		if (this.executionPipe$.observers.length === 0) {
			this.buildExecutionPipe(this.executeParam, this.isAsync, this.delay);
		}
	}

	execute(value?: any) {
		this.executingParam = value;
		this.executionPipe$.next(value);
	}

	async executeWithResult(value?: any): Promise<any> {
		this.executingParam = value;
		this.executionPipe$.next(value);
		return await this.result;
	}

	destroy() {
		if (this.executionPipe$$) {
			this.executionPipe$$.unsubscribe();
		}
		if (this.canExecute$$) {
			this.canExecute$$.unsubscribe();
		}
		if (this.isExecuting$$) {
			this.isExecuting$$.unsubscribe();
		}
		if (this.isExecuting$) {
			this.isExecuting$.complete();
		}

		if (this.asyncAction != null) {
			this.asyncAction = null;
			this.resultAsyncAction = null;
		}
	}

	private buildExecutionPipe(executeParm: (any?) => any, isAsync?: boolean, delay?: number) {
		let pipe$ = this.executionPipe$.pipe(
			filter(() => this.canExecute),
			tap(() => {
				this.isExecuting$.next(true);
				if (isAsync && this.asyncAction != null) { this.resultAsyncAction = this.asyncAction(undefined); }
			}));

		pipe$ = isAsync
			? pipe$.pipe(switchMap((value) => {
				if (delay && delay > 0) {
					if (this.delaySubscribe) { this.delaySubscribe.unsubscribe(); }
					const delayTimer = timer(delay);
					this.delaySubscribe = delayTimer.subscribe(t => { executeParm(value); });
					return Promise.resolve(null);
				} else {
					const result = executeParm(value);
					return Promise.resolve(result);
				}
			}))
			: pipe$.pipe(tap((value) => { executeParm(value); }));

		pipe$ = pipe$.pipe(tap(() => {
			// console.log('[command::excutionPipe$] do#2 - set idle');
			this.isExecuting$.next(false);
			this.executingParam = undefined;
			if (isAsync && this.asyncAction != null) { this.resultAsyncAction = this.asyncAction(this.resultAsyncAction); }
			OnReturnDirective.setNextFocus(this.elementNextFocus, this.setEnabled);
		},
			(e) => {
				console.log('[command::excutionPipe$] do#2 error - set idle' + e.toString());
				this.isExecuting$.next(false);
				this.executingParam = undefined;
				if (isAsync && this.asyncAction != null) { this.resultAsyncAction = this.asyncAction(this.resultAsyncAction); }
				this.buildExecutionPipe(executeParm, isAsync, delay);
			}));
		this.executionPipe$$ = pipe$.subscribe();
	}

	public setNextFocus(element: any) {
		this.elementNextFocus = element;
	}
	public setEnabledValue(enabled) {
		this.setEnabled = enabled;
	}
}
