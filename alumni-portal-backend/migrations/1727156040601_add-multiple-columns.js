exports.up = async (pgm) => {
    // Add multiple columns to 'users' table
    pgm.addColumns('users', {
        age: { type: 'integer', notNull: false },
        address: { type: 'varchar(255)', notNull: false },
        isActive: { type: 'boolean', default: true }
    });
};

exports.down = async (pgm) => {
    // Drop the columns in reverse order to avoid dependency issues
    pgm.dropColumns('users', ['age', 'address', 'isActive']);
};