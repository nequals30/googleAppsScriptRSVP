# RSVP Form with Google Apps Script
Have you ever wanted an RSVP form for an event, but didn't want to use a third-party alternative which tracks your data, isn't customizable and costs money?

This is a fully DIY solution, and there are some advantages to doing it this way:

* __Convenience__: Your guest's RSVP responses automatically get saved to a Google Sheet and emailed to you.
* __Control__: Fully integrates into your website and styled by you. You control every detail. 
* __Simplicity__: No "backend" to maintain. Just one Javascript file, without dependencies, that can be hosted anywhere (e.g. Github Pages)
* __Price__: Free to use, don't need to pay for hosting.
* __Privacy__: you're collecting the data yourself.

---
### Overview
![Summary](/tutorial_images/googleRSVP_summary.jpg)

Here is an overview of how the process works:

1. Your guests __enter their name__ (or the name of one of the guests in their party)
2. It checks whether they are on the guest list
3. It __makes the RSVP form__ for all the guests in that guest's party
4. It __saves their submission__ back to the Google Sheet 
5. It __sends you an email__ with their results
6. It __marks them as having RSVP'd__, so they can't RSVP again

