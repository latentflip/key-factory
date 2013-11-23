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
    Key.prototype[name] = function () {
        return new Key(this.root + Key._options.propertySep + name);
    };
};

Key.prototype.collection = function (plural, singular, cbs) {
    singular = singular || plural.substr(0, plural.length - 1);

    Key.prototype[plural] = function () {
        return new Key(this.root + Key._options.collectionSep + plural, cbs && cbs.collection);
    };

    Key.prototype[singular] = function (id) {
        return new Key(this.root + Key._options.collectionSep + singular + Key._options.memberSep + id, cbs && cbs.member);
    };
};

module.exports = Key;
