var util = require('util');

function Key(root, cb) {
    this.root = root;
    if (cb) cb(this);
}

Key._options = {};
Key._options.propertySep = '.';
Key._options.memberSep = '#';
Key._options.collectionSep = ':';


Key.prototype.valueOf = function () { return this.root; };
Key.prototype.toString = function () { return this.root; };

Key.prototype.prop = function (name) {
    this.constructor.prototype[name] = function () {
        return new this.constructor(this.root + Key._options.propertySep + name);
    };
};

Key.prototype.collection = function (plural, singular, cbs) {
    if (arguments.length === 0 ) throw 'Collection name required';

    //Singular is optional
    if (arguments.length === 2 && typeof singular !== 'string') {
        cbs = singular;
        singular = undefined;
    }


    singular = singular || plural.substr(0, plural.length - 1);

    var SubKey = function(root, cb) {
        this.root = root;
        if (cb) cb(this);
    };
    util.inherits(SubKey, this.constructor);
    
    this.constructor.prototype[plural] = function () {
        return new SubKey(this.root + Key._options.collectionSep + plural, cbs && cbs.collection);
    };

    this.constructor.prototype[singular] = function (id) {
        return new SubKey(this.root + Key._options.collectionSep + singular + Key._options.memberSep + id, cbs && cbs.member);
    };
};

module.exports = Key;
