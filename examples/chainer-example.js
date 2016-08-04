var Sequelize = require('sequelize');
var config = require('./config');
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    logging: false
});
var Person = sequelize.define('Person', {
    name: Sequelize.STRING
});
var Pet = sequelize.define('Pet', {
    name: Sequelize.STRING
});

Person.hasMany(Person, {
    as: 'Brothers'
});
Person.hasMany(Person, {
    as: 'Sisters'
});
Person.hasOne(Person, {
    as: 'Father',
    foreignKey: 'FatherId'
});
Person.hasOne(Person, {
    as: 'Mother',
    foreignKey: 'MotherId'
});
Person.hasMany(Pet);

var chainer = new Sequelize.Utils.QueryChainer;
var person = Person.build({
    name: 'Luke'
});
var mother = Person.build({
    name: 'Jane'
});
var father = Person.build({
    name: 'John'
});
var brother = Person.build({
    name: 'Brother'
});
var sister = Person.build({
    name: 'Sister'
});
var pet = Pet.build({
    name: 'Bob'
});

sequelize.sync({
    force: true
}).on('success', function () {
    chainer
        .add(person.save())
        .add(mother.save())
        .add(father.save())
        .add(brother.save())
        .add(sister.save())
        .add(pet.save());

    chainer.run().on('success', function () {

        person.setMother(mother).on('success', function () {
            person.getMother().on('success', function (mom) {
                console.log('my mom: ', mom.name)
            })
        })
        person.setFather(father).on('success', function () {
            person.getFather().on('success', function (dad) {
                console.log('my dad: ', dad.name)
            })
        })
        person.setBrothers([brother]).on('success', function () {
            person.getBrothers().on('success', function (brothers) {
                console.log("my brothers: " + brothers.map(function (b) {
                    return b.name
                }))
            })
        })
        person.setSisters([sister]).on('success', function () {
            person.getSisters().on('success', function (sisters) {
                console.log("my sisters: " + sisters.map(function (s) {
                    return s.name
                }))
            })
        })
        person.setPets([pet]).on('success', function () {
            person.getPets().on('success', function (pets) {
                console.log("my pets: " + pets.map(function (p) {
                    return p.name
                }))
            })
        })

    }).on('failure', function (err) {
        console.log(err)
    })
})
