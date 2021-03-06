/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*jshint jquery:true*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            "jquery",
            "mage/validation",
            "mage/translate"
        ], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    $.each({
        'validate-grouped-qty': [
            function (value, element, params) {
                var result = false;
                var total = 0;
                $(params).find('input[data-validate*="validate-grouped-qty"]').each(function (i, e) {
                    var val = $(e).val();
                    if (val && val.length > 0) {
                        result = true;
                        var valInt = parseInt(val, 10) || 0;
                        if (valInt >= 0) {
                            total += valInt;
                        } else {
                            result = false;
                            return result;
                        }
                    }
                });
                return result && total > 0;
            },
            'Please specify the quantity of product(s).'
        ],
        'validate-one-checkbox-required-by-name': [
            function (value, element, params) {
                var checkedCount = 0;
                if (element.type === 'checkbox') {
                    $('[name="' + element.name + '"]').each(function () {
                        if ($(this).is(':checked')) {
                            checkedCount += 1;
                            return false;
                        }
                    });
                }
                var container = '#' + params;
                if (checkedCount > 0) {
                    $(container).removeClass('validation-failed');
                    $(container).addClass('validation-passed');
                    return true;
                } else {
                    $(container).addClass('validation-failed');
                    $(container).removeClass('validation-passed');
                    return false;
                }
            },
            'Please select one of the options.'
        ],
        'validate-date-between': [
            function (value, element, params) {
                var minDate = new Date(params[0]),
                    maxDate = new Date(params[1]),
                    inputDate = new Date(element.value);
                minDate.setHours(0);
                maxDate.setHours(0);
                if (inputDate >= minDate && inputDate <= maxDate) {
                    return true;
                }
                var message = $.mage.__('Please enter a date between %min and %max.');
                this.dateBetweenErrorMessage = message.replace('%min', minDate).replace('%max', maxDate);
                return false;
            },
            function () {
                return this.dateBetweenErrorMessage;
            }
        ],
        'validate-dob': [
            function (val, element, params) {
                var dob = $(element).parents('.customer-dob');
                $(dob).find('.' + this.settings.errorClass).removeClass(this.settings.errorClass);
                var dayVal = $(dob).find(params[0]).find('input:text').val(),
                    monthVal = $(dob).find(params[1]).find('input:text').val(),
                    yearVal = $(dob).find(params[2]).find('input:text').val(),
                    dobLength = dayVal.length + monthVal.length + yearVal.length;
                if (params[3] && dobLength === 0) {
                    this.dobErrorMessage = 'This is a required field.';
                    return false;
                }
                if (!params[3] && dobLength === 0) {
                    return true;
                }
                var day = parseInt(dayVal, 10) || 0,
                    month = parseInt(monthVal, 10) || 0,
                    year = parseInt(yearVal, 10) || 0,
                    curYear = (new Date()).getFullYear();
                if (!day || !month || !year) {
                    this.dobErrorMessage = 'Please enter a valid full date.';
                    return false;
                }
                if (month < 1 || month > 12) {
                    this.dobErrorMessage = 'Please enter a valid month (1-12).';
                    return false;
                }
                if (year < 1900 || year > curYear) {
                    var validYearMessage = $.mage.__('Please enter a valid year (1900-%1).');
                    this.dobErrorMessage = validYearMessage.replace('%1', curYear.toString());
                    return false;
                }
                var validateDayInMonth = new Date(year, month, 0).getDate();
                if (day < 1 || day > validateDayInMonth) {
                    var validDateMessage = $.mage.__('Please enter a valid day (1-%1).');
                    this.dobErrorMessage = validDateMessage.replace('%1', validateDayInMonth.toString());
                    return false;
                }
                var today = new Date(),
                    dateEntered = new Date();
                dateEntered.setFullYear(year, month - 1, day);
                if (dateEntered > today) {
                    this.dobErrorMessage = $.mage.__('Please enter a date from the past.');
                    return false;
                }

                day = day % 10 === day ? '0' + day : day;
                month = month % 10 === month ? '0' + month : month;
                $(element).val(month + '/' + day + '/' + year);
                return true;
            },
            function () {
                return this.dobErrorMessage;
            }
        ]
    }, function (i, rule) {
        rule.unshift(i);
        $.validator.addMethod.apply($.validator, rule);
    });
}));