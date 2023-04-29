'use strict';
/* Dell SMC = Need smbios-battery-ctl from libsmbios  https://github.com/dell/libsmbios */
const {GLib, GObject} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Helper = Me.imports.lib.helper;
const {runCommandCtl} = Helper;

var DellSmBiosSingleBattery = GObject.registerClass({
    Signals: {'read-completed': {}},
}, class DellSmBiosSingleBattery extends GObject.Object {
    name = 'Dell wth smbios with Single Battery';
    type = 22;
    deviceNeedRootPermission = true;
    deviceHaveDualBattery = false;
    deviceHaveStartThreshold = true;
    deviceHaveVariableThreshold = true;
    deviceHaveBalancedMode = true;
    deviceHaveAdaptiveMode = true;
    deviceHaveExpressMode = true;
    iconForFullCapMode = '100';
    iconForBalanceMode = '080';
    iconForMaxLifeMode = '060';
    endFullCapacityRangeMax = 100;
    endFullCapacityRangeMin = 80;
    endBalancedRangeMax = 85;
    endBalancedRangeMin = 65;
    endMaxLifeSpanRangeMax = 85;
    endMaxLifeSpanRangeMin = 55;
    startFullCapacityRangeMax = 95;
    startFullCapacityRangeMin = 75;
    startBalancedRangeMax = 80;
    startBalancedRangeMin = 60;
    startMaxLifeSpanRangeMax = 80;
    startMaxLifeSpanRangeMin = 50;
    minDiffLimit = 5;

    isAvailable() {
        const havePath = GLib.find_program_in_path('smbios-battery-ctl');
        if (havePath !== null)
            return true;
        return false;
    }

    async setThresholdLimit(chargingMode) {
        const settings = ExtensionUtils.getSettings();
        let output, filteredOutput, splitOutput, firstLine, secondLine, endValue, startValue;
        if (chargingMode !== 'adv' && chargingMode !== 'exp') {
            endValue = settings.get_int(`current-${chargingMode}-end-threshold`);
            startValue = settings.get_int(`current-${chargingMode}-start-threshold`);
            if ((endValue - startValue) < 5)
                startValue = endValue - 5;
        }
        output = await runCommandCtl('DELL_SMBIOS_BAT_READ', null, null, true);
        filteredOutput = output.trim().replace('(', '').replace(')', '').replace(',', '').replace(/:/g, '');
        splitOutput = filteredOutput.split('\n');
        firstLine = splitOutput[0].split(' ');
        if (firstLine[0] === 'Charging' && firstLine[1] === 'mode') {
            let modeRead = firstLine[2];
            if (((modeRead === 'adaptive') && (chargingMode === 'adv')) || ((modeRead === 'express') && (chargingMode === 'exp'))) {
                this.mode = chargingMode;
                this.startLimitValue = 100;
                this.endLimitValue = 95;
                this.emit('read-completed');
                return 0;
            } else if ((modeRead === 'custom') && ((chargingMode === 'ful') || (chargingMode === 'bal') || (chargingMode === 'max'))) {
                secondLine = splitOutput[1].split(' ');
                if (secondLine[0] === 'Charging' && secondLine[1] === 'interval') {
                    if ((parseInt(secondLine[2]) === startValue) && (parseInt(secondLine[3]) === endValue)) {
                        this.mode = chargingMode;
                        this.startLimitValue = startValue;
                        this.endLimitValue = endValue;
                        this.emit('read-completed');
                        return 0;
                    }
                }
            }
        }

        let arg2, arg3;
        if (chargingMode === 'adv' || chargingMode === 'exp') {
            arg2 = chargingMode;
            arg3 = null;
        } else {
            arg2 = `${endValue}`;
            arg3 = `${startValue}`;
        }
        await runCommandCtl('DELL_SMBIOS_BAT_WRITE', arg2, arg3, false);
        output = await runCommandCtl('DELL_SMBIOS_BAT_READ', null, null, true);
        filteredOutput = output.trim().replace('(', '').replace(')', '').replace(',', '').replace(/:/g, '');
        splitOutput = filteredOutput.split('\n');
        firstLine = splitOutput[0].split(' ');
        if (firstLine[0] === 'Charging' && firstLine[1] === 'mode') {
            this.mode = firstLine[2];
            if (firstLine[2] === 'custom') {
                secondLine = splitOutput[1].split(' ');
                if (secondLine[0] === 'Charging' && secondLine[1] === 'interval') {
                    this.startLimitValue = parseInt(secondLine[2]);
                    this.endLimitValue = parseInt(secondLine[3]);
                }
            }
            this.emit('read-completed');
        }
        return 0;
    }
});
