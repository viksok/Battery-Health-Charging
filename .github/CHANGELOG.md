Battery Health Charging Extension Changelogs
============================================
### Version 10 
Mar 28, 2023
* Add option to change index of system indicator in general prefs
* Re-add vendor checks for thinkpad with correct path as it conflicts with huawei which also uses the same sysfs path.
* Fix for Huawei. Used correct sysfs path.
* Added support for Panasonic devices and Intel QC71 devices

(Thanks to mascherm for raising issue and testing for Huawei laptop)


### Version 9
Mar 18, 2023
* Remove vendor checks for thinkpad.

(Thanks to kir-93 for raising issue and testing for thinkpad laptop)


### Version 8
Mar 17, 2023
* Added dell, msi and sys76 
* Seperated devices in different class
* Removed delay timer and update UI with signal on completion of writing and reading threshold value
* Changed/widen the range for end and start threshold for custom device

(Thanks to monethass for the testing and support for dell devices)
(Thanks to asant and anzigo for the testing and support for acer laptop)


### Version 7
Mar 3, 2023
* Do not detroy popupmenu during UIupdates instead. Instead just change/update the text and icon. Instead of updating everything, update only specific items that requires updates.
* Fixed Binding
* Added extension pref button in quicksettings
* Added option in Prefs to remove extension pref button from quicksettings
* Fixes for Gnome44
* Show mode in text quicksetting toggle subtitle (Gnome 44 only)
* Added option in Prefs to remove mode mode showing in quicksetting toggle subtitle
* Fixed initializing of pref if pref is open before enabling extension for the first time
* Destroy notification of this extension on extension disable
* Destroy notification on when new notification recieved.
* Added icon on popup menu showing current threshold read
* Updated spanish translation credit: Valeria


### Version 6
Feb 25, 2023
* Log only during installation and uninstalltion of polkit script


### Version 5
Feb 20, 2023
* Remove Glib timer on disable
* Fix notifcation


### Version 4
Feb 20, 2023
* Removed usage of systemd service to change permision of sysfs charge_control_end_threshold.
* Use Polkit for a way to write to sysfs threshold using root permission. (Ported from Deminder Shutdown timer)
* Pref UI changes
* Added option to disable notification
* Quick Setting UI changes
* Polkit: Fixed serveral issue, and issue checking of version of polkit and ctl
* Polkit: clean up and remove unneeded code
* Added support for more device. Thinkpad, acer, lenovo, huawei, sony, samsung, lg.
* Added notification to remove older systemd service files if detected.
* Added delay timer to delay updating panel and indicator UI so that threshold are written and read back from sysfs 
* Added more icon for different devices
(Thanks to yukina3230 for the testing and support for polkit)


### Version 3
Feb 8, 2023
* Added support for devices with start threshold as well
* Added notification during update
* Added a subtitle in pref showing acceptable range of customizable value


### Version 2
Feb 4, 2023
* Added Extension prefs button to notifcation prompt for installation
* Added notifcation upon sucessfull removal of systemd service file
 
 
### Version 1
Feb 3, 2023
* Initial Release.
* Works on asus device
* Uses systemd service to change permision of sysfs charge_control_end_threshold.
* Feature enable/disable system indicator, change icons, install systemd service, customizable threshold, notifications for installation, removal and error

