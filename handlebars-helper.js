'use strict';

var HandlebarsLayouts = require('handlebars-layouts');
var Helpers = require('handlebars-helpers');
var moment = require('moment');

module.exports = function (Handlebars) {
    Handlebars.registerHelper(HandlebarsLayouts(Handlebars));
    //  Helpers({handlebars: Handlebars});
    ['array', 'code', 'collection', 'comparison', 'date', 'fs', 'html', 'i18n', 'inflection', 'logging', 'markdown', 'match', 'math', 'misc', 'number', 'path', 'string', 'url'].forEach(function (name) {
        Helpers[name]({
            handlebars: Handlebars
        });
    });

    // dang ky rivetData helper block cho handlebars ở đây

    // rivetData helper, bat buoc key trong meta data cua content phai la 'rivetData'
    Handlebars.registerHelper('rivetData', obj => {
        if (obj.data.root.rivetData)
            return JSON.stringify(obj.data.root.rivetData);
        else
            return '{}';
    });
    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('json', function (obj) {
        return JSON.stringify(obj);
    });

    Handlebars.registerHelper('toString', function (obj) {
        return obj.toString();
    });
    Handlebars.registerHelper('removeIndex', function (url) {
        return url.replace('index.html', '');
    });
    Handlebars.registerHelper('shortName', function (name) {
        if (name !== undefined)
            return name.split('|').shift();
        else
            return '';
    });

    var lookupEx = function (obj, propertyPath) {
        if (!propertyPath.split) propertyPath = String(propertyPath);
        var props = propertyPath.split('.');
        var current = obj;
        while (props.length) {
            if (typeof current !== 'object') return undefined;
            current = current[props.shift()];
        }
        return current;
    };

    Handlebars.registerHelper('lookupCategory', function (obj, childPath, propertyPath) {
        if (!childPath.split) childPath = String(childPath);
        var chunks = childPath.split('.');
        var count = 0;
        var node = obj;
        chunks.some(function (name) {
            count++;
            var fullCategoryName = chunks.slice(0, count).join('.');
            var found = node.children.some(function (childNode) {
                if (childNode.category == fullCategoryName) {
                    node = childNode;
                    return true;
                }
                return false;
            });

            if (!found) {
                node = undefined;
                return true;
            }
            return false;
        });

        if (typeof (propertyPath) === 'string' && node != undefined) {
            return lookupEx(node, propertyPath);
        }
        return node;
    });

    /**
     * Lookup nested object
     */
    Handlebars.registerHelper('lookupEx', lookupEx);

    /**
     * return array of category from root to leaf of @param {string} childPath
     */
    Handlebars.registerHelper('genBreadcrumb', function (obj, childPath) {
        if (!childPath.split) childPath = String(childPath);
        var chunks = childPath.split('.');
        var count = 0;
        var node = obj;
        var ret = [];
        chunks.some(function (name) {
            count++;
            var fullCategoryName = chunks.slice(0, count).join('.');
            var found = node.children.some(function (childNode) {
                if (childNode.category == fullCategoryName) {
                    node = childNode;
                    ret.push(childNode);
                    return true;
                }
                return false;
            });

            if (!found) {
                ret = undefined;
                return true;
            }
            return false;
        });

        return ret;
    });

    var getDataMd = function (obj, accepts) {
        var cloneObj = {}
        Object.keys(obj).forEach(function (key) {
            if (accepts.includes(key))
                cloneObj[key] = obj[key];
        });
        return cloneObj;
    }
    Handlebars.registerHelper('ewData', function (listObj, accepts) {
        var newlist = []
        // console.log(listObj)   
        if (Array.isArray(listObj)) {
            var count = 0;
            listObj.forEach(function (item) {
                var row = getDataMd(item, accepts);
                row["RecordID"] = count + 1;
                newlist.push(row)
                count++;
            })
        }
        return new Handlebars.SafeString(JSON.stringify(newlist));
    });


    let findBySlug = function (AllCategoryFiles, slug) {
        //  console.log('findBySlug', slug, ', itemCount', AllCategoryFiles.length);
        try {
            var found = '';
            AllCategoryFiles.forEach(element => {
                //console.log('element.slug ', element.slug)
                if (slug === element.slug) {
                    //  console.log('found', element);
                    found = element;
                }
            })
            return found;
        } catch (err) {
            console.log(err)
            return '';
        }
    }

    Handlebars.registerHelper('find', findBySlug);

    Handlebars.registerHelper('if_even', function (conditional, options) {
        if ((conditional % 2) == 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('if_odd', function (conditional, options) {
        if ((conditional % 2) != 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    var Handlebars = require('handlebars');

    Handlebars.registerHelper("addition", function (value, options) {
        return parseInt(value) + 1;
    });

    Handlebars.registerHelper("capFirstLetter", function capitalizeFirstLetter(dateInput) {
        // console.log('dateInput', dateInput);
        return dateInput.charAt(0).toUpperCase() + dateInput.slice(1);
    });

    /**lấy bài viết mới nhất thỏa các điều kiện
     * không thuộc danh sách tiêu điểm
     * không có thuộc tính isMain : false
     *  ... */
    let lastArticles = function (AllCategoryFiles, dsTieuDiem, number) {
        if (number < 0 && number > 50) number = 10; //giá trị mặc định 
        console.log('lastArticles', number, dsTieuDiem);
        let danhsach = [];
        try {
            let count = 0;
            let sum = 0;
            for (let i = 0; i < AllCategoryFiles.length; i++) {
                if (sum >= number) continue;
                let baiviet = AllCategoryFiles[i];
                if (dsTieuDiem.includes(baiviet.slug)) {
                    console.log('baiviet.slug', baiviet.slug)
                } else if (baiviet.isMain == false) {
                    console.log('baiviet.isMain', baiviet.isMain)
                } else {
                    console.log('add', sum, i, baiviet.slug)
                    danhsach.push(baiviet);
                    sum++;
                }
            }
            return danhsach;
        } catch (err) {
            console.log(err)
        }
        return danhsach;
    }
    Handlebars.registerHelper("lastArticles", lastArticles);



};