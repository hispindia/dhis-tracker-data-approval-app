# dhis-Tracker-Reports

A dhis2 app based report for Tracker and Event based data.
Parameters to select : 
* Organisation Unit
* Start Date
* End Date
* Program

Based on the selectetd parameters the data is shown on the screen which is also downloadable in excel. For Tracker Based report
data for all progam stages is shown in a consolidated manner on a single screen.

The app uses SQL Views to fetch data and creates them on startup.

Installation : Upload the zip file into DHIS2 through app manager module.

###### TO DO :
 * Data intensive functions to be run in separate threads
 * Improvement in UI
 * Reduce number of SQL Views

