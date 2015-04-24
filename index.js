var $ = require('jquery');
var Class = require('class');

var validRules = {
    'require': function(v) {
        return !!v && v.toString().replace(/^\s+|\s+$/g, "").length > 0;
    },
    'mobile': function(v) {
        return (/^\+?(86)?1[3458]\d{9}$/).test(v);
    },
    'date': function(v) {
        return (/^\d{4}-\d{2}-\d{2}$/).test(v);
    },
    'integer': function(v) {
        return (/^[1-9]{1}[\d]{0,}$/).test(v);
    },
    'float': function(v) {
        return (/^[\d\.]+$/).test(v);
    }
};
var dftOpt = {
    errCls: 'has-error'
};

/**
 *@method is
 *@param obj {} any javascript  variable
 *@param type {String} vairable type maybe. [Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String]
 *@return {Boolean}(if type is set) or {String}(type is undefined)
 **/
function is(obj, type) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    clas = clas.toLowerCase();
    return type ? obj !== undefined && obj !== null && clas === type : clas;
}
var Validate = Class({
    pass: true,
    errMsgList: [],
    data: {},
    initialize: function(formGroups) {
        var self = this;
        formGroups.forEach(function(formGroup) {
            self.validOneGroup(formGroup);
        });
        return self.pass;
    },
    getEl: function(el) {
        if (/^[a-zA-Z]{1}([a-zA-Z\-\_\.]+)?$/.test(el)) {
            return $('[name="' + el + '"]');
        } else {
            return $(el);
        }
    },
    validOneGroup: function(formGroup) {
        var self = this,
            el = this.getEl(formGroup.el),
            errEl = (formGroup.errEl ? this.getEl(formGroup.errEl) : el).parents('.form-group'),
            value = $.trim(el.val());

        errEl.on('click', function() {
            errEl.removeClass('has-error');
        });
        formGroup.rules.forEach(function(rule) {
            if (!self.checkRule(rule.key, value)) {
                self.errMsgList.push(rule.msg || el.attr('placeholder'));
                self.pass = false;
                errEl.addClass('has-error');
                return;
            }
            if (el.attr('type') === 'checkbox') {
                el.each(function(i) {
                    self.data[el.attr('name') + '[' + i + ']'] = $.trim($(this).val());
                });
            } else { // radio or input
                self.data[el.attr('name')] = $.trim(el.val());
            }
        });
    },
    checkRule: function(rule, value) {
        if (!rule) {
            return true;
        } else if (is(rule, 'string') && validRules[rule]) {
            if (!validRules[rule](value)) {
                return false;
            }
        } else if (is(rule, 'regexp')) {
            if (value !== '' && !(rule).test(value)) {
                return false;
            }
        } else {
            alert('invalid rule type');
            return false;
        }
        return true;
    }
});

module.exports = Validate;