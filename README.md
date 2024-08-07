# ionic-pullup for Ionic 8 and Angular 18

A pull-up footer component for Ionic. The pull-up footer is a UI component built on top of Ionic's footer and offers an efficient way to hide/reveal information. The footer can fully expand to cover the content area of the screen or can be configured to expand to a maximum height. 
The component will compute the available screen height providing for header and tabs.


https://user-images.githubusercontent.com/3749268/184557012-471db4e7-a409-4c79-8566-5476754db0d5.mov


*See [demo page](http://arielfaur.github.io/ionic-pullup)*

## Usage

1. Install from NPM

    ```
    npm install ionic-pullup@latest hammerjs @types/hammerjs
    ```

2. Import IonicPullupModule in page module 

    ```typescript
    import { IonicPullupModule } from 'ionic-pullup';

    @NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ...
        IonicPullupModule
    ]
    })
    export class MyPageModule {}
    ```

3. Add component to page template
    
    Add a `lib-ionic-pullup` element after the template's `ion-content` element (if any).

    Declare a two-way binding `state` to control component states **collapsed** or **expanded**.
    Use a function to toggle states such as `toggleFooter()` in the example below.

    Mark elements in the template that should respond to drag events with the `#ionDragFooter` template variable.

    Use optional parameters `toolbarTopMargin` to set a top boundary (margin) for the footer to expand, and `minBottomVisible` to set a footer area to be always visible (minimum).

    Finally, use `onExpand` and `onCollapse` events to capture footer events if required.

    ```html
    <ion-header>
        <ion-toolbar>
            <ion-title>
            Home
            </ion-title>
        </ion-toolbar>
    </ion-header>
    
    <ion-content>
        ...home page content...
    </ion-content>

    <lib-ionic-pullup (onExpand)="footerExpanded()" (onCollapse)="footerCollapsed()" [(state)]="footerState" [toolbarTopMargin]="100" [minBottomVisible]="200">

    <ion-toolbar color="light" (click)="toggleFooter()" #ionDragFooter>
        <ion-title>Tap or drag</ion-title>
    </ion-toolbar>
    <ion-content>        
        ...scrollable content within footer...
    </ion-content>
    </lib-ionic-pullup>
    ```


4. Declare initial state in page component

    
    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { IonPullUpFooterState} from 'ionic-pullup';

    @Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
    })
    export class HomePage implements OnInit {
        footerState: IonPullUpFooterState;

        constructor() {}

        ngOnInit() {
            this.footerState = IonPullUpFooterState.Collapsed;
        }

        // optional capture events
        footerExpanded() {
            console.log('Footer expanded!');
        }

        // optional capture events
        footerCollapsed() {
            console.log('Footer collapsed!');
        }

        // toggle footer states
        toggleFooter() {
            this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
        }

        }
        ```
    


