var assert = require('assert');
var Key = require('./key.js');

var factory = new Key('myapp', function (f) {
    f.prop('version');
    f.collection('users', 'u'); //custom singularization
    f.collection('teams', {
        member: function (f) {
            f.prop('taskSeq');
            f.prop('tasks');
            f.prop('members');
        }
    });

    f.collection('foos', {
        member: function (f) {
            f.prop('bar');
        }
    });

    f.collection('bars', {
        member: function (f) {
            f.prop('foo');
        }
    });


});

assert.equal( factory.version(), 'myapp.version' );
assert.equal( factory.users(), 'myapp:users' );
assert.equal( factory.u('123'), 'myapp:u#123' );
assert.equal( factory.teams(), 'myapp:teams' );
assert.equal( factory.team('Foo'), 'myapp:team#Foo' );
assert.equal( factory.team('Foo').taskSeq(), 'myapp:team#Foo.taskSeq' );
assert.equal( factory.team('Foo').members(), 'myapp:team#Foo.members' );
assert.equal( factory.team('Foo').tasks(), 'myapp:team#Foo.tasks' );

assert.throws( function() { factory.taskSeq(); }, Error, 'Should die');


assert.equal( factory.foo('FooThing').bar(), 'myapp:foo#FooThing.bar' );
assert.equal( factory.bar('BarThing').foo(), 'myapp:bar#BarThing.foo' );



console.log('All tests passed!');
