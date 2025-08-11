# When's My Next Bus - Alexa Skill

This is a simple app that connects into the Brisbane translink API to get the next bus estimated time (real-time). Only works on a pre-configured specific bus stop.

If a bus number is supplied, it will give the info for that specific bus, otherwise it will return the estimated time for the next bus to stop at the designated stop id.

**Examples**

> 'Alexa, when's the next 377'
> 
> -> "The next 377 bus is in 5mins"

> 'Alexa, when's the next 375'
>
> -> "The next 375 bus is in 3mins"

> 'Alexa, when's my next bus'
>
> -> "The next 377 is in 7mins"

## Translink URL

The URL for the bus stop near my place is https://jp.translink.com.au/api/stop/timetable/001924

Stop IDs can be found by searching here: https://jp.translink.com.au/plan-your-journey/stops
