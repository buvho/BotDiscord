module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('Users', {
        user_id: {
			type: DataTypes.STRING,
			allowNull: false,
			primarykey: true
		},
		guild_id: {
			type: DataTypes.STRING,
			allowNull: false,
			primarykey: true,
		},
		balance: {
			type: DataTypes.INTEGER
		}
    }, {
		timestamps: false
	})
}
