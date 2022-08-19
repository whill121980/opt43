function updateForm() {
// declare variables for WLC type, DHCP server, and IP addresses
    var wlcSelect = document.getElementById("wlcList");
    var wlcValue = wlcSelect.value;
    var fwSelect = document.getElementById("fwList");
    var fwValue = fwSelect.value;
    let ipValue = document.getElementById('ipAddr').value;
    ipValue = ipValue.replace(/\s+/g, '');
    var ipTruncValue = removeTrailingComma(ipValue);
    var ipLen = ipTruncValue.length;
    var ipQuantity = ipValue.split(",").length;
    var ipQuanValue = (decimalToHex((ipQuantity * 4),2));

// Determine vendor ID of WLC
    switch (wlcValue) {
        case "zd":
            var vendorId = "03";
            break;
        case "vsz":
            var vendorId = "06";
            break;
        case "cisco":
            var vendorId = "f1";
            break;
        case "unifi":
            var vendorId = "01";
            break;
        default:
            var vendorId = "No data found";
    }
    
// Convert IP from ASCII to hex (not for Cisco WLCs)
    const convertToHex = (ip = '') => {
        const res = [];
        const { length: len } = ip; 
            for (let n = 0, l = len; n < l; n ++) {
                const hex = Number(ip.charCodeAt(n)).toString(16);
                res.push(hex);
            };
            return res.join('');
    }

// IP Validation functions
    function ipValidation(ip) {
            const validateIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
            return validateIp.test(ip);
        }
    
    function allIpsValid(ipAddrs) {
        var validIpArray = ipAddrs.split(',');
            validIpFilter = validIpArray.filter(function(e) { return e});
        return validIpFilter.every(element => ipValidation(element));
    }
    
    function ipValidList(ipAddrList) {
        var validIpList = ipAddrList.split(',');
        const returnValidIp = [];
        for (let valIpNum = 0; valIpNum < validIpList.length; valIpNum++) {
            const validIpRes = validIpList[valIpNum];
                if (ipValidation(validIpRes)) {
                    returnValidIp.push(validIpRes);
                } else if (!validIpRes) {
                } else {
                    returnValidIp.push("<font color='red'>" + validIpRes + " (INVALID)</font>");
                }
        }
            return returnValidIp.join(', ');
    }

// Convert decimal to hex, pad each byte to 2 characters
    function decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    }
    
// Cisco devices expect the IP's decimal value converted to hex 
// This function will individually convert each IP entered, and then combine the results into a single string 
    function ciscoIpArray(ipElem) {
        ipArray = ipElem.split(',');
        const ciscoIpRes = [];
        for (let ipNum = 0; ipNum < ipArray.length; ipNum++) {
            const ciscoIpResult = ciscoIpASA(ipArray[ipNum]);
            ciscoIpRes.push(ciscoIpResult);
        }
        return ciscoIpRes.join('');
        
    }

// Calculate hex value of the IP address for Cisco WLCs
    function ciscoIpASA(ciscoIp) {
        var [ciscoOctet1,ciscoOctet2,ciscoOctet3,ciscoOctet4] = ciscoIp.split('.');
        return decimalToHex(ciscoOctet1,2) + decimalToHex(ciscoOctet2,2) + decimalToHex(ciscoOctet3,2) + decimalToHex(ciscoOctet4,2);
    }

// Take the string and parse it to a Sonicwall-usable format (i.e. 0x<hex> and separated by semicolon) 
    function parseForSonicwall(string) {
        var parseString = string.split(/(..)/g).filter(s => s);
        const sonicwallHex = [];
        for (let i = 0; i < parseString.length; i++) {
            const sonicwallRes = parseString[i];
            sonicwallHex.push("0x" + sonicwallRes);
        }
        return sonicwallHex.join(';');
    }
    
// Take the string and parse it to a Windows-usable format (space-separated) 
    function parseForWindows(string) {
        var parseString = string.split(/(..)/g).filter(s => s);
        const windowsHex = [];
        for (let i = 0; i < parseString.length; i++) {
            const windowsRes = parseString[i];
            windowsHex.push(windowsRes);
        }
        return windowsHex.join(' ');
    }

// Take the string and parse it to a pfSense/opnSense-usable format (colon-separated) 
        function parseForpfSense(string) {
        var parseString = string.split(/(..)/g).filter(s => s);
        const pfsenseHex = [];
        for (let i = 0; i < parseString.length; i++) {
            const pfsenseRes = parseString[i];
            pfsenseHex.push(pfsenseRes);
        }
        return pfsenseHex.join(':');
    }

        function removeTrailingComma(value) {
            if (value.endsWith(',')) {
                return value.slice(0, -1);
            } 
            return value;
        }

// Generate the complete option 43 hex string based on the WLC type
    if (allIpsValid(ipValue)) {
        switch (wlcValue) {
            case "cisco":
            case "unifi":
                var opt43Result = vendorId + ipQuanValue + ciscoIpArray(removeTrailingComma(ipValue));
                break;
            case "vsz":
            case "zd":
                var opt43Result = vendorId + decimalToHex(ipLen) + convertToHex(removeTrailingComma(ipValue));
                break;
            default:
                var opt43Result = "No data found.";
        }
// Determine the firewall type to know if the hex values need the escape characters for each byte (i.e. Sonicwall)
        switch (fwValue) {
            case "sonicwall":
                document.getElementById('Opt43String').innerHTML = parseForSonicwall(opt43Result);
                document.getElementById('cliString').remove();
                break; 
            case "asa":
                document.getElementById('Opt43String').innerHTML = opt43Result;
                document.getElementById('cliString').innerHTML = 'CLI Command: <b>option 43 hex ' + opt43Result + '</b>'; 
                break;
            case "ndx":
                document.getElementById('Opt43String').innerHTML = "0x" + opt43Result;
                document.getElementById('cliString').remove();
                break;
            case "pfsense":
                document.getElementById('Opt43String').innerHTML = parseForpfSense(opt43Result);
                document.getElementById('cliString').remove();
                break;
            case "win":
                document.getElementById('Opt43String').innerHTML = parseForWindows(opt43Result);
                document.getElementById('cliString').remove();
                break;
            default:
                document.getElementById('Opt43String').innerHTML = "No data found.";
                document.getElementById('cliString').remove();
                break;
        }
    } else {
        document.getElementById('Opt43String').innerHTML = "You entered an invalid IP address. Please check your entries and submit again."
    }
    document.getElementById('ipAddressString').innerHTML = ipValidList(ipValue);
}
