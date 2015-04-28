var util = require('util');

var joinKeys = function(root, seperator, to) {
    if (!root || root === '')
        return ''+to;
    else
        return root + seperator + to;
};


function Key(options, cb) {
    if (typeof options === 'string') {
        options = { namespace: options };
    } else if (!cb && typeof options === 'function') {
        cb = options;
        options = {};
    }

    this.root = options.namespace || '';
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
        return new this.constructor(joinKeys(this.root, Key._options.propertySep, name));
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
        if (arguments.length !== 0) {
          throw new Error('Collections do not take a value, did you mean to call ' + singular + '("' + arguments[0] + '") instead of ' + plural + '("' + arguments[0] + '") ?')
        }
        return new SubKey(joinKeys(this.root, Key._options.collectionSep, plural), cbs && cbs.collection);
    };

    this.constructor.prototype[singular] = function (id) {
        var key = joinKeys(this.root, Key._options.collectionSep, singular) + Key._options.memberSep + id;

        if (!id) { throw Error("Getting '" + singular + "' requires an id, as you probably didn't mean to get the key: " + key); }

        return new SubKey(joinKeys(this.root, Key._options.collectionSep, singular) + Key._options.memberSep + id, cbs && cbs.member);
    };
};

module.exports = function (options, cb) {
    var Factory = function Factory(options, cb) {
        Key.call(this, options, cb);
    };

    util.inherits(Factory, Key);

    var factory = new Factory(options, cb);

    return factory;
};
