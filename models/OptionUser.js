module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('Bets', {
        option_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
			type: DataTypes.STRING,
			allowNull: false,

		}
    },{
		timestamps: false
	})
}
