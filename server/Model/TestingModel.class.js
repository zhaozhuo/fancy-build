const path = require('path')
const db = require('../sequelize')
const ModelClass = require('./Model.class')
const table = 'testing'

const definition = db.define(`${db.options.prefix}testing`, {
  name: {
    type: db.Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    // field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  pid: {
    type: db.Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },
  age: {
    type: db.Sequelize.INTEGER(1).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    // validate: { min: 0, max: 90 }
  },
  birthday: {
    type: db.Sequelize.DATE,
    allowNull: false,
    defaultValue: db.Sequelize.NOW(),
  },
  version: {
    type: db.Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  }
}, {
    // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#indexes
    indexes: [
      {
        unique: false,
        fields: ['pid']
      },
    ],
    engine: 'InnoDB', // InnoDB MYISAM
    comment: 'user table',
    freezeTableName: true, // alter the model name to get the table name
    timestamps: true, //Adds createdAt and updatedAt timestamps to the model
    createdAt: 'ctime', // alias
    updatedAt: 'utime', // alias
    hooks: {
      beforeValidate(obj) {
      },
    }
  })

class Model extends ModelClass {
  constructor(db) {
    super(db)
  }
}

module.exports = new Model(definition)
