module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('Guilds', {
		guild_id: {
			type: DataTypes.STRING,
			allowNull: false,
			primarykey: true,
		},
		currency_name: {
			type: DataTypes.STRING,
            defaultValue: "Currency",
            allowNull: false,
		},
        starting_amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
		timestamps: false
	})
}
