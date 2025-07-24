module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('Bets', {
        bet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        guild_id: {
			type: DataTypes.STRING,
			allowNull: false,

		},
        type: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false, 
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}
