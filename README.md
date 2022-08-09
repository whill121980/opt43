This is a small webapp designed to help generate DHCP option 43 strings for various wireless LAN controllers on various DHCP servers. 

The currently supported WLAN controllers are:
    
    Ruckus:
        SmartZone/VirtualSmartzone
        ZoneDirector
    Cisco:
        Aironet
    Ubiquity:
        Unifi
    Fortinet:
        Old
        New (CAPWAP)
    Cambium:
        cnMaestro
    Aruba

The currently supported DHCP servers are:

    Windows Server
    Sonicwall
    Cisco ASA
    Nomadix Hospitality Gateway
    Juniper SRX
    pfSense/opnSense

To use, you simply browse to the page, select the WLAN controller and DHCP server from the dropdowns and enter the list of IP address(es) of your WLAN controller node(s) and the option 43 string wil automatically generate. If you have more than 1 WLAN controller node that you want to include, simply add each IP address separated by a comma (,)

If you would like to test this web app before (or instead of) downloading it, you can see it in action at https://www.theuninformed.net/opt43.html

If you are interested in contributing to this project, please reach out to whill@mu-world.net.

Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
