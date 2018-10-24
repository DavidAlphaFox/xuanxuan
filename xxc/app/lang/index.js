import LANG_ZH_CN from './zh-cn.json';
import {format as formatString} from '../utils/string-helper';

const DEFAULT_LANG = 'zh-cn';

const currentLangName = DEFAULT_LANG;
let langData = Object.assign({}, LANG_ZH_CN);

const update = (newLangData) => {
    langData = Object.assign(langData, newLangData);
};

/**
 * Get language setting and return string
 * @param  {string} name
 * @param  {string} defaultValue
 * @return {string}
 */
const string = (name, defaultValue) => {
    const value = langData[name];
    return value === undefined ? defaultValue : value;
};

/**
 * Format language string
 *
 * @param {String} name
 * @param {Array} args
 */
const format = (name, ...args) => {
    const str = string(name);
    if (args && args.length) {
        try {
            return formatString(str, ...args);
        } catch (e) {
            throw new Error(`Cannot format lang string with key '${name}', the lang string is '${str}'.`);
        }
    }
    return str;
};

/**
 * Error
 *
 * @param {any} err
 * @memberof Lang
 */
const error = err => {
    if (typeof err === 'string') {
        return string(`error.${err}`, err);
    }
    let message = '';
    if (err.code) {
        message += string(`error.${err.code}`, `[Code: ${err.code}]`);
    }
    if (err.message && err.message !== err.code) {
        message += '(' + string(`error.${err.message}`, err.message) + ')';
    }
    if (err.formats) {
        if (!Array.isArray(err.formats)) {
            err.formats = [err.formats];
        }
        message = formatString(message, ...err.formats);
    }
    if (DEBUG) {
        console.collapse('LANG.error', 'redBg', message, 'redPale');
        console.error(err);
        console.groupEnd();
    }
    return message;
};

export default {
    update,
    format,
    string,
    error,

    get data() {
        return langData;
    },

    get name() {
        return currentLangName;
    }
};
