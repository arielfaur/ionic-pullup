# v1.1.0

## This release requires Ionic 1.3 and Angular 1.5

- Added ```allow-mid-range``` parameter prevents footer from stopping halfway when dragging (defaults to false)
- Fixes #17 where footer position was wrong when used in multiple views with different template structures (tabs, headers)
- Minor UI fixes and improvements

### Breaking changes
- Removed ```toggle``` attribute from ```ion-pull-up-handle``` directive in favor of two new attributes that allow for better control of icons: ```icon-expand``` and ```icon-collapse```. Also, there is not need to specify a default icon as a child element as the directive will add it to the DOM.

````
<ion-pull-up-handle icon-expand="ion-chevron-up" icon-collapse="ion-chevron-down" style="border-radius: 25px 25px 0 0">
</ion-pull-up-handle>
````

Thanks: @bianchimro, @nikolaz111, @jsanta

# v1.0.4
Added ```state``` parameter to dynamically set the footer state. ```state``` accepts an expression with the expected footer state. 

# v1.0.3
Fixes issue #1 where component height was wrong after changing device orientation

# v1.0.2

## Breaking change
Removed ```minimize``` attribute from ```ion-pull-up-footer``` directive and added two new attributes for better behavior

- initial-state: "collapsed" || "minimized"
- default-behavior: "expand" || "hide"

# v1.0.1
fixed DI issue in ```ion-pull-up-footer``` controller

# v1.0.0
Initial release
