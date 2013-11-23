var assert = require('assert');
var Key = require('./key.js');

var factory = new Key('myapp', function (f) {
    f.prop('version');
    f.collection('users');
    f.collection('teams', 'team', {
        member: function (f) {
            f.prop('taskSeq');
            f.prop('tasks');
            f.prop('members');
        }
    });
});

assert.equal( factory.version(), 'myapp.version' );
assert.equal( factory.users(), 'myapp:users' );
assert.equal( factory.user('123'), 'myapp:user#123' );
assert.equal( factory.teams(), 'myapp:teams' );
assert.equal( factory.team('Foo'), 'myapp:team#Foo' );
assert.equal( factory.team('Foo').taskSeq(), 'myapp:team#Foo.taskSeq' );
assert.equal( factory.team('Foo').members(), 'myapp:team#Foo.members' );
assert.equal( factory.team('Foo').tasks(), 'myapp:team#Foo.tasks' );


console.log('All tests passed!');
