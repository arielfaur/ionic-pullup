# v1.1.0

## This release requires Ionic 1.3 and Angular 1.5

Added ```allow-mid-range``` parameter prevents footer from stopping halfway when dragging (defaults to false)
Fixes #17 where footer position was wrong when used in multiple views with different template structures (tabs, headers)
Minor UI fixes and improvements

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