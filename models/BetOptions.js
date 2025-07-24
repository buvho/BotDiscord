module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('Bets', {
        option_id: {
			type: DataTypes.id,
            primaryKey: true,
			allowNull: false,
            autoIncrement: true
		},
        bet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        wheight: {
            type: DataTypes.DECIMAL(4,2),
            defaultValue: 1
        }
    },{
		timestamps: false
	})
}
