const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Coach extends Model { };

Coach.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        team_name: {
            type: DataTypes.STRING,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'coach',
    }
);

module.exports = Coach;